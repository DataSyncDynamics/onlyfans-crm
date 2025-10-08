"use client";

import { useState } from "react";
import { X, Edit, Trash2, Copy, MessageSquare, DollarSign, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ShiftDetailsPanelProps {
  shiftId: string;
  onClose: () => void;
  onEdit: () => void;
}

export function ShiftDetailsPanel({
  shiftId,
  onClose,
  onEdit,
}: ShiftDetailsPanelProps) {
  // Mock data - replace with real data
  const shift = {
    id: shiftId,
    chatter: {
      id: "1",
      name: "Sarah Chen",
      avatar: "SC",
      color: "purple",
      performanceScore: 94,
    },
    creators: [
      { id: "1", name: "Bella Rose", username: "@bellarose" },
      { id: "2", name: "Luna Star", username: "@lunastar" },
    ],
    date: "Monday, Oct 7",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    duration: "8 hours",
    handoffNotes:
      "VIP @mike2847 needs followup on custom content request. Check in with @sarah_j, subscription expires tomorrow. High engagement during lunch hours.",
    previousShiftNotes:
      "Great shift! Closed 3 upsells. @tommy_k is interested in custom content package - follow up ASAP. Handled 87 messages, no complaints.",
    isCompleted: true,
    metrics: {
      messagesHandled: 87,
      revenueGenerated: 450,
      avgResponseTime: 2.3,
      conversionRate: 12.5,
    },
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

  const handleDuplicate = () => {
    // TODO: Implement duplicate
    console.log("Duplicate shift:", shiftId);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this shift?")) {
      // TODO: Implement delete
      console.log("Delete shift:", shiftId);
      onClose();
    }
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-slate-800/50 bg-slate-900/50 backdrop-blur-xl md:w-96">
      {/* Header */}
      <div className="border-b border-slate-800/50 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Shift Details</h3>
            <p className="mt-0.5 text-sm text-slate-400">
              {shift.date} • {shift.duration}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Chatter Info */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Assigned Chatter
            </h4>
            <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white",
                    getAvatarBgClass(shift.chatter.color)
                  )}
                >
                  {shift.chatter.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {shift.chatter.name}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-sm text-slate-400">
                      {shift.chatter.performanceScore}% score
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shift Details */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Shift Information
            </h4>
            <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Time</span>
                <span className="font-medium text-white">
                  {shift.startTime} - {shift.endTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Duration</span>
                <span className="font-medium text-white">{shift.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Status</span>
                <Badge
                  variant="success"
                  className="bg-green-500/10 text-green-500 border-green-500/20"
                >
                  Completed
                </Badge>
              </div>
            </div>
          </div>

          {/* Creators Covered */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Creators Covered
            </h4>
            <div className="space-y-2">
              {shift.creators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                    {creator.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{creator.name}</div>
                    <div className="text-sm text-slate-400">
                      {creator.username}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          {shift.isCompleted && shift.metrics && (
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Performance Metrics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {/* Messages Handled */}
                <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">Messages</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    {shift.metrics.messagesHandled}
                  </div>
                </div>

                {/* Revenue Generated */}
                <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Revenue</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-green-500">
                    ${shift.metrics.revenueGenerated}
                  </div>
                </div>

                {/* Avg Response Time */}
                <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Avg Response</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    {shift.metrics.avgResponseTime}m
                  </div>
                </div>

                {/* Conversion Rate */}
                <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">Conversion</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    {shift.metrics.conversionRate}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Previous Shift Notes */}
          {shift.previousShiftNotes && (
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <AlertCircle className="h-4 w-4" />
                Previous Shift Notes
              </h4>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="text-sm leading-relaxed text-blue-300">
                  {shift.previousShiftNotes}
                </p>
              </div>
            </div>
          )}

          {/* Handoff Notes */}
          {shift.handoffNotes && (
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Handoff Notes
              </h4>
              <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                <p className="text-sm leading-relaxed text-slate-300">
                  {shift.handoffNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="border-t border-slate-800/50 p-4">
        <div className="flex gap-2">
          <Button
            onClick={onEdit}
            className="flex-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
            variant="outline"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={handleDuplicate}
            className="flex-1 bg-slate-800/50 text-white hover:bg-slate-800"
            variant="outline"
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
            variant="outline"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
