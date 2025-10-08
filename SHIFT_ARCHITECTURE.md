# Shift Scheduling System - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SHIFT SCHEDULING SYSTEM                          │
│                         VaultCRM Backend Layer                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 1. TYPE DEFINITIONS (/src/types/index.ts)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   interface Shift {                                                    │
│     id, chatterId, creatorIds, startTime, endTime,                    │
│     recurrence, status, handoffNotes, coverage                        │
│   }                                                                     │
│                                                                         │
│   interface ShiftHandoff {                                             │
│     id, fromChatterId, toChatterId, shiftDate,                        │
│     notes, urgentFans, createdAt                                      │
│   }                                                                     │
│                                                                         │
│   interface ShiftTemplate {                                            │
│     id, name, chatterId, creatorIds,                                  │
│     startTime, endTime, daysOfWeek, isActive                          │
│   }                                                                     │
│                                                                         │
│   interface ShiftConflict { ... }                                      │
│   interface ShiftStats { ... }                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. MOCK DATA LAYER (/src/lib/mock-data.ts)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────┐   ┌──────────────────┐   ┌─────────────────┐ │
│  │  SHIFT_TEMPLATES   │   │     SHIFTS       │   │ SHIFT_HANDOFFS │ │
│  │  (5 templates)     │──▶│   (280+ items)   │──▶│  (100+ items)  │ │
│  └─────────────────────┘   └──────────────────┘   └─────────────────┘ │
│                                                                         │
│  Templates Define:          Shifts Include:        Handoffs Track:     │
│  • Weekday Morning          • Scheduled (future)   • Urgent fans       │
│  • Weekday Afternoon        • Active (now)         • Context notes     │
│  • Evening Shift            • Completed (past)     • VIP follow-ups    │
│  • Night Owl               • Coverage metrics      • Transitions       │
│  • Weekend Morning          • Performance data     • Critical tasks    │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │              DATA ACCESS FUNCTIONS                                │ │
│  ├──────────────────────────────────────────────────────────────────┤ │
│  │  getShiftById()              getHandoffById()                    │ │
│  │  getShiftsByChatter()        getHandoffsByChatter()             │ │
│  │  getShiftsByCreator()        getRecentHandoffs()                │ │
│  │  getShiftsInDateRange()      getTemplateById()                  │ │
│  │  getActiveShifts()           getActiveTemplates()               │ │
│  │  getUpcomingShifts()         getTemplatesByChatter()            │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. BUSINESS LOGIC LAYER (/src/lib/shifts.ts)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐ │
│  │ CONFLICT DETECTION   │  │  AVAILABILITY CHECK  │  │  TEMPLATE    │ │
│  ├──────────────────────┤  ├──────────────────────┤  │  GENERATOR   │ │
│  │                      │  │                      │  │              │ │
│  │ detectShiftConflicts │  │ getAvailableChatters │  │ applyShift   │ │
│  │        ↓             │  │        ↓             │  │ Template     │ │
│  │ Returns:             │  │ Returns:             │  │      ↓       │ │
│  │ • Double bookings    │  │ • Available staff    │  │ Generates    │ │
│  │ • Overlaps           │  │ • Real-time check    │  │ new shifts   │ │
│  │ • Severity levels    │  │ • By datetime        │  │ from pattern │ │
│  │                      │  │                      │  │              │ │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘ │
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐ │
│  │ PERFORMANCE STATS    │  │   COVERAGE GAPS      │  │   UTILITIES  │ │
│  ├──────────────────────┤  ├──────────────────────┤  ├──────────────┤ │
│  │                      │  │                      │  │              │ │
│  │ getShiftStats        │  │ getCoverageGaps      │  │ getDuration  │ │
│  │        ↓             │  │        ↓             │  │ isActive     │ │
│  │ Returns:             │  │ Returns:             │  │ getByRange   │ │
│  │ • Total hours        │  │ • Scheduling holes   │  │ getByChatter │ │
│  │ • Avg revenue        │  │ • Severity ratings   │  │ getByCreator │ │
│  │ • Messages handled   │  │ • Coverage analysis  │  │              │ │
│  │ • Response time      │  │                      │  │              │ │
│  │                      │  │                      │  │              │ │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. DEMO & TESTING LAYER (/src/lib/shift-demo.ts)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐             │
│  │ Current       │  │ Week          │  │ Chatter       │             │
│  │ Coverage      │  │ Overview      │  │ Stats         │             │
│  └───────────────┘  └───────────────┘  └───────────────┘             │
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐             │
│  │ Handoff       │  │ Conflict      │  │ Coverage      │             │
│  │ Notes         │  │ Detection     │  │ Gaps          │             │
│  └───────────────┘  └───────────────┘  └───────────────┘             │
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐                                 │
│  │ Availability  │  │ Template      │                                 │
│  │ Check         │  │ Application   │                                 │
│  └───────────────┘  └───────────────┘                                 │
│                                                                         │
│  Browser Console Access:                                               │
│  > shiftDemo.runAll()     // Run all demos                            │
│  > shiftDemo.current()    // Current coverage                         │
│  > shiftDemo.week()       // Week overview                            │
│  > shiftDemo.stats()      // Performance stats                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. USAGE EXAMPLES (/SHIFT_USAGE_EXAMPLES.ts)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  13 Copy-Paste Ready Functions:                                        │
│                                                                         │
│  1.  getWeekShifts()               - Calendar component                │
│  2.  getCurrentCoverage()          - Live coverage widget              │
│  3.  checkScheduleConflicts()      - Conflict warnings                 │
│  4.  getHandoffPanel()             - Handoff notes UI                  │
│  5.  getChatterPerformanceData()   - Performance dashboard             │
│  6.  findCoverageGaps()            - Gap analyzer                      │
│  7.  generateShiftsFromTemplate()  - Bulk schedule creator             │
│  8.  checkChatterAvailability()    - Availability validator            │
│  9.  getUpcomingShiftsWidget()     - Upcoming shifts list              │
│  10. validateShiftBeforeSave()     - Pre-save validation               │
│  11. getCoverageHeatmapData()      - Heatmap visualization             │
│  12. getRevenueByShift()           - Revenue attribution               │
│  13. getShiftStatusBadge()         - Status badge helper               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                     DATA FLOW EXAMPLE                                   │
└─────────────────────────────────────────────────────────────────────────┘

   USER ACTION                    BACKEND                      UI UPDATE
   ───────────                   ────────                     ──────────

