const Event = require('../models/Event');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// @desc    Get all events with filters (status, category, search)
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ date: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event by ID with assigned staff
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email role department avatar');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Fetch assignments for this event
    const assignments = await Assignment.find({ eventId: req.params.id })
      .populate('forceMemberId', 'name email phone department role avatar availabilityStatus')
      .populate('assignedBy', 'name email role');

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        assignments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin & Event Manager)
const createEvent = async (req, res) => {
  try {
    const { name, description, category, date, startTime, endTime, location, requiredForce, bannerUrl } = req.body;

    if (!name || !date || !startTime || !endTime || !location || !requiredForce) {
      return res.status(400).json({ success: false, message: 'Please provide all required event details' });
    }

    const event = await Event.create({
      name,
      description: description || '',
      category: category || 'General',
      date,
      startTime,
      endTime,
      location,
      requiredForce: Number(requiredForce),
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      createdBy: req.user._id,
      status: 'Upcoming',
    });

    const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      data: populatedEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update event details
// @route   PUT /api/events/:id
// @access  Private (Admin & Event Manager)
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check ownership if user is Event Manager
    if (req.user.role === 'Event Manager' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email role');

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete event & clean up assignments
// @route   DELETE /api/events/:id
// @access  Private (Admin & Event Manager)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.user.role === 'Event Manager' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    // Get assigned members to reset their status
    const assignments = await Assignment.find({ eventId: event._id });
    for (const assign of assignments) {
      await User.findByIdAndUpdate(assign.forceMemberId, { availabilityStatus: 'Available' });
    }

    // Remove assignments
    await Assignment.deleteMany({ eventId: event._id });
    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event and associated force assignments deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
