import {
  Shift,
  ShiftConflict,
  ShiftTemplate,
  ShiftStats,
  Chatter,
} from "@/types";

// ============================================================================
// SHIFT CONFLICT DETECTION
// ============================================================================

/**
 * Detects conflicts between shifts (overlapping times or double-booking)
 * Returns array of conflicts with severity ratings
 */
export function detectShiftConflicts(shifts: Shift[]): ShiftConflict[] {
  const conflicts: ShiftConflict[] = [];
  const activeShifts = shifts.filter(s => s.status !== 'cancelled');

  for (let i = 0; i < activeShifts.length; i++) {
    for (let j = i + 1; j < activeShifts.length; j++) {
      const shift1 = activeShifts[i];
      const shift2 = activeShifts[j];

      if (!shift1 || !shift2) continue;

      // Check if same chatter is double-booked
      if (shift1.chatterId === shift2.chatterId) {
        const overlap = checkTimeOverlap(shift1, shift2);

        if (overlap) {
          conflicts.push({
            shift1,
            shift2,
            type: 'double_booking',
            severity: 'high',
            message: `Chatter is scheduled for overlapping shifts (${formatTimeRange(shift1)} and ${formatTimeRange(shift2)})`,
          });
        }
      }

      // Check if same creator has multiple chatters at same time (generally OK, but flag for review)
      const sharedCreators = shift1.creatorIds.filter(id =>
        shift2.creatorIds.includes(id)
      );

      if (sharedCreators.length > 0 && checkTimeOverlap(shift1, shift2)) {
        const severity = sharedCreators.length === shift1.creatorIds.length ? 'medium' : 'low';
        conflicts.push({
          shift1,
          shift2,
          type: 'overlap',
          severity,
          message: `Multiple chatters assigned to same creator(s) during overlapping times`,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Check if two shifts have overlapping time periods
 */
function checkTimeOverlap(shift1: Shift, shift2: Shift): boolean {
  return (
    (shift1.startTime <= shift2.endTime && shift1.endTime >= shift2.startTime)
  );
}

/**
 * Format shift time range for display
 */
function formatTimeRange(shift: Shift): string {
  const start = shift.startTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const end = shift.endTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return `${start}-${end}`;
}

// ============================================================================
// CHATTER AVAILABILITY
// ============================================================================

/**
 * Get all chatters available (scheduled) at a specific time
 */
export function getAvailableChatters(
  dateTime: Date,
  shifts: Shift[],
  chatters: Chatter[]
): Chatter[] {
  const activeShifts = shifts.filter(
    s => s.status === 'scheduled' || s.status === 'active'
  );

  const availableChatterIds = activeShifts
    .filter(shift =>
      dateTime >= shift.startTime && dateTime <= shift.endTime
    )
    .map(shift => shift.chatterId);

  return chatters.filter(c => availableChatterIds.includes(c.id));
}

/**
 * Check if a specific chatter is available at a given time
 */
export function isChatterAvailable(
  chatterId: string,
  dateTime: Date,
  shifts: Shift[]
): boolean {
  return shifts.some(
    shift =>
      shift.chatterId === chatterId &&
      (shift.status === 'scheduled' || shift.status === 'active') &&
      dateTime >= shift.startTime &&
      dateTime <= shift.endTime
  );
}

// ============================================================================
// SHIFT TEMPLATE APPLICATION
// ============================================================================

/**
 * Apply a shift template to generate actual shifts for a date range
 */
export function applyShiftTemplate(
  template: ShiftTemplate,
  startDate: Date,
  endDate: Date
): Shift[] {
  const shifts: Shift[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();

    // Check if this day is in the template's schedule
    if (template.daysOfWeek.includes(dayOfWeek)) {
      const [startHour, startMinute] = template.startTime.split(':').map(Number);
      const [endHour, endMinute] = template.endTime.split(':').map(Number);

      const shiftStart = new Date(currentDate);
      shiftStart.setHours(startHour || 0, startMinute || 0, 0, 0);

      const shiftEnd = new Date(currentDate);
      shiftEnd.setHours(endHour || 0, endMinute || 0, 0, 0);

      shifts.push({
        id: `shift_${template.id}_${currentDate.toISOString().split('T')[0]}`,
        chatterId: template.chatterId,
        creatorIds: template.creatorIds,
        startTime: shiftStart,
        endTime: shiftEnd,
        status: 'scheduled',
      });
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return shifts;
}

// ============================================================================
// SHIFT STATISTICS
// ============================================================================

/**
 * Calculate comprehensive statistics for a chatter's shifts
 */
export function getShiftStats(
  chatterId: string,
  shifts: Shift[]
): ShiftStats {
  const chatterShifts = shifts.filter(s => s.chatterId === chatterId);

  const totalShifts = chatterShifts.length;
  const completedShifts = chatterShifts.filter(s => s.status === 'completed').length;
  const cancelledShifts = chatterShifts.filter(s => s.status === 'cancelled').length;

  // Calculate total hours
  const totalHours = chatterShifts.reduce((sum, shift) => {
    const hours = (shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  // Calculate averages from completed shifts
  const completedShiftsWithCoverage = chatterShifts.filter(
    s => s.status === 'completed' && s.coverage
  );

  const avgMessagesPerShift = completedShiftsWithCoverage.length > 0
    ? completedShiftsWithCoverage.reduce((sum, s) => sum + (s.coverage?.messagesHandled || 0), 0) /
      completedShiftsWithCoverage.length
    : 0;

  const avgRevenuePerShift = completedShiftsWithCoverage.length > 0
    ? completedShiftsWithCoverage.reduce((sum, s) => sum + (s.coverage?.revenue || 0), 0) /
      completedShiftsWithCoverage.length
    : 0;

  const avgResponseTime = completedShiftsWithCoverage.length > 0
    ? completedShiftsWithCoverage.reduce((sum, s) => sum + (s.coverage?.avgResponseTime || 0), 0) /
      completedShiftsWithCoverage.length
    : 0;

  // Calculate coverage by creator
  const creatorCoverage = new Map<string, { shifts: number; hours: number }>();

  chatterShifts.forEach(shift => {
    const shiftHours = (shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60);

    shift.creatorIds.forEach(creatorId => {
      const current = creatorCoverage.get(creatorId) || { shifts: 0, hours: 0 };
      creatorCoverage.set(creatorId, {
        shifts: current.shifts + 1,
        hours: current.hours + shiftHours,
      });
    });
  });

  const coverageByCreator = Array.from(creatorCoverage.entries()).map(
    ([creatorId, stats]) => ({
      creatorId,
      shifts: stats.shifts,
      hours: Math.round(stats.hours * 10) / 10,
    })
  );

  return {
    chatterId,
    totalShifts,
    totalHours: Math.round(totalHours * 10) / 10,
    completedShifts,
    cancelledShifts,
    avgMessagesPerShift: Math.round(avgMessagesPerShift),
    avgRevenuePerShift: Math.round(avgRevenuePerShift * 100) / 100,
    avgResponseTime: Math.round(avgResponseTime * 10) / 10,
    coverageByCreator,
  };
}

// ============================================================================
// SHIFT UTILITIES
// ============================================================================

/**
 * Get all shifts for a specific date range
 */
export function getShiftsInRange(
  shifts: Shift[],
  startDate: Date,
  endDate: Date
): Shift[] {
  return shifts.filter(
    shift =>
      (shift.startTime >= startDate && shift.startTime <= endDate) ||
      (shift.endTime >= startDate && shift.endTime <= endDate) ||
      (shift.startTime <= startDate && shift.endTime >= endDate)
  );
}

/**
 * Get shifts for a specific chatter
 */
export function getShiftsByChatter(
  shifts: Shift[],
  chatterId: string
): Shift[] {
  return shifts.filter(s => s.chatterId === chatterId);
}

/**
 * Get shifts covering a specific creator
 */
export function getShiftsByCreator(
  shifts: Shift[],
  creatorId: string
): Shift[] {
  return shifts.filter(s => s.creatorIds.includes(creatorId));
}

/**
 * Calculate shift duration in hours
 */
export function getShiftDuration(shift: Shift): number {
  const hours = (shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60);
  return Math.round(hours * 10) / 10;
}

/**
 * Check if shift is currently active (happening now)
 */
export function isShiftActive(shift: Shift): boolean {
  const now = new Date();
  return (
    shift.status === 'active' ||
    (shift.status === 'scheduled' && now >= shift.startTime && now <= shift.endTime)
  );
}

/**
 * Get coverage gaps (times when no chatter is scheduled)
 */
export function getCoverageGaps(
  shifts: Shift[],
  startDate: Date,
  endDate: Date
): Array<{ start: Date; end: Date; severity: 'low' | 'medium' | 'high' }> {
  const gaps: Array<{ start: Date; end: Date; severity: 'low' | 'medium' | 'high' }> = [];
  const sortedShifts = [...shifts]
    .filter(s => s.status !== 'cancelled')
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const currentTime = new Date(startDate);

  while (currentTime < endDate) {
    const dayStart = new Date(currentTime);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentTime);
    dayEnd.setHours(23, 59, 59, 999);

    const dayShifts = sortedShifts.filter(
      s => s.startTime <= dayEnd && s.endTime >= dayStart
    );

    // Check for gaps in coverage
    let lastEnd = dayStart;

    for (const shift of dayShifts) {
      if (shift.startTime > lastEnd) {
        const gapHours = (shift.startTime.getTime() - lastEnd.getTime()) / (1000 * 60 * 60);

        if (gapHours > 0.5) { // Only report gaps > 30 minutes
          gaps.push({
            start: new Date(lastEnd),
            end: new Date(shift.startTime),
            severity: gapHours > 4 ? 'high' : gapHours > 2 ? 'medium' : 'low',
          });
        }
      }
      lastEnd = shift.endTime > lastEnd ? shift.endTime : lastEnd;
    }

    // Move to next day
    currentTime.setDate(currentTime.getDate() + 1);
  }

  return gaps;
}
