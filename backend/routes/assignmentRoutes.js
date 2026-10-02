const express = require('express');
const router = express.Router();
const {
  assignStaff,
  removeAssignment,
  updateAssignmentStatus,
  getEventAssignments,
  getMemberAssignments,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('Admin', 'Event Manager'), assignStaff);
router.get('/my-assignments', protect, getMemberAssignments);
router.get('/event/:eventId', protect, getEventAssignments);
router.put('/:id/status', protect, updateAssignmentStatus);
router.delete('/:id', protect, authorize('Admin', 'Event Manager'), removeAssignment);

module.exports = router;
