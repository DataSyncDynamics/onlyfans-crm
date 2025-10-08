"use client";

import { useState } from "react";
import { Edit, Trash2, Copy, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface ShiftBlockProps {
  shift: Shift;
  chatter: Chatter;
  creators: Creator[];
  onClick: () => void;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function ShiftBlock({
  shift,
  chatter,
  creators,
  onClick,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: ShiftBlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const getGradientClass = (color: string) => {
    switch (color) {
      case "purple":
        return "from-purple-500/90 to-purple-600/90";
      case "blue":
        return "from-blue-500/90 to-blue-600/90";
      case "pink":
        return "from-pink-500/90 to-pink-600/90";
      case "green":
        return "from-green-500/90 to-green-600/90";
      default:
        return "from-purple-500/90 to-purple-600/90";
    }
  };

  const getAvatarBgClass = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-600";
      case "blue":
        return "bg-blue-600";
      case "pink":
        return "bg-pink-600";
      case "green":
        return "bg-green-600";
      default:
        return "bg-purple-600";
    }
  };

  return (
    <div
      className={cn(
        "group relative h-full cursor-pointer overflow-hidden rounded-lg border transition-all",
        shift.hasConflict
          ? "border-red-500 border-2 ring-2 ring-red-500/20"
          : "border-transparent hover:border-white/20",
        isDragging && "opacity-50 scale-95"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDragEnd={onDragEnd}
    >
      {/* Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          getGradientClass(chatter.color)
        )}
      />

      {/* Content */}
      <div className="relative flex h-full flex-col p-3">
        {/* Header: Avatar + Name */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
              getAvatarBgClass(chatter.color)
            )}
          >
            {chatter.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">
              {chatter.name}
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="mt-2 text-xs font-medium text-white/90">
          {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
        </div>

        {/* Creator Badges */}
        {creators.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {creators.map((creator) => (
              <Badge
                key={creator.id}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                variant="outline"
              >
                <span className="truncate text-xs">{creator.name}</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Conflict Warning */}
        {shift.hasConflict && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md bg-red-500/20 px-2 py-1">
            <AlertCircle className="h-3 w-3 text-red-300" />
            <span className="text-xs font-medium text-red-300">Conflict</span>
          </div>
        )}

        {/* Quick Actions - Show on Hover */}
        <div
          className={cn(
            "absolute right-2 top-2 flex gap-1 transition-all",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit
            }}
            className="rounded-md bg-black/40 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-black/60"
            title="Edit shift"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle duplicate
            }}
            className="rounded-md bg-black/40 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-black/60"
            title="Duplicate shift"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete
            }}
            className="rounded-md bg-black/40 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-red-500/80"
            title="Delete shift"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
