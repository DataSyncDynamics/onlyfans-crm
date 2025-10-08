/**
 * SHIFT SCHEDULING SYSTEM - COMMON USAGE EXAMPLES
 *
 * Copy-paste ready code snippets for frontend implementation
 */

import {
  SHIFTS,
  SHIFT_TEMPLATES,
  SHIFT_HANDOFFS,
  CHATTERS,
  CREATORS,
  getShiftById,
  getShiftsByChatter,
  getShiftsInDateRange,
  getActiveShifts,
  getUpcomingShifts,
  getRecentHandoffs,
} from '@/lib/mock-data';

import {
  detectShiftConflicts,
  getAvailableChatters,
  applyShiftTemplate,
  getShiftStats,
  getCoverageGaps,
  isShiftActive,
  getShiftDuration,
} from '@/lib/shifts';

// ============================================================================
// EXAMPLE 1: Calendar Component - Get Week View
// ============================================================================

export function getWeekShifts(weekStartDate: Date) {
  const weekEnd = new Date(weekStartDate);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const shifts = getShiftsInDateRange(weekStartDate, weekEnd);

  // Group by day for calendar grid
  const shiftsByDay = new Map<string, typeof shifts>();

  shifts.forEach(shift => {
    const dayKey = shift.startTime.toLocaleDateString();
    const existing = shiftsByDay.get(dayKey) || [];
    existing.push(shift);
    shiftsByDay.set(dayKey, existing);
  });

  return shiftsByDay;
}

// ============================================================================
// EXAMPLE 2: Live Coverage Widget - Who's Working Now?
// ============================================================================

export function getCurrentCoverage() {
  const activeShifts = getActiveShifts();

  return activeShifts.map(shift => {
    const chatter = CHATTERS.find(c => c.id === shift.chatterId);
    const creators = shift.creatorIds
      .map(id => CREATORS.find(c => c.id === id)?.displayName)
      .filter(Boolean);

    return {
      chatterName: chatter?.name,
      chatterRole: chatter?.role,
      creatorsHandling: creators,
      shiftEnd: shift.endTime,
      handoffNotes: shift.handoffNotes,
    };
  });
}

// ============================================================================
// EXAMPLE 3: Conflict Warning System
// ============================================================================

export function checkScheduleConflicts() {
  const conflicts = detectShiftConflicts(SHIFTS);

  // Filter to only high severity (double-bookings)
  const criticalConflicts = conflicts.filter(c => c.severity === 'high');

  return {
    total: conflicts.length,
    critical: criticalConflicts.length,
    conflicts: criticalConflicts.map(conflict => ({
      message: conflict.message,
      chatter1: CHATTERS.find(c => c.id === conflict.shift1.chatterId)?.name,
      chatter2: CHATTERS.find(c => c.id === conflict.shift2.chatterId)?.name,
      time1: conflict.shift1.startTime,
      time2: conflict.shift2.startTime,
    })),
  };
}

// ============================================================================
// EXAMPLE 4: Handoff Panel - Show Urgent Tasks
// ============================================================================

export function getHandoffPanel(chatterId: string) {
  const recentHandoffs = getRecentHandoffs(1); // Today

  // Find handoffs TO this chatter
  const incomingHandoffs = recentHandoffs.filter(
    h => h.toChatterId === chatterId
  );

  return incomingHandoffs.map(handoff => {
    const fromChatter = CHATTERS.find(c => c.id === handoff.fromChatterId);

    return {
      from: fromChatter?.name,
      notes: handoff.notes,
      urgentFans: handoff.urgentFans || [],
      shiftTime: handoff.shiftDate,
    };
  });
}

// ============================================================================
// EXAMPLE 5: Chatter Performance Dashboard
// ============================================================================

