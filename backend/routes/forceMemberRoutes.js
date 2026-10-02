const express = require('express');
const router = express.Router();
const {
  getForceMembers,
  getForceMemberById,
  updateAvailability,
  updateForceMember,
} = require('../controllers/forceMemberController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getForceMembers);
router.get('/:id', protect, getForceMemberById);
router.put('/:id/availability', protect, updateAvailability);
router.put('/:id/role', protect, authorize('Admin'), updateForceMember);

module.exports = router;
