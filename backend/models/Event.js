const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an event name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
      enum: ['Cultural Festival', 'Corporate Conference', 'Sports Tournament', 'Music Concert', 'Exhibition', 'General'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify event date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please specify start time (e.g., 09:00)'],
    },
    endTime: {
      type: String,
      required: [true, 'Please specify end time (e.g., 18:00)'],
    },
    location: {
      type: String,
      required: [true, 'Please specify event location'],
    },
    requiredForce: {
      type: Number,
      required: [true, 'Please specify required force headcount'],
      min: [1, 'Required force must be at least 1'],
    },
    assignedForceCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
