# Shift Scheduling Module

A beautiful, mobile-first shift scheduling interface for VaultCRM. Designed for OnlyFans agency owners to manage chatter schedules, handoffs, and coverage.

## Components

### 1. Main Schedule Page (`/schedule`)
**File:** `/src/app/(dashboard)/schedule/page.tsx`

**Features:**
- Weekly calendar view (primary)
- List view toggle (mobile-friendly)
- Filters: By chatter, by creator, by date range
- "Create Shift" button (prominent, gradient purple-to-pink)
- "Use Template" dropdown
- Real-time conflict detection
- Responsive mobile design

**User Interactions:**
- Click shift blocks to view details
- Filter by chatter or creator
- Switch between calendar and list views
- Quick access to create shift modal
- Apply saved templates

---

### 2. Calendar Grid (`calendar-grid.tsx`)

**Features:**
- Weekly view (Monday-Sunday)
- Time slots from 6am-2am (30min increments)
- Color-coded shift blocks by chatter
- Drag-and-drop enabled (WIP)
- Click shift to view details
- Visual conflict warnings (red borders)
- Week navigation (Previous, Today, Next)
- Current day highlighting

**Color Coding:**
- Sarah Chen: Purple gradient (`from-purple-500/90 to-purple-600/90`)
- Mike Johnson: Blue gradient (`from-blue-500/90 to-blue-600/90`)
- Emma Wilson: Pink gradient (`from-pink-500/90 to-pink-600/90`)
- Alex Rodriguez: Green gradient (`from-green-500/90 to-green-600/90`)

---

### 3. Shift Block (`shift-block.tsx`)

**Features:**
- Chatter name + avatar initials
- Time display (e.g., 9:00 AM - 5:00 PM)
- Creator badges (small pills)
- Hover: Show quick actions (Edit, Delete, Duplicate)
- Gradient backgrounds based on chatter
- Conflict indicators (red border + icon)
- Draggable for rescheduling

**Touch Interactions:**
- Tap to view details
- Long press for quick actions
- Drag to reschedule (WIP)

---

### 4. Shift Creation Modal (`shift-creation-modal.tsx`)

**Features:**
- Select chatter (dropdown with avatars)
- Select creator(s) (multi-select checkboxes)
- Date picker
- Start/End time pickers
- Recurrence options:
  - None (default)
  - Daily
  - Weekly
  - Biweekly
  - Monthly
- Handoff notes (textarea)
- Real-time conflict warnings
- Form validation

**Conflict Detection:**
- Checks for overlapping shifts
- Shows warning banner when conflict detected
- Changes save button to "Save with Conflict" (red gradient)
- Displays which shifts conflict

---

### 5. Shift Details Panel (`shift-details-panel.tsx`)

**Features:**
- Right sidebar (desktop) / Bottom sheet (mobile WIP)
- Chatter info (name, avatar, performance score)
- Shift details (date, time, duration, creators covered)
- Previous shift handoff notes (read-only, blue highlight)
- Current shift handoff notes
- Performance metrics (if completed):
  - Messages handled
  - Revenue generated
  - Avg response time
  - Conversion rate
- Edit/Delete/Duplicate buttons

**Mobile Optimization:**
- Swipe down to dismiss (WIP)
- Large touch targets (44px min)
- Scrollable content area

---

### 6. Handoff Notes Form (`handoff-notes-form.tsx`)

**Features:**
- Rich textarea for end-of-shift notes
- "Urgent fans" multi-select with reasons
- Quick tags:
  - "Follow-up needed" (blue)
  - "High-value opportunity" (green)
  - "Issue to resolve" (red)
  - "VIP attention needed" (purple)
- Character counter (0/1000)
- Best practices info box
- Save handoff button

**Use Cases:**
- Document high-value opportunities
- Flag urgent fans needing attention
- Note pending deals or follow-ups
- Share engagement insights

---

### 7. Shift Template List (`shift-template-list.tsx`)

**Features:**
- Sidebar template manager
- List of saved templates
- Click to view template details
- Apply template to current week
- Edit/Delete template options
- "Create Template" button
- Template stats:
  - Number of shifts
  - Created date
  - Last used date

**Included Templates:**
1. **Weekday Morning** - Mon-Fri 9am-1pm
2. **Evening Shift Rotation** - 5pm-1am rotating
3. **Weekend Coverage** - Sat-Sun full day

---

## User Flows

### Flow 1: Create New Shift
1. Click "Create Shift" button
2. Modal opens
3. Select chatter from dropdown
4. Select one or more creators
5. Choose date and time
6. Add recurrence if needed
7. Add handoff notes (optional)
8. System checks for conflicts → warns if found
9. Save → shift appears on calendar

### Flow 2: Drag-and-Drop Reschedule (WIP)
1. Grab shift block
2. Drag to new time slot
3. Drop → auto-saves
4. Conflict detection runs → warns if issue

### Flow 3: Use Template
1. Click "Use Template" dropdown
2. Select template (e.g., "Weekday Morning")
3. Preview modal shows shifts to be created
4. Click "Apply Template"
5. Confirm → shifts added to calendar
6. Navigate to current week to view

### Flow 4: View Handoff Notes
1. Click shift that's starting soon
2. Details panel opens
3. "Previous Shift Notes" section shows:
   - "VIP @mike2847 needs followup on custom content request"
   - "Check in with @sarah_j, subscription expires tomorrow"
4. Read notes before starting shift