export function getChatterPerformanceData(chatterId: string) {
  const stats = getShiftStats(chatterId, SHIFTS);
  const chatter = CHATTERS.find(c => c.id === chatterId);

  if (!chatter) return null;

  return {
    name: chatter.name,
    role: chatter.role,

    // Shift stats
    totalShifts: stats.totalShifts,
    totalHours: stats.totalHours,
    completionRate: (stats.completedShifts / stats.totalShifts) * 100,

    // Performance metrics
    avgMessagesPerShift: stats.avgMessagesPerShift,
    avgRevenuePerShift: stats.avgRevenuePerShift,
    avgResponseTime: stats.avgResponseTime,

    // Coverage breakdown
    creatorCoverage: stats.coverageByCreator.map(c => ({
      creator: CREATORS.find(cr => cr.id === c.creatorId)?.displayName,
      shifts: c.shifts,
      hours: c.hours,
    })),

    // Overall chatter performance (from CHATTERS data)
    performanceScore: chatter.performanceScore,
    conversionRate: chatter.conversionRate,
    revenueGenerated: chatter.revenueGenerated,
  };
}

// ============================================================================
// EXAMPLE 6: Coverage Gap Analyzer
// ============================================================================

export function findCoverageGaps(days: number = 7) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const gaps = getCoverageGaps(SHIFTS, today, futureDate);

  // Group by severity
  return {
    high: gaps.filter(g => g.severity === 'high'),
    medium: gaps.filter(g => g.severity === 'medium'),
    low: gaps.filter(g => g.severity === 'low'),
    total: gaps.length,
  };
}

// ============================================================================
// EXAMPLE 7: Schedule Builder - Apply Template
// ============================================================================

export function generateShiftsFromTemplate(
  templateId: string,
  startDate: Date,
  weeks: number = 2
) {
  const template = SHIFT_TEMPLATES.find(t => t.id === templateId);

  if (!template) return [];

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + weeks * 7);

  const newShifts = applyShiftTemplate(template, startDate, endDate);

  return newShifts.map(shift => ({
    ...shift,
    chatterName: CHATTERS.find(c => c.id === shift.chatterId)?.name,
    duration: getShiftDuration(shift),
  }));
}

// ============================================================================
// EXAMPLE 8: Availability Checker - Can Chatter Cover This Time?
// ============================================================================

export function checkChatterAvailability(
  chatterId: string,
  dateTime: Date
): {
  available: boolean;
  currentShift?: any;
  reason?: string;
} {
  const chatterShifts = getShiftsByChatter(chatterId);

  const conflictingShift = chatterShifts.find(
    shift =>
      shift.status !== 'cancelled' &&
      dateTime >= shift.startTime &&
      dateTime <= shift.endTime
  );

  if (conflictingShift) {
    return {
      available: false,
      currentShift: {
        id: conflictingShift.id,
        startTime: conflictingShift.startTime,
        endTime: conflictingShift.endTime,
      },
      reason: 'Already scheduled for another shift',
    };
  }

  return {
    available: true,
    reason: 'No conflicts found',
  };
}

// ============================================================================
// EXAMPLE 9: Upcoming Shifts Widget
// ============================================================================

export function getUpcomingShiftsWidget(limit: number = 5) {
  const upcoming = getUpcomingShifts(limit);

  return upcoming.map(shift => {
    const chatter = CHATTERS.find(c => c.id === shift.chatterId);
    const creators = shift.creatorIds
      .map(id => CREATORS.find(c => c.id === id)?.displayName)
      .join(', ');

    const startsIn = Math.floor(
      (shift.startTime.getTime() - Date.now()) / (1000 * 60 * 60)
    ); // Hours

    return {
      id: shift.id,
      chatterName: chatter?.name,
      creators,
      startTime: shift.startTime,
      duration: getShiftDuration(shift),
      startsInHours: startsIn,
      handoffNotes: shift.handoffNotes,
    };
  });
}

// ============================================================================
// EXAMPLE 10: Shift Editor Helper - Validate Before Save
// ============================================================================

