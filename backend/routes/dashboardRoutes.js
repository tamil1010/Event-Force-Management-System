const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getManagerStats,
  getStaffStats,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/admin', protect, authorize('Admin'), getAdminStats);
router.get('/manager', protect, authorize('Admin', 'Event Manager'), getManagerStats);
router.get('/staff', protect, getStaffStats);

module.exports = router;
