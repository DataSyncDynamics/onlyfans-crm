"use client";

import { useState, useRef, useEffect } from "react";
import { ShiftBlock } from "./shift-block";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chatter {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface Creator {
  id: string;
  name: string;
  username: string;
}

interface Shift {
  id: string;
  chatterId: string;
  creatorIds: string[];
  startTime: Date;
  endTime: Date;
  handoffNotes?: string;
  hasConflict?: boolean;
}

interface CalendarGridProps {
  chatters: Chatter[];
  creators: Creator[];
  onShiftClick: (shiftId: string) => void;
  filterChatterId?: string | null;
  filterCreatorId?: string | null;
}

export function CalendarGrid({
  chatters,
  creators,
  onShiftClick,
  filterChatterId,
  filterCreatorId,
}: CalendarGridProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0); // Reset to midnight
    return monday;
  });

  const [draggedShift, setDraggedShift] = useState<string | null>(null);

  // Generate time slots (6am to 2am next day = 20 hours, 30min slots = 40 slots)
  const timeSlots = Array.from({ length: 40 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6;
    const minute = i % 2 === 0 ? "00" : "30";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 && hour < 24 ? "PM" : "AM";
    return {
      value: `${hour.toString().padStart(2, "0")}:${minute}`,
      label: i % 2 === 0 ? `${displayHour}:${minute} ${ampm}` : "",
    };
  });

  // Generate days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return {
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    };
  });

  // Mock shifts - replace with real data
  const mockShifts: Shift[] = [
    {
      id: "1",
      chatterId: "1",
      creatorIds: ["1", "2"],
      startTime: new Date(currentWeekStart.getTime() + 9 * 60 * 60 * 1000), // Monday 9am
      endTime: new Date(currentWeekStart.getTime() + 17 * 60 * 60 * 1000), // Monday 5pm
      handoffNotes: "Check in with high-value subscribers",
    },
    {
      id: "2",
      chatterId: "2",
      creatorIds: ["1"],
      startTime: new Date(currentWeekStart.getTime() + 17 * 60 * 60 * 1000), // Monday 5pm
      endTime: new Date(currentWeekStart.getTime() + 25 * 60 * 60 * 1000), // Tuesday 1am
      handoffNotes: "Night shift - focus on international fans",
    },
    {
      id: "3",
      chatterId: "3",
      creatorIds: ["2", "3"],
      startTime: new Date(
        currentWeekStart.getTime() + 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000
      ), // Tuesday 9am
      endTime: new Date(
        currentWeekStart.getTime() + 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000
      ), // Tuesday 1pm
    },
    {
      id: "4",
      chatterId: "4",
      creatorIds: ["3"],
      startTime: new Date(
        currentWeekStart.getTime() + 48 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000
      ), // Wednesday 2pm
      endTime: new Date(
        currentWeekStart.getTime() + 48 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000
      ), // Wednesday 10pm
      hasConflict: true,
    },
  ];

  // Filter shifts
  const filteredShifts = mockShifts.filter((shift) => {
    if (filterChatterId && shift.chatterId !== filterChatterId) return false;
    if (
      filterCreatorId &&
      !shift.creatorIds.includes(filterCreatorId)
    )
      return false;
    return true;
  });

  // Calculate shift position in grid
  const getShiftPosition = (shift: Shift) => {
    const daysDiff = Math.floor(
      (shift.startTime.getTime() - currentWeekStart.getTime()) /
        (24 * 60 * 60 * 1000)
    );
    const startHour = shift.startTime.getHours();
    const startMinute = shift.startTime.getMinutes();
    const endHour = shift.endTime.getHours();
    const endMinute = shift.endTime.getMinutes();

    // Calculate row position (6am = row 0)
    // For hours 0-5 (midnight-5:59am), treat as next day (hours 24-29)
    const normalizedStartHour = startHour < 6 ? startHour + 24 : startHour;
    const normalizedEndHour = endHour < 6 ? endHour + 24 : endHour;

    const startRow = (normalizedStartHour - 6) * 2 + (startMinute >= 30 ? 1 : 0);
    const endRow = (normalizedEndHour - 6) * 2 + (endMinute >= 30 ? 1 : 0);
    const rowSpan = Math.max(1, endRow - startRow); // Ensure at least 1 row span

    return {
      col: daysDiff + 2, // +2 for time label column
      row: startRow + 2, // +2 for header row
      rowSpan,
    };
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleToday = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0); // Reset to midnight
    setCurrentWeekStart(monday);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Week Navigation */}
      <div className="border-b border-slate-800/50 bg-slate-900/30 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevWeek}
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white transition-all hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              onClick={handleToday}
              className="rounded-lg border border-purple-500/50 bg-purple-500/10 px-3 py-2 text-sm text-purple-400 transition-all hover:bg-purple-500/20"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white transition-all hover:bg-slate-800"
            >
              Next
            </button>
          </div>
          <div className="text-sm font-semibold text-white md:text-base">
            {weekDays[0].month} {weekDays[0].dayNumber} -{" "}
            {weekDays[6].month} {weekDays[6].dayNumber},{" "}
            {weekDays[0].date.getFullYear()}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="min-w-[800px] relative">
          {/* Grid Container */}
          <div className="grid grid-cols-8 gap-px rounded-lg border border-slate-800/50 bg-slate-800/50 overflow-hidden">
            {/* Header Row */}
            <div className="bg-slate-900/50 p-3"></div>
            {weekDays.map((day) => (
              <div
                key={day.date.toISOString()}
                className="bg-slate-900/50 p-3 text-center"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {day.dayName}
                </div>
                <div
                  className={cn(
                    "mt-1 text-lg font-bold",
                    day.date.toDateString() === new Date().toDateString()
                      ? "text-purple-400"
                      : "text-white"
                  )}
                >
                  {day.dayNumber}
                </div>
              </div>
            ))}

            {/* Time Slots */}
            {timeSlots.map((slot, slotIndex) => (
              <>
                {/* Time Label */}
                <div
                  key={`time-${slotIndex}`}
                  className="bg-slate-900/30 p-2 text-right"
                >
                  <span className="text-xs text-slate-500">{slot.label}</span>
                </div>

                {/* Day Cells */}
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={`cell-${dayIndex}-${slotIndex}`}
                    className="relative bg-slate-900/20 p-1 transition-colors hover:bg-slate-800/30"
                    style={{ minHeight: "40px" }}
                  >
                    {/* Shifts will be absolutely positioned */}
                  </div>
                ))}
              </>
            ))}
          </div>

          {/* Shifts Overlay - Now inside the relative container */}
          {filteredShifts.map((shift) => {
            const position = getShiftPosition(shift);
            const chatter = chatters.find((c) => c.id === shift.chatterId);
            const shiftCreators = creators.filter((c) =>
              shift.creatorIds.includes(c.id)
            );

            // Calculate pixel positions based on grid layout
            const headerHeight = 61; // Height of header row with padding
            const cellHeight = 40; // Height of each time slot cell
            const timeColumnWidth = 12.5; // 1/8 of 100% for time column
            const dayColumnWidth = 12.5; // 1/8 of 100% for each day

            return (
              <div
                key={shift.id}
                className="absolute pointer-events-auto"
                style={{
                  top: `${headerHeight + (position.row - 2) * cellHeight}px`,
                  left: `calc(${timeColumnWidth + (position.col - 2) * dayColumnWidth}% + 2px)`,
                  width: `calc(${dayColumnWidth}% - 4px)`,
                  height: `${position.rowSpan * cellHeight - 4}px`,
                  zIndex: 20,
                }}
              >
                <ShiftBlock
                  shift={shift}
                  chatter={chatter!}
                  creators={shiftCreators}
                  onClick={() => onShiftClick(shift.id)}
                  isDragging={draggedShift === shift.id}
                  onDragStart={() => setDraggedShift(shift.id)}
                  onDragEnd={() => setDraggedShift(null)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Conflict Warning */}
      {filteredShifts.some((s) => s.hasConflict) && (
        <div className="border-t border-slate-800/50 bg-red-500/10 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>
              Schedule conflicts detected. Review highlighted shifts.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
