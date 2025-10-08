"use client";

import { useState } from "react";
import { Calendar, List, Plus, FileText, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarGrid } from "@/components/schedule/calendar-grid";
import { ShiftCreationModal } from "@/components/schedule/shift-creation-modal";
import { ShiftDetailsPanel } from "@/components/schedule/shift-details-panel";
import { ShiftTemplateList } from "@/components/schedule/shift-template-list";
import { cn } from "@/lib/utils";

type ViewMode = "calendar" | "list";
type FilterType = "all" | "chatter" | "creator";

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedChatter, setSelectedChatter] = useState<string | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [isTemplateListOpen, setIsTemplateListOpen] = useState(false);

  // Mock data - will be replaced with real data
  const chatters = [
    { id: "1", name: "Sarah Chen", avatar: "SC", color: "purple" },
    { id: "2", name: "Mike Johnson", avatar: "MJ", color: "blue" },
    { id: "3", name: "Emma Wilson", avatar: "EW", color: "pink" },
    { id: "4", name: "Alex Rodriguez", avatar: "AR", color: "green" },
  ];

  const creators = [
    { id: "1", name: "Bella Rose", username: "@bellarose" },
    { id: "2", name: "Luna Star", username: "@lunastar" },
    { id: "3", name: "Ivy Diamond", username: "@ivydiamond" },
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex flex-col gap-4 p-4 md:p-6">
          {/* Top Row: Title + Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                Shift Schedule
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage chatter schedules and handoffs
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View Toggle - Hidden on mobile */}
              <div className="hidden rounded-lg border border-slate-800 bg-slate-900/50 p-1 md:flex">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    viewMode === "calendar"
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    viewMode === "list"
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
              </div>

              {/* Create Shift Button */}
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-11 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="mr-2 h-5 w-5" />
                <span className="hidden md:inline">Create Shift</span>
                <span className="md:hidden">New</span>
              </Button>

              {/* Template Button */}
              <Button
                variant="outline"
                onClick={() => setIsTemplateListOpen(true)}
                className="h-11 border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800"
              >
                <FileText className="mr-2 h-5 w-5" />
                <span className="hidden md:inline">Templates</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 p-1">
              <button
                onClick={() => setFilterType("all")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  filterType === "all"
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-slate-400 hover:text-white"
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("chatter")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  filterType === "chatter"
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <User className="h-4 w-4" />
                Chatter
              </button>
              <button
                onClick={() => setFilterType("creator")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  filterType === "creator"
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Users className="h-4 w-4" />
                Creator
              </button>
            </div>

            {/* Chatter Filter Pills */}
            {filterType === "chatter" && (
              <div className="flex flex-wrap gap-2">
                {chatters.map((chatter) => (
                  <Badge
                    key={chatter.id}
                    onClick={() =>
                      setSelectedChatter(
                        selectedChatter === chatter.id ? null : chatter.id
                      )
                    }
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedChatter === chatter.id
                        ? "border-purple-500 bg-purple-500/20 text-purple-400"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                    )}
                    variant="outline"
                  >
                    <div
                      className={cn(
                        "mr-1.5 h-2 w-2 rounded-full",
                        chatter.color === "purple" && "bg-purple-500",
                        chatter.color === "blue" && "bg-blue-500",
                        chatter.color === "pink" && "bg-pink-500",
                        chatter.color === "green" && "bg-green-500"
                      )}
                    />
                    {chatter.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Creator Filter Pills */}
            {filterType === "creator" && (
              <div className="flex flex-wrap gap-2">
                {creators.map((creator) => (
                  <Badge
                    key={creator.id}
                    onClick={() =>
                      setSelectedCreator(
                        selectedCreator === creator.id ? null : creator.id
                      )
                    }
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedCreator === creator.id
                        ? "border-purple-500 bg-purple-500/20 text-purple-400"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                    )}
                    variant="outline"
                  >
                    {creator.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar/List View */}
        <div className="flex-1 overflow-auto">
          {viewMode === "calendar" ? (
            <CalendarGrid
              chatters={chatters}
              creators={creators}
              onShiftClick={(shiftId) => setSelectedShiftId(shiftId)}
              filterChatterId={selectedChatter}
              filterCreatorId={selectedCreator}
            />
          ) : (
            <div className="p-6">
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center">
                <List className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-4 text-lg font-semibold text-white">
                  List View Coming Soon
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Mobile-optimized list view is under development
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Shift Details Panel - Desktop Only */}
        {selectedShiftId && (
          <ShiftDetailsPanel
            shiftId={selectedShiftId}
            onClose={() => setSelectedShiftId(null)}
            onEdit={() => {
              setIsCreateModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Modals */}
      <ShiftCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        chatters={chatters}
        creators={creators}
        editShiftId={selectedShiftId}
      />

      <ShiftTemplateList
        isOpen={isTemplateListOpen}
        onClose={() => setIsTemplateListOpen(false)}
      />
    </div>
  );
}
