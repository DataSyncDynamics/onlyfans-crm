/**
 * SHIFT SCHEDULING SYSTEM - DEMO & USAGE EXAMPLES
 *
 * This file demonstrates how to use the shift scheduling data layer
 * and helper functions for the VaultCRM shift management system.
 */

import {
  SHIFTS,
  SHIFT_TEMPLATES,
  SHIFT_HANDOFFS,
  CHATTERS,
  getShiftsByChatter,
  getActiveShifts,
  getUpcomingShifts,
  getRecentHandoffs,
  getActiveTemplates,
} from './mock-data';

import {
  detectShiftConflicts,
  getAvailableChatters,
  applyShiftTemplate,
  getShiftStats,
  getShiftsInRange,
  getCoverageGaps,
  isShiftActive,
} from './shifts';

/**
 * DEMO 1: View Current Shift Coverage
 */
export function demoCurrentCoverage() {
  console.log('=== CURRENT SHIFT COVERAGE ===\n');

  const activeShifts = getActiveShifts();

  if (activeShifts.length === 0) {
    console.log('No active shifts right now');
  } else {
    activeShifts.forEach(shift => {
      const chatter = CHATTERS.find(c => c.id === shift.chatterId);
      const creators = shift.creatorIds.join(', ');

      console.log(`${chatter?.name} is working now`);
      console.log(`  Covering: ${creators}`);
      console.log(`  Shift: ${shift.startTime.toLocaleTimeString()} - ${shift.endTime.toLocaleTimeString()}`);
      if (shift.handoffNotes) {
        console.log(`  Notes: ${shift.handoffNotes}`);
      }
      console.log('');
    });
  }
}

/**
 * DEMO 2: Check Who's Available at a Specific Time
 */
export function demoChatterAvailability() {
  console.log('=== CHATTER AVAILABILITY ===\n');

  // Check tomorrow at 2 PM
  const tomorrow2pm = new Date();
  tomorrow2pm.setDate(tomorrow2pm.getDate() + 1);
  tomorrow2pm.setHours(14, 0, 0, 0);

  const availableChatters = getAvailableChatters(tomorrow2pm, SHIFTS, CHATTERS);

  console.log(`Tomorrow at 2 PM, available chatters:`);
  availableChatters.forEach(chatter => {
    console.log(`  - ${chatter.name} (${chatter.role})`);
  });

  if (availableChatters.length === 0) {
    console.log('  NO COVERAGE - NEED TO SCHEDULE!');
  }
  console.log('');
}

/**
 * DEMO 3: Detect Scheduling Conflicts
 */
export function demoConflictDetection() {
  console.log('=== SHIFT CONFLICTS ===\n');

  const conflicts = detectShiftConflicts(SHIFTS);

  if (conflicts.length === 0) {
    console.log('No scheduling conflicts detected!');
  } else {
    console.log(`Found ${conflicts.length} potential conflicts:\n`);

    conflicts.slice(0, 5).forEach(conflict => {
      const chatter1 = CHATTERS.find(c => c.id === conflict.shift1.chatterId);
      const chatter2 = CHATTERS.find(c => c.id === conflict.shift2.chatterId);

      console.log(`[${conflict.severity.toUpperCase()}] ${conflict.type}`);
      console.log(`  ${chatter1?.name}: ${conflict.shift1.startTime.toLocaleString()}`);
      console.log(`  ${chatter2?.name}: ${conflict.shift2.startTime.toLocaleString()}`);
      console.log(`  ${conflict.message}`);
      console.log('');
    });
  }
}

/**
 * DEMO 4: View Chatter Performance Stats
 */
export function demoChatterStats() {
  console.log('=== CHATTER SHIFT STATISTICS ===\n');

  CHATTERS.forEach(chatter => {
    const stats = getShiftStats(chatter.id, SHIFTS);

    console.log(`${chatter.name} (${chatter.role})`);
    console.log(`  Total Shifts: ${stats.totalShifts}`);
    console.log(`  Total Hours: ${stats.totalHours}h`);
    console.log(`  Completed: ${stats.completedShifts} | Cancelled: ${stats.cancelledShifts}`);

    if (stats.avgMessagesPerShift > 0) {
      console.log(`  Avg Messages/Shift: ${stats.avgMessagesPerShift}`);
      console.log(`  Avg Revenue/Shift: $${stats.avgRevenuePerShift}`);
      console.log(`  Avg Response Time: ${stats.avgResponseTime} min`);
    }

    console.log('');
  });
}

/**
 * DEMO 5: View Recent Handoff Notes
 */
export function demoHandoffNotes() {
  console.log('=== RECENT SHIFT HANDOFFS ===\n');

  const recentHandoffs = getRecentHandoffs(7).slice(0, 5);

  recentHandoffs.forEach(handoff => {
    const fromChatter = CHATTERS.find(c => c.id === handoff.fromChatterId);
    const toChatter = CHATTERS.find(c => c.id === handoff.toChatterId);

    console.log(`${handoff.shiftDate.toLocaleDateString()}`);
    console.log(`${fromChatter?.name} → ${toChatter?.name}`);
    console.log(`"${handoff.notes}"`);

    if (handoff.urgentFans && handoff.urgentFans.length > 0) {
      console.log(`Urgent: ${handoff.urgentFans.join(', ')}`);
    }

    console.log('');
  });
}

/**
 * DEMO 6: Apply Template to Generate New Shifts
 */
