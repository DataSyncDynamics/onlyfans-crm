"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Clock, Repeat, Users } from "lucide-react";
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

interface ShiftCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatters: Chatter[];
  creators: Creator[];
  editShiftId?: string | null;
}

type RecurrenceType = "none" | "daily" | "weekly" | "biweekly" | "monthly";

export function ShiftCreationModal({
  isOpen,
  onClose,
  chatters,
  creators,
  editShiftId,
}: ShiftCreationModalProps) {
  const [selectedChatterId, setSelectedChatterId] = useState<string>("");
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");
  const [handoffNotes, setHandoffNotes] = useState<string>("");
  const [hasConflict, setHasConflict] = useState(false);

  // Initialize date to today
  useEffect(() => {
    if (isOpen && !date) {
      const today = new Date();
      setDate(today.toISOString().split("T")[0]);
    }
  }, [isOpen, date]);

  // Mock conflict detection
  useEffect(() => {
    if (selectedChatterId && date && startTime && endTime) {
      // Simulate conflict detection
      const conflict = Math.random() > 0.8; // 20% chance of conflict for demo
      setHasConflict(conflict);
    } else {
      setHasConflict(false);
    }
  }, [selectedChatterId, date, startTime, endTime]);

  const handleCreatorToggle = (creatorId: string) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleSave = () => {
    // Validate
    if (!selectedChatterId || !date || !startTime || !endTime) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedCreatorIds.length === 0) {
      alert("Please select at least one creator");
      return;
    }

    // TODO: Save shift
    console.log({
      chatterId: selectedChatterId,
      creatorIds: selectedCreatorIds,
      date,
      startTime,
      endTime,
      recurrence,
      handoffNotes,
    });

    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setSelectedChatterId("");
    setSelectedCreatorIds([]);
    setDate("");
    setStartTime("09:00");
    setEndTime("17:00");
    setRecurrence("none");
    setHandoffNotes("");
    setHasConflict(false);
    onClose();
  };

  const selectedChatter = chatters.find((c) => c.id === selectedChatterId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {editShiftId ? "Edit Shift" : "Create New Shift"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Chatter Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-300">
              <Users className="h-4 w-4" />
              Chatter <span className="text-red-400">*</span>
            </Label>
            <Select value={selectedChatterId} onValueChange={setSelectedChatterId}>
              <SelectTrigger className="h-12 border-slate-700 bg-slate-800/50 text-white">
                <SelectValue placeholder="Select a chatter" />
              </SelectTrigger>
              <SelectContent>
                {chatters.map((chatter) => (
                  <SelectItem key={chatter.id} value={chatter.id}>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
                          chatter.color === "purple" && "bg-purple-600",
                          chatter.color === "blue" && "bg-blue-600",
                          chatter.color === "pink" && "bg-pink-600",
                          chatter.color === "green" && "bg-green-600"
                        )}
                      >
                        {chatter.avatar}
                      </div>
                      <span>{chatter.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Creator Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-300">
              <Users className="h-4 w-4" />
              Creators <span className="text-red-400">*</span>
            </Label>
            <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              {creators.map((creator) => (
                <div key={creator.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`creator-${creator.id}`}
                    checked={selectedCreatorIds.includes(creator.id)}
                    onCheckedChange={() => handleCreatorToggle(creator.id)}
                    className="border-slate-600"
                  />
                  <Label
                    htmlFor={`creator-${creator.id}`}
                    className="flex-1 cursor-pointer text-white"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{creator.name}</span>
                      <span className="text-sm text-slate-400">
                        {creator.username}
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-300">
                <Calendar className="h-4 w-4" />
                Date <span className="text-red-400">*</span>
              </Label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-300">
                <Clock className="h-4 w-4" />
                Start Time <span className="text-red-400">*</span>
              </Label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-12 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-300">
                <Clock className="h-4 w-4" />
                End Time <span className="text-red-400">*</span>
              </Label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-12 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Recurrence */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-300">
              <Repeat className="h-4 w-4" />
              Recurrence
            </Label>
            <Select value={recurrence} onValueChange={(v) => setRecurrence(v as RecurrenceType)}>
              <SelectTrigger className="h-12 border-slate-700 bg-slate-800/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Biweekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Handoff Notes */}
          <div className="space-y-2">
            <Label className="text-slate-300">
              Handoff Notes
            </Label>
            <Textarea
              value={handoffNotes}
              onChange={(e) => setHandoffNotes(e.target.value)}
              placeholder="Add any important notes for the next chatter..."
              className="min-h-24 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Conflict Warning */}
          {hasConflict && (
            <div className="rounded-lg border-2 border-red-500/50 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <div>
                  <h4 className="font-semibold text-red-400">
                    Schedule Conflict Detected
                  </h4>
                  <p className="mt-1 text-sm text-red-300">
                    This shift overlaps with an existing shift for the selected
                    chatter. You can still save this shift, but it will be
                    marked as conflicting.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className={cn(
              "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
              hasConflict && "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            )}
          >
            {hasConflict ? "Save with Conflict" : "Save Shift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
