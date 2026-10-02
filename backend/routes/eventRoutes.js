const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getEvents)
  .post(protect, authorize('Admin', 'Event Manager'), createEvent);

router
  .route('/:id')
  .get(protect, getEventById)
  .put(protect, authorize('Admin', 'Event Manager'), updateEvent)
  .delete(protect, authorize('Admin', 'Event Manager'), deleteEvent);

module.exports = router;