export function demoTemplateApplication() {
  console.log('=== SHIFT TEMPLATE APPLICATION ===\n');

  const template = getActiveTemplates()[0];

  if (template) {
    const chatter = CHATTERS.find(c => c.id === template.chatterId);

    console.log(`Template: ${template.name}`);
    console.log(`Chatter: ${chatter?.name}`);
    console.log(`Time: ${template.startTime} - ${template.endTime}`);
    console.log(`Days: ${template.daysOfWeek.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}`);
    console.log('');

    // Generate next 7 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newShifts = applyShiftTemplate(template, startDate, endDate);

    console.log(`Generated ${newShifts.length} shifts for next 7 days:`);
    newShifts.slice(0, 5).forEach(shift => {
      console.log(`  ${shift.startTime.toLocaleDateString()} ${shift.startTime.toLocaleTimeString()} - ${shift.endTime.toLocaleTimeString()}`);
    });
    console.log('');
  }
}

/**
 * DEMO 7: Find Coverage Gaps
 */
export function demoCoverageGaps() {
  console.log('=== COVERAGE GAPS ===\n');

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const gaps = getCoverageGaps(SHIFTS, today, nextWeek);

  if (gaps.length === 0) {
    console.log('Full coverage for the next 7 days!');
  } else {
    console.log(`Found ${gaps.length} coverage gaps:\n`);

    gaps.slice(0, 10).forEach(gap => {
      const hours = (gap.end.getTime() - gap.start.getTime()) / (1000 * 60 * 60);

      console.log(`[${gap.severity.toUpperCase()}] ${gap.start.toLocaleDateString()}`);
      console.log(`  ${gap.start.toLocaleTimeString()} - ${gap.end.toLocaleTimeString()}`);
      console.log(`  Duration: ${hours.toFixed(1)} hours`);
      console.log('');
    });
  }
}

/**
 * DEMO 8: Week Overview
 */
export function demoWeekOverview() {
  console.log('=== NEXT 7 DAYS SHIFT OVERVIEW ===\n');

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const weekShifts = getShiftsInRange(SHIFTS, today, nextWeek);

  // Group by day
  const shiftsByDay = new Map<string, typeof weekShifts>();

  weekShifts.forEach(shift => {
    const dayKey = shift.startTime.toLocaleDateString();
    const existing = shiftsByDay.get(dayKey) || [];
    existing.push(shift);
    shiftsByDay.set(dayKey, existing);
  });

  shiftsByDay.forEach((shifts, day) => {
    console.log(`${day}:`);

    shifts.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    shifts.forEach(shift => {
      const chatter = CHATTERS.find(c => c.id === shift.chatterId);
      const time = `${shift.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${shift.endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      const active = isShiftActive(shift) ? ' [ACTIVE NOW]' : '';

      console.log(`  ${time} - ${chatter?.name}${active}`);
    });

    console.log('');
  });
}

/**
 * DATA SUMMARY
 */
export function demoDataSummary() {
  console.log('=== SHIFT DATA SUMMARY ===\n');

  const totalShifts = SHIFTS.length;
  const completedShifts = SHIFTS.filter(s => s.status === 'completed').length;
  const scheduledShifts = SHIFTS.filter(s => s.status === 'scheduled').length;
  const activeShifts = SHIFTS.filter(s => s.status === 'active').length;
  const cancelledShifts = SHIFTS.filter(s => s.status === 'cancelled').length;

  console.log(`Total Shifts: ${totalShifts}`);
  console.log(`  Completed: ${completedShifts}`);
  console.log(`  Scheduled: ${scheduledShifts}`);
  console.log(`  Active Now: ${activeShifts}`);
  console.log(`  Cancelled: ${cancelledShifts}`);
  console.log('');

  console.log(`Active Templates: ${SHIFT_TEMPLATES.length}`);
  console.log(`Total Handoffs: ${SHIFT_HANDOFFS.length}`);
  console.log('');

  // Calculate total coverage hours
  const totalHours = SHIFTS
    .filter(s => s.status === 'completed')
    .reduce((sum, shift) => {
      const hours = (shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

  console.log(`Total Coverage Hours (completed): ${totalHours.toFixed(1)}h`);

  // Calculate revenue from shifts
  const totalRevenue = SHIFTS
    .filter(s => s.coverage)
    .reduce((sum, shift) => sum + (shift.coverage?.revenue || 0), 0);

  const totalMessages = SHIFTS
    .filter(s => s.coverage)
    .reduce((sum, shift) => sum + (shift.coverage?.messagesHandled || 0), 0);

  console.log(`Total Revenue (from completed shifts): $${totalRevenue.toFixed(2)}`);
  console.log(`Total Messages Handled: ${totalMessages}`);
  console.log('');
}

/**
 * RUN ALL DEMOS
 */
export function runAllDemos() {
  demoDataSummary();
  demoCurrentCoverage();
  demoWeekOverview();
  demoChatterStats();
  demoHandoffNotes();
  demoConflictDetection();
  demoCoverageGaps();
  demoChatterAvailability();
  demoTemplateApplication();
}

// Export for easy console testing
if (typeof window !== 'undefined') {
  (window as any).shiftDemo = {
    runAll: runAllDemos,
    summary: demoDataSummary,
    current: demoCurrentCoverage,
    week: demoWeekOverview,
    stats: demoChatterStats,
    handoffs: demoHandoffNotes,
    conflicts: demoConflictDetection,
    gaps: demoCoverageGaps,
    availability: demoChatterAvailability,
    template: demoTemplateApplication,
  };

  console.log('Shift Demo loaded! Try: shiftDemo.runAll()');
}
