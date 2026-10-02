const Assignment = require('../models/Assignment');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { checkScheduleConflict } = require('../utils/conflictChecker');

// @desc    Assign staff member to an event
// @route   POST /api/assignments
// @access  Private (Admin & Event Manager)
const assignStaff = async (req, res) => {
  try {
    const { eventId, forceMemberId, roleInEvent, note } = req.body;

    if (!eventId || !forceMemberId) {
      return res.status(400).json({ success: false, message: 'Please provide eventId and forceMemberId' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const staff = await User.findById(forceMemberId);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Check if staff is already assigned to this event
    const existingAssignment = await Assignment.findOne({ eventId, forceMemberId });
    if (existingAssignment) {
      return res.status(400).json({ success: false, message: 'Staff member is already assigned to this event' });
    }

    // Schedule Conflict Check: Prevent double-booking staff member at overlapping event times
    const conflictResult = await checkScheduleConflict(forceMemberId, eventId);
    if (conflictResult.hasConflict) {
      const c = conflictResult.conflictingEvent;
      return res.status(400).json({
        success: false,
        message: `Schedule Conflict: ${staff.name} is already assigned to '${c.name}' on ${c.date} (${c.startTime} - ${c.endTime}) at ${c.location}.`,
        conflict: c,
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      eventId,
      forceMemberId,
      assignedBy: req.user._id,
      roleInEvent: roleInEvent || 'Event Support Staff',
      note: note || '',
      status: 'Assigned',
    });

    // Update assigned counter on Event
    const totalAssignments = await Assignment.countDocuments({ eventId, status: { $ne: 'Declined' } });
    event.assignedForceCount = totalAssignments;
    await event.save();

    // Update staff availability status
    staff.availabilityStatus = 'Assigned';
    await staff.save();

    // Send Notification to Staff Member
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    await Notification.create({
      recipient: forceMemberId,
      sender: req.user._id,
      title: 'New Event Assignment',
      message: `You have been assigned to '${event.name}' on ${formattedDate} (${event.startTime} - ${event.endTime}) at ${event.location}.`,
      type: 'Assignment',
      link: `/events/${eventId}`,
    });

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('eventId')
      .populate('forceMemberId', 'name email department phone avatar availabilityStatus')
      .populate('assignedBy', 'name email role');

    res.status(201).json({
      success: true,
      data: populatedAssignment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove staff assignment from event
// @route   DELETE /api/assignments/:id
// @access  Private (Admin & Event Manager)
const removeAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const { eventId, forceMemberId } = assignment;

    await assignment.deleteOne();

    // Update assigned force counter on event
    const totalAssignments = await Assignment.countDocuments({ eventId, status: { $ne: 'Declined' } });
    await Event.findByIdAndUpdate(eventId, { assignedForceCount: totalAssignments });

    // Check if staff has any remaining active assignments
    const remainingAssignmentsCount = await Assignment.countDocuments({
      forceMemberId,
      status: { $in: ['Assigned', 'Confirmed'] },
    });

    if (remainingAssignmentsCount === 0) {
      await User.findByIdAndUpdate(forceMemberId, { availabilityStatus: 'Available' });
    }

    res.json({
      success: true,
      message: 'Assignment removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update assignment status (e.g. staff member confirming or declining)
// @route   PUT /api/assignments/:id/status
// @access  Private
const updateAssignmentStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!['Assigned', 'Confirmed', 'Declined', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid assignment status' });
    }

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Only assigned staff, manager, or admin can update status
    if (
      req.user.role === 'Staff/Force Member' &&
      assignment.forceMemberId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this assignment' });
    }

    assignment.status = status;
    if (note !== undefined) assignment.note = note;
    await assignment.save();

    // Update event counter if status changed to Declined
    const totalAssignments = await Assignment.countDocuments({
      eventId: assignment.eventId,
      status: { $ne: 'Declined' },
    });
    await Event.findByIdAndUpdate(assignment.eventId, { assignedForceCount: totalAssignments });

    // Update staff member availability if declined or completed
    if (status === 'Declined') {
      const activeAssignments = await Assignment.countDocuments({
        forceMemberId: assignment.forceMemberId,
        status: { $in: ['Assigned', 'Confirmed'] },
      });
      if (activeAssignments === 0) {
        await User.findByIdAndUpdate(assignment.forceMemberId, { availabilityStatus: 'Available' });
      }
    }

    const updatedAssignment = await Assignment.findById(assignment._id)
      .populate('eventId')
      .populate('forceMemberId', 'name email department phone avatar')
      .populate('assignedBy', 'name email role');

    res.json({
      success: true,
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assignments for specific event
// @route   GET /api/assignments/event/:eventId
// @access  Private
const getEventAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ eventId: req.params.eventId })
      .populate('forceMemberId', 'name email department phone avatar availabilityStatus role')
      .populate('assignedBy', 'name email role');

    res.json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assignments for logged-in user or specified force member
// @route   GET /api/assignments/my-assignments
// @access  Private
const getMemberAssignments = async (req, res) => {
  try {
    const userId = req.user._id;

    const assignments = await Assignment.find({ forceMemberId: userId })
      .populate({
        path: 'eventId',
        populate: { path: 'createdBy', select: 'name email department' },
      })
      .populate('assignedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  assignStaff,
  removeAssignment,
  updateAssignmentStatus,
  getEventAssignments,
  getMemberAssignments,
};
