"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Clock, DollarSign, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface HandoffNotesFormProps {
  shiftId: string;
  onSave?: (notes: string, urgentFans: string[], tags: string[]) => void;
}

const quickTags = [
  { id: "follow-up", label: "Follow-up needed", icon: Clock, color: "blue" },
  { id: "high-value", label: "High-value opportunity", icon: DollarSign, color: "green" },
  { id: "issue", label: "Issue to resolve", icon: AlertCircle, color: "red" },
  { id: "vip", label: "VIP attention needed", icon: Flag, color: "purple" },
];

// Mock urgent fans data
const urgentFans = [
  { id: "1", username: "@mike2847", reason: "Custom content request" },
  { id: "2", username: "@sarah_j", reason: "Subscription expires tomorrow" },
  { id: "3", username: "@tommy_k", reason: "Interested in package upgrade" },
  { id: "4", username: "@lisa_m", reason: "Needs response ASAP" },
  { id: "5", username: "@alex_r", reason: "High-value opportunity" },
];

export function HandoffNotesForm({ shiftId, onSave }: HandoffNotesFormProps) {
  const [notes, setNotes] = useState("");
  const [selectedFans, setSelectedFans] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleFanToggle = (fanId: string) => {
    setSelectedFans((prev) =>
      prev.includes(fanId)
        ? prev.filter((id) => id !== fanId)
        : [...prev, fanId]
    );
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    if (!notes.trim() && selectedFans.length === 0) {
      alert("Please add notes or select urgent fans");
      return;
    }

    setIsSaving(true);

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSave?.(notes, selectedFans, selectedTags);

    setIsSaving(false);

    // Show success message
    alert("Handoff notes saved successfully!");

    // Reset form
    setNotes("");
    setSelectedFans([]);
    setSelectedTags([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-white">End of Shift Handoff</h3>
        <p className="mt-1 text-sm text-slate-400">
          Document important information for the next chatter
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-slate-300">Handoff Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Document key information, pending tasks, important updates, or anything the next chatter should know..."
          className="min-h-32 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
        />
        <p className="text-xs text-slate-500">
          {notes.length} / 1000 characters
        </p>
      </div>

      {/* Quick Tags */}
      <div className="space-y-2">
        <Label className="text-slate-300">Quick Tags</Label>
        <div className="flex flex-wrap gap-2">
          {quickTags.map((tag) => {
            const Icon = tag.icon;
            const isSelected = selectedTags.includes(tag.id);

            return (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                  isSelected
                    ? cn(
                        "border-transparent",
                        tag.color === "blue" && "bg-blue-500/20 text-blue-400",
                        tag.color === "green" && "bg-green-500/20 text-green-400",
                        tag.color === "red" && "bg-red-500/20 text-red-400",
                        tag.color === "purple" && "bg-purple-500/20 text-purple-400"
                      )
                    : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                )}
              >
                <Icon className="h-4 w-4" />
                {tag.label}
                {isSelected && <Check className="ml-1 h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Urgent Fans */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Urgent Fans Requiring Attention
        </Label>
        <div className="space-y-2 rounded-lg border border-slate-700 bg-slate-800/50 p-4 max-h-64 overflow-y-auto">
          {urgentFans.map((fan) => {
            const isSelected = selectedFans.includes(fan.id);

            return (
              <button
                key={fan.id}
                onClick={() => handleFanToggle(fan.id)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-all",
                  isSelected
                    ? "border-purple-500/50 bg-purple-500/10"
                    : "border-slate-700/50 bg-slate-900/50 hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-medium",
                          isSelected ? "text-purple-300" : "text-white"
                        )}
                      >
                        {fan.username}
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-purple-400" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{fan.reason}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500">
          {selectedFans.length} fan{selectedFans.length !== 1 ? "s" : ""} selected
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving || (!notes.trim() && selectedFans.length === 0)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          {isSaving ? "Saving..." : "Save Handoff Notes"}
        </Button>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
          <div className="text-sm text-blue-300">
            <p className="font-medium">Handoff Best Practices</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Document all high-value opportunities and pending deals</li>
              <li>Flag urgent fans who need immediate attention</li>
              <li>Note any issues or complaints that need follow-up</li>
              <li>Share insights about fan engagement patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
