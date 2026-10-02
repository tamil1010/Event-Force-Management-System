const Assignment = require('../models/Assignment');
const Event = require('../models/Event');

/**
 * Checks if a staff member has a scheduling conflict with a target event.
 * @param {string} forceMemberId - The user ID of the staff member.
 * @param {string} targetEventId - The ID of the event to assign to.
 * @returns {Promise<{ hasConflict: boolean, conflictingEvent?: object }>}
 */
const checkScheduleConflict = async (forceMemberId, targetEventId) => {
  const targetEvent = await Event.findById(targetEventId);
  if (!targetEvent) {
    throw new Error('Target event not found');
  }

  // Get all active assignments for this staff member (excluding Cancelled events or Declined assignments)
  const existingAssignments = await Assignment.find({
    forceMemberId: forceMemberId,
    status: { $in: ['Assigned', 'Confirmed'] },
  }).populate('eventId');

  const targetDateStr = new Date(targetEvent.date).toISOString().split('T')[0];

  for (const assign of existingAssignments) {
    const existingEvent = assign.eventId;
    
    // Skip if existing event is cancelled or is the same event
    if (!existingEvent || existingEvent.status === 'Cancelled' || existingEvent._id.toString() === targetEventId.toString()) {
      continue;
    }

    const existingDateStr = new Date(existingEvent.date).toISOString().split('T')[0];

    // If on the same calendar day, check time overlap
    if (targetDateStr === existingDateStr) {
      const tStart = parseTimeToMinutes(targetEvent.startTime);
      const tEnd = parseTimeToMinutes(targetEvent.endTime);
      const eStart = parseTimeToMinutes(existingEvent.startTime);
      const eEnd = parseTimeToMinutes(existingEvent.endTime);

      // Overlap condition: (tStart < eEnd) && (tEnd > eStart)
      if (tStart < eEnd && tEnd > eStart) {
        return {
          hasConflict: true,
          conflictingEvent: {
            id: existingEvent._id,
            name: existingEvent.name,
            date: existingDateStr,
            startTime: existingEvent.startTime,
            endTime: existingEvent.endTime,
            location: existingEvent.location,
          },
        };
      }
    }
  }

  return { hasConflict: false };
};

// Helper: Convert "HH:MM" string to total minutes from 00:00
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

module.exports = { checkScheduleConflict };
