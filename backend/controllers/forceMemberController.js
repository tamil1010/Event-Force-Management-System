const User = require('../models/User');
const Assignment = require('../models/Assignment');

// @desc    Get force/staff members list
// @route   GET /api/force-members
// @access  Private
const getForceMembers = async (req, res) => {
  try {
    const { department, availabilityStatus, search } = req.query;
    const filter = { role: 'Staff/Force Member' };

    if (department) {
      filter.department = department;
    }

    if (availabilityStatus) {
      filter.availabilityStatus = availabilityStatus;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const forceMembers = await User.find(filter).select('-password').sort({ name: 1 });

    res.json({
      success: true,
      count: forceMembers.length,
      data: forceMembers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single force member by ID with assignment details
// @route   GET /api/force-members/:id
// @access  Private
const getForceMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');

    if (!member) {
      return res.status(404).json({ success: false, message: 'Force member not found' });
    }

    // Get assignments
    const assignments = await Assignment.find({ forceMemberId: req.params.id })
      .populate('eventId')
      .populate('assignedBy', 'name email role');

    res.json({
      success: true,
      data: {
        ...member.toObject(),
        assignments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update force member availability / status
// @route   PUT /api/force-members/:id/availability
// @access  Private (Admin & Event Manager or Self)
const updateAvailability = async (req, res) => {
  try {
    const { availabilityStatus } = req.body;

    if (!['Available', 'Assigned', 'On Leave'].includes(availabilityStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid availability status' });
    }

    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Force member not found' });
    }

    member.availabilityStatus = availabilityStatus;
    await member.save();

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update force member role / department (Admin only)
// @route   PUT /api/force-members/:id/role
// @access  Private (Admin only)
const updateForceMember = async (req, res) => {
  try {
    const { role, department, status, phone, name } = req.body;

    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) member.role = role;
    if (department) member.department = department;
    if (status) member.status = status;
    if (phone !== undefined) member.phone = phone;
    if (name) member.name = name;

    await member.save();

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getForceMembers,
  getForceMemberById,
  updateAvailability,
  updateForceMember,
};