export function validateShiftBeforeSave(
  chatterId: string,
  startTime: Date,
  endTime: Date,
  creatorIds: string[]
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation 1: Time range valid?
  if (startTime >= endTime) {
    errors.push('End time must be after start time');
  }

  // Validation 2: Duration reasonable?
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  if (duration > 12) {
    warnings.push('Shift duration exceeds 12 hours');
  }

  // Validation 3: Chatter available?
  const availability = checkChatterAvailability(chatterId, startTime);
  if (!availability.available) {
    errors.push(availability.reason || 'Chatter not available');
  }

  // Validation 4: At least one creator assigned?
  if (creatorIds.length === 0) {
    errors.push('At least one creator must be assigned');
  }

  // Validation 5: Check for conflicts
  const tempShift = {
    id: 'temp',
    chatterId,
    creatorIds,
    startTime,
    endTime,
    status: 'scheduled' as const,
  };

  const conflicts = detectShiftConflicts([...SHIFTS, tempShift]);
  const highSeverityConflicts = conflicts.filter(c => c.severity === 'high');

  if (highSeverityConflicts.length > 0) {
    errors.push(`${highSeverityConflicts.length} scheduling conflicts detected`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// EXAMPLE 11: Coverage Heatmap Data
// ============================================================================

export function getCoverageHeatmapData(days: number = 7) {
  const today = new Date();
  const data: Array<{
    date: string;
    hour: number;
    chattersWorking: number;
  }> = [];

  for (let day = 0; day < days; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + day);

    for (let hour = 0; hour < 24; hour++) {
      const checkTime = new Date(currentDate);
      checkTime.setHours(hour, 0, 0, 0);

      const available = getAvailableChatters(checkTime, SHIFTS, CHATTERS);

      data.push({
        date: currentDate.toLocaleDateString(),
        hour,
        chattersWorking: available.length,
      });
    }
  }

  return data;
}

// ============================================================================
// EXAMPLE 12: Revenue Attribution by Shift
// ============================================================================

export function getRevenueByShift(dateRange?: { start: Date; end: Date }) {
  let shifts = SHIFTS;

  if (dateRange) {
    shifts = getShiftsInDateRange(dateRange.start, dateRange.end);
  }

  const completedWithRevenue = shifts.filter(
    s => s.status === 'completed' && s.coverage
  );

  return completedWithRevenue.map(shift => {
    const chatter = CHATTERS.find(c => c.id === shift.chatterId);

    return {
      shiftId: shift.id,
      chatterName: chatter?.name,
      date: shift.startTime,
      duration: getShiftDuration(shift),
      messagesHandled: shift.coverage?.messagesHandled || 0,
      revenue: shift.coverage?.revenue || 0,
      revenuePerHour: (shift.coverage?.revenue || 0) / getShiftDuration(shift),
    };
  });
}

// ============================================================================
// EXAMPLE 13: Shift Status Badge
// ============================================================================

export function getShiftStatusBadge(shiftId: string) {
  const shift = getShiftById(shiftId);

  if (!shift) return null;

  const now = new Date();
  const active = isShiftActive(shift);

  return {
    status: shift.status,
    label:
      shift.status === 'scheduled' && active
        ? 'Active Now'
        : shift.status.charAt(0).toUpperCase() + shift.status.slice(1),
    color:
      shift.status === 'active' || active
        ? 'green'
        : shift.status === 'completed'
          ? 'blue'
          : shift.status === 'cancelled'
            ? 'red'
            : 'gray',
    isActive: active,
  };
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export const ShiftExamples = {
  getWeekShifts,
  getCurrentCoverage,
  checkScheduleConflicts,
  getHandoffPanel,
  getChatterPerformanceData,
  findCoverageGaps,
  generateShiftsFromTemplate,
  checkChatterAvailability,
  getUpcomingShiftsWidget,
  validateShiftBeforeSave,
  getCoverageHeatmapData,
  getRevenueByShift,
  getShiftStatusBadge,
};