### Flow 5: End-of-Shift Handoff
1. Chatter completes shift
2. Opens handoff notes form
3. Documents important information
4. Selects urgent fans
5. Adds quick tags
6. Saves handoff
7. Next chatter sees notes when viewing shift

---

## Design System

### Colors
- **Black:** `#000000` (Primary brand)
- **Purple:** `#A855F7` (Primary actions)
- **Pink:** `#EC4899` (Secondary actions)
- **Blue:** `#3B82F6` (Info, notifications)
- **Green:** `#10B981` (Success, revenue)
- **Red:** `#EF4444` (Danger, conflicts)
- **Slate:** `#1E293B` (Backgrounds)

### Typography
- **Headings:** Bold, white
- **Body:** Regular, slate-300
- **Labels:** Semibold, slate-400
- **Monospace:** For times and dates

### Spacing
- **Touch Targets:** 44px minimum (mobile)
- **Button Height:** 44px (mobile), 40px (desktop)
- **Padding:** 16px (mobile), 24px (desktop)

### Animations
- **Transitions:** 200ms ease-in-out
- **Hover:** Scale 1.02, brightness increase
- **Active:** Scale 0.98
- **Loading:** Pulse animation

---

## Mobile Optimizations

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile-First Features
1. **Bottom Navigation:** Fixed bottom bar with key actions
2. **Swipe Gestures:** Swipe to delete, swipe to view details
3. **Pull-to-Refresh:** Reload schedule data
4. **Large Touch Targets:** 44px minimum for all interactive elements
5. **Thumb-Friendly:** Primary actions in bottom 1/3 of screen
6. **Bottom Sheets:** Modals slide up from bottom
7. **Haptic Feedback:** On interactions (WIP)

### Mobile View Modes
- **Calendar View:** Simplified for mobile, horizontal scroll
- **List View:** Vertical list of shifts, easier for mobile browsing

---

## Technical Details

### Dependencies
- `@radix-ui/react-dialog` - Modal/dialog components
- `@radix-ui/react-select` - Dropdown selects
- `@radix-ui/react-checkbox` - Checkboxes
- `lucide-react` - Icons
- `date-fns` - Date formatting (optional)
- `react-day-picker` - Date picker (optional)

### State Management
- Local component state (useState)
- Props drilling for data flow
- Future: Consider Zustand or Context for global schedule state

### Data Structure
```typescript
interface Shift {
  id: string;
  chatterId: string;
  creatorIds: string[];
  startTime: Date;
  endTime: Date;
  handoffNotes?: string;
  hasConflict?: boolean;
  performanceMetrics?: {
    messagesHandled: number;
    revenueGenerated: number;
    avgResponseTime: number;
    conversionRate: number;
  };
}

interface Template {
  id: string;
  name: string;
  description: string;
  shifts: TemplateShift[];
  createdAt: Date;
  lastUsed?: Date;
}
```

---

## Future Enhancements

### Phase 2
- [ ] Drag-and-drop rescheduling
- [ ] Conflict resolution wizard
- [ ] Auto-scheduling based on chatter availability
- [ ] Mobile bottom sheet details panel
- [ ] Swipe gestures for quick actions
- [ ] Haptic feedback
- [ ] Push notifications for upcoming shifts

### Phase 3
- [ ] Shift swap requests
- [ ] Chatter availability calendar
- [ ] Performance-based scheduling recommendations
- [ ] Template creation wizard
- [ ] Bulk shift operations
- [ ] Export schedule to PDF/CSV
- [ ] Integration with Google Calendar

### Phase 4
- [ ] AI-powered shift optimization
- [ ] Predictive conflict detection
- [ ] Smart handoff notes suggestions
- [ ] Automated performance tracking
- [ ] Real-time collaboration features

---

## Testing Checklist

### Desktop
- [ ] Create new shift
- [ ] Edit existing shift
- [ ] Delete shift
- [ ] View shift details
- [ ] Apply template
- [ ] Filter by chatter
- [ ] Filter by creator
- [ ] Week navigation
- [ ] Conflict detection

### Mobile (iPhone 12 Pro - 390x844px)
- [ ] Bottom navigation works
- [ ] Touch targets are 44px+
- [ ] Modals are thumb-friendly
- [ ] Calendar scrolls horizontally
- [ ] All buttons accessible
- [ ] Text is readable
- [ ] No horizontal overflow

### Edge Cases
- [ ] Overnight shifts (cross-day)
- [ ] Conflicting shifts
- [ ] Empty schedule
- [ ] Single chatter
- [ ] No creators selected
- [ ] Invalid time ranges

---

## Usage Examples

### Import Components
```tsx
import { CalendarGrid } from "@/components/schedule/calendar-grid";
import { ShiftBlock } from "@/components/schedule/shift-block";
import { ShiftCreationModal } from "@/components/schedule/shift-creation-modal";
import { ShiftDetailsPanel } from "@/components/schedule/shift-details-panel";
import { HandoffNotesForm } from "@/components/schedule/handoff-notes-form";
import { ShiftTemplateList } from "@/components/schedule/shift-template-list";
```

### Create Shift Programmatically
```tsx
const newShift = {
  id: uuid(),
  chatterId: "1",
  creatorIds: ["1", "2"],
  startTime: new Date("2024-10-07T09:00:00"),
  endTime: new Date("2024-10-07T17:00:00"),
  handoffNotes: "Check in with VIP fans",
};
```

---

## Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ Color contrast (WCAG AA)
- ✅ Touch-friendly (44px targets)

---

## Support

For issues or questions, contact the VaultCRM team.

**Last Updated:** October 7, 2025
**Version:** 1.0.0
