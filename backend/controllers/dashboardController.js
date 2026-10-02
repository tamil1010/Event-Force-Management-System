const Event = require('../models/Event');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// @desc    Get Admin Dashboard Statistics & Analytics
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    const activeEvents = await Event.countDocuments({ status: 'Active' });
    const completedEvents = await Event.countDocuments({ status: 'Completed' });
    const cancelledEvents = await Event.countDocuments({ status: 'Cancelled' });

    const totalForceMembers = await User.countDocuments({ role: 'Staff/Force Member' });
    const availableForceMembers = await User.countDocuments({ role: 'Staff/Force Member', availabilityStatus: 'Available' });
    const assignedForceMembers = await User.countDocuments({ role: 'Staff/Force Member', availabilityStatus: 'Assigned' });
    const onLeaveForceMembers = await User.countDocuments({ role: 'Staff/Force Member', availabilityStatus: 'On Leave' });

    const totalManagers = await User.countDocuments({ role: 'Event Manager' });

    // Recent events list
    const recentEvents = await Event.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Force distribution by department
    const departmentDistribution = await User.aggregate([
      { $match: { role: 'Staff/Force Member' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly event chart data
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
          active: activeEvents,
          completed: completedEvents,
          cancelled: cancelledEvents,
        },
        force: {
          total: totalForceMembers,
          available: availableForceMembers,
          assigned: assignedForceMembers,
          onLeave: onLeaveForceMembers,
          managers: totalManagers,
        },
        recentEvents,
        departmentDistribution,
        eventsByCategory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Event Manager Dashboard Statistics
// @route   GET /api/dashboard/manager
// @access  Private (Admin & Event Manager)
const getManagerStats = async (req, res) => {
  try {
    const managerId = req.user._id;

    const managedEvents = await Event.find({ createdBy: managerId }).sort({ date: 1 });
    const totalManaged = managedEvents.length;
    const upcomingManaged = managedEvents.filter(e => e.status === 'Upcoming').length;
    const activeManaged = managedEvents.filter(e => e.status === 'Active').length;

    // Calculate total required vs total assigned staff for manager's events
    const totalRequiredStaff = managedEvents.reduce((acc, curr) => acc + curr.requiredForce, 0);
    const totalAssignedStaff = managedEvents.reduce((acc, curr) => acc + curr.assignedForceCount, 0);

    const availableStaffCount = await User.countDocuments({
      role: 'Staff/Force Member',
      availabilityStatus: 'Available',
    });

    res.json({
      success: true,
      data: {
        totalManaged,
        upcomingManaged,
        activeManaged,
        totalRequiredStaff,
        totalAssignedStaff,
        availableStaffCount,
        managedEvents: managedEvents.slice(0, 6),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Staff / Force Member Dashboard Statistics
// @route   GET /api/dashboard/staff
// @access  Private (Staff/Force Member, Admin, Manager)
const getStaffStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const assignments = await Assignment.find({ forceMemberId: userId })
      .populate('eventId')
      .populate('assignedBy', 'name email role')
      .sort({ createdAt: -1 });

    const totalAssignments = assignments.length;
    const upcomingAssignments = assignments.filter(a => a.eventId && a.eventId.status === 'Upcoming');
    const activeAssignments = assignments.filter(a => a.eventId && a.eventId.status === 'Active');
    const completedAssignments = assignments.filter(a => a.status === 'Completed' || (a.eventId && a.eventId.status === 'Completed'));

    const userProfile = await User.findById(userId).select('availabilityStatus department phone avatar name email role');

    res.json({
      success: true,
      data: {
        summary: {
          totalAssignments,
          upcoming: upcomingAssignments.length,
          active: activeAssignments.length,
          completed: completedAssignments.length,
        },
        profile: userProfile,
        upcomingAssignments: upcomingAssignments.slice(0, 5),
        allAssignments: assignments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getManagerStats,
  getStaffStats,
};
