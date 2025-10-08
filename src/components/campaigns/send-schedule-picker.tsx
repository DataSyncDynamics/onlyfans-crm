"use client";

import { useState } from "react";
import { Clock, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SendSchedulePickerProps {
  scheduledDate?: Date;
  onScheduleChange: (date: Date | undefined) => void;
  sendRate: "slow" | "medium" | "fast";
  onSendRateChange: (rate: "slow" | "medium" | "fast") => void;
  targetCount: number;
}

const SEND_RATES = {
  slow: {
    label: "Slow & Safe",
    rate: 25,
    icon: CheckCircle2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    risk: "Lowest spam detection risk",
    description: "Recommended for first-time campaigns",
  },
  medium: {
    label: "Medium",
    rate: 50,
    icon: CheckCircle2,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    risk: "Low spam detection risk",
    description: "Balanced speed and safety",
  },
  fast: {
    label: "Fast",
    rate: 100,
    icon: AlertTriangle,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    risk: "Higher spam detection risk",
    description: "Use with caution",
  },
};

export function SendSchedulePicker({
  scheduledDate,
  onScheduleChange,
  sendRate,
  onSendRateChange,
  targetCount,
}: SendSchedulePickerProps) {
  const [sendNow, setSendNow] = useState(!scheduledDate);

  const handleSendModeChange = (now: boolean) => {
    setSendNow(now);
    if (now) {
      onScheduleChange(undefined);
    } else {
      // Default to tomorrow at 8 PM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(20, 0, 0, 0);
      onScheduleChange(tomorrow);
    }
  };

  const selectedRate = SEND_RATES[sendRate];
  const Icon = selectedRate.icon;
  const estimatedDuration = Math.ceil(targetCount / selectedRate.rate);

  return (
    <div className="space-y-6">
      {/* Send Timing */}
      <div>
        <Label className="text-sm font-medium text-white mb-3 block">
          When to Send
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSendModeChange(true)}
            className={`
              p-4 rounded-lg border-2 transition-all text-left
              ${
                sendNow
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
              }
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <Send
                className={`h-5 w-5 ${sendNow ? "text-purple-400" : "text-slate-400"}`}
              />
              <span className="font-medium text-white">Send Now</span>
            </div>
            <p className="text-xs text-slate-400">
              Start sending immediately
            </p>
          </button>

          <button
            onClick={() => handleSendModeChange(false)}
            className={`
              p-4 rounded-lg border-2 transition-all text-left
              ${
                !sendNow
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
              }
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock
                className={`h-5 w-5 ${!sendNow ? "text-purple-400" : "text-slate-400"}`}
              />
              <span className="font-medium text-white">Schedule</span>
            </div>
            <p className="text-xs text-slate-400">Pick a date and time</p>
          </button>
        </div>
      </div>

      {/* Date/Time Picker */}
      {!sendNow && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Date
            </Label>
            <input
              type="date"
              value={scheduledDate?.toISOString().split("T")[0] || ""}
              onChange={(e) => {
                const newDate = new Date(scheduledDate || new Date());
                const [year, month, day] = e.target.value.split("-").map(Number);
                newDate.setFullYear(year, month - 1, day);
                onScheduleChange(newDate);
              }}
              className="w-full h-11 px-4 rounded-lg border border-slate-700 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Time
            </Label>
            <input
              type="time"
              value={
                scheduledDate
                  ? `${String(scheduledDate.getHours()).padStart(2, "0")}:${String(scheduledDate.getMinutes()).padStart(2, "0")}`
                  : ""
              }
              onChange={(e) => {
                const newDate = new Date(scheduledDate || new Date());
                const [hours, minutes] = e.target.value.split(":").map(Number);
                newDate.setHours(hours, minutes, 0, 0);
                onScheduleChange(newDate);
              }}
              className="w-full h-11 px-4 rounded-lg border border-slate-700 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {/* Send Rate Selector */}
      <div>
        <Label className="text-sm font-medium text-white mb-3 block">
          Send Rate
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(SEND_RATES).map(([key, rate]) => {
            const RateIcon = rate.icon;
            const isSelected = sendRate === key;

            return (
              <button
                key={key}
                onClick={() => onSendRateChange(key as typeof sendRate)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    isSelected
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  }
                `}
              >
                <div
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${rate.bgColor}`}
                >
                  <RateIcon className={`h-4 w-4 ${rate.color}`} />
                </div>
                <div className="text-sm font-medium text-white mb-1">
                  {rate.label}
                </div>
                <div className="text-xs text-slate-400">
                  {rate.rate} msg/hr
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Rate Details */}
        <div className="mt-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="flex items-start gap-3">
            <Icon className={`h-5 w-5 ${selectedRate.color} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">
                  {selectedRate.label} - {selectedRate.rate} messages/hour
                </span>
                <Badge variant="secondary" className={selectedRate.bgColor}>
                  {selectedRate.risk}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                {selectedRate.description}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Estimated Duration:</span>
                  <span className="text-white font-medium">
                    ~{estimatedDuration} hour{estimatedDuration !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Summary */}
      {scheduledDate && !sendNow && (
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-white">
              Scheduled Campaign
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Will send {targetCount} messages starting{" "}
            <strong>
              {scheduledDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at{" "}
              {scheduledDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