1. Open Calendar
        │
        ├──▶ getShiftsInDateRange(start, end)
        │            │
        │            ├──▶ Query SHIFTS data
        │            │
        │            └──▶ Group by day
        │
        └────────────────────────────────────▶ Render calendar grid

2. Check Conflicts
        │
        ├──▶ detectShiftConflicts(SHIFTS)
        │            │
        │            ├──▶ Compare all shift pairs
        │            │
        │            ├──▶ Detect overlaps
        │            │
        │            └──▶ Rate severity
        │
        └────────────────────────────────────▶ Show warning badges

3. View Handoff
        │
        ├──▶ getHandoffPanel(chatterId)
        │            │
        │            ├──▶ Filter by recipient
        │            │
        │            ├──▶ Get urgent fans
        │            │
        │            └──▶ Format notes
        │
        └────────────────────────────────────▶ Display handoff panel

4. Generate Shifts
        │
        ├──▶ applyShiftTemplate(template, dates)
        │            │
        │            ├──▶ Parse recurrence pattern
        │            │
        │            ├──▶ Generate shift objects
        │            │
        │            └──▶ Assign IDs & status
        │
        └────────────────────────────────────▶ Update calendar


┌─────────────────────────────────────────────────────────────────────────┐
│                     PERFORMANCE CHARACTERISTICS                         │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┬─────────────┬──────────────────────────────────┐
│ Operation            │ Complexity  │ Performance Target               │
├──────────────────────┼─────────────┼──────────────────────────────────┤
│ getShiftById         │ O(n)        │ <1ms (array lookup)              │
│ getShiftsInRange     │ O(n)        │ <10ms (filter operation)         │
│ detectConflicts      │ O(n²)       │ <50ms (optimized comparisons)    │
│ getCoverageGaps      │ O(n log n)  │ <30ms (sorted iteration)         │
│ getShiftStats        │ O(n)        │ <20ms (single pass calculation)  │
│ applyTemplate        │ O(d)        │ <10ms (d = days in range)        │
└──────────────────────┴─────────────┴──────────────────────────────────┘

Optimization Notes:
• Use indexes on chatterId, startTime for database queries
• Cache getActiveShifts() with 1-minute TTL
• Implement virtual scrolling for large calendar views
• Run conflict detection on save only, not on every render
• Pre-calculate coverage gaps nightly for dashboard


┌─────────────────────────────────────────────────────────────────────────┐
│                     FUTURE ENHANCEMENTS                                 │
└─────────────────────────────────────────────────────────────────────────┘

Phase 1 (Weeks 1-2):
  ✓ Calendar UI component
  ✓ Conflict warning system
  ✓ Handoff panel widget

Phase 2 (Weeks 3-4):
  □ Drag-and-drop shift editor
  □ Template manager interface
  □ Performance dashboard

Phase 3 (Weeks 5-6):
  □ Supabase integration
  □ Real-time updates
  □ Mobile notifications

Phase 4 (Weeks 7-8):
  □ AI-powered scheduling suggestions
  □ Automatic conflict resolution
  □ Predictive coverage analysis


┌─────────────────────────────────────────────────────────────────────────┐
│                     TECHNOLOGY STACK                                    │
└─────────────────────────────────────────────────────────────────────────┘

Backend:
  • TypeScript (type-safe operations)
  • Next.js 14 (framework)
  • Seeded Random (consistent hydration)

Future Database:
  • Supabase (PostgreSQL)
  • Row Level Security (access control)
  • Real-time subscriptions (live updates)

Frontend (Next Steps):
  • React components
  • Tailwind CSS (styling)
  • shadcn/ui (component library)
  • FullCalendar or similar (calendar view)


┌─────────────────────────────────────────────────────────────────────────┐
│                     FILE STRUCTURE                                      │
└─────────────────────────────────────────────────────────────────────────┘

/src/types/index.ts
  └─▶ 6 interfaces (Shift, ShiftHandoff, ShiftTemplate, etc.)

/src/lib/mock-data.ts
  ├─▶ SHIFT_TEMPLATES (5 templates)
  ├─▶ SHIFTS (280+ shifts)
  ├─▶ SHIFT_HANDOFFS (100+ handoffs)
  └─▶ 12 data access functions

/src/lib/shifts.ts
  ├─▶ detectShiftConflicts()
  ├─▶ getAvailableChatters()
  ├─▶ applyShiftTemplate()
  ├─▶ getShiftStats()
  ├─▶ getCoverageGaps()
  └─▶ 20+ utility functions

/src/lib/shift-demo.ts
  └─▶ 8 interactive demo functions

/SHIFT_USAGE_EXAMPLES.ts
  └─▶ 13 copy-paste ready examples

/SHIFT_SYSTEM_README.md
  └─▶ Complete technical documentation

/SHIFT_SYSTEM_SUMMARY.md
  └─▶ Quick reference guide

/SHIFT_ARCHITECTURE.md
  └─▶ This architecture diagram
