const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    forceMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Assigned', 'Confirmed', 'Declined', 'Completed'],
      default: 'Assigned',
    },
    roleInEvent: {
      type: String,
      default: 'Event Support Staff',
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate assignment of the same staff member to the same event
assignmentSchema.index({ eventId: 1, forceMemberId: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
