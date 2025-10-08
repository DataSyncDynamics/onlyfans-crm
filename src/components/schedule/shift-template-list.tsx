"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  Clock,
  Users,
  Edit,
  Trash2,
  Plus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShiftTemplateListProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  shifts: {
    day: string;
    startTime: string;
    endTime: string;
    chatterId: string;
    chatterName: string;
  }[];
  createdAt: Date;
  lastUsed?: Date;
}

export function ShiftTemplateList({
  isOpen,
  onClose,
}: ShiftTemplateListProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  // Mock templates
  const templates: Template[] = [
    {
      id: "1",
      name: "Weekday Morning",
      description: "Monday-Friday 9am-1pm coverage",
      shifts: [
        {
          day: "Monday",
          startTime: "9:00 AM",
          endTime: "1:00 PM",
          chatterId: "1",
          chatterName: "Sarah Chen",
        },
        {
          day: "Tuesday",
          startTime: "9:00 AM",
          endTime: "1:00 PM",
          chatterId: "1",
          chatterName: "Sarah Chen",
        },
        {
          day: "Wednesday",
          startTime: "9:00 AM",
          endTime: "1:00 PM",
          chatterId: "1",
          chatterName: "Sarah Chen",
        },
        {
          day: "Thursday",
          startTime: "9:00 AM",
          endTime: "1:00 PM",
          chatterId: "1",
          chatterName: "Sarah Chen",
        },
        {
          day: "Friday",
          startTime: "9:00 AM",
          endTime: "1:00 PM",
          chatterId: "1",
          chatterName: "Sarah Chen",
        },
      ],
      createdAt: new Date("2024-09-15"),
      lastUsed: new Date("2024-10-01"),
    },
    {
      id: "2",
      name: "Evening Shift Rotation",
      description: "5pm-1am rotating coverage",
      shifts: [
        {
          day: "Monday",
          startTime: "5:00 PM",
          endTime: "1:00 AM",
          chatterId: "2",
          chatterName: "Mike Johnson",
        },
        {
          day: "Tuesday",
          startTime: "5:00 PM",
          endTime: "1:00 AM",
          chatterId: "3",
          chatterName: "Emma Wilson",
        },
        {
          day: "Wednesday",
          startTime: "5:00 PM",
          endTime: "1:00 AM",
          chatterId: "2",
          chatterName: "Mike Johnson",
        },
        {
          day: "Thursday",
          startTime: "5:00 PM",
          endTime: "1:00 AM",
          chatterId: "3",
          chatterName: "Emma Wilson",
        },
        {
          day: "Friday",
          startTime: "5:00 PM",
          endTime: "1:00 AM",
          chatterId: "4",
          chatterName: "Alex Rodriguez",
        },
      ],
      createdAt: new Date("2024-08-20"),
      lastUsed: new Date("2024-09-28"),
    },
    {
      id: "3",
      name: "Weekend Coverage",
      description: "Saturday-Sunday full day",
      shifts: [
        {
          day: "Saturday",
          startTime: "9:00 AM",
          endTime: "9:00 PM",
          chatterId: "3",
          chatterName: "Emma Wilson",
        },
        {
          day: "Sunday",
          startTime: "9:00 AM",
          endTime: "9:00 PM",
          chatterId: "4",
          chatterName: "Alex Rodriguez",
        },
      ],
      createdAt: new Date("2024-07-10"),
    },
  ];

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    if (
      confirm(
        `Apply "${template.name}" template to the current week? This will create ${template.shifts.length} shifts.`
      )
    ) {
      // TODO: Implement template application
      console.log("Applying template:", templateId);
      onClose();
    }
  };

  const handleEditTemplate = (templateId: string) => {
    // TODO: Implement template editing
    console.log("Edit template:", templateId);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      // TODO: Implement template deletion
      console.log("Delete template:", templateId);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
            <FileText className="h-7 w-7 text-purple-400" />
            Shift Templates
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {/* Create Template Button */}
          <Button
            className="mb-4 w-full border-2 border-dashed border-purple-500/50 bg-purple-500/10 text-purple-400 hover:border-purple-500 hover:bg-purple-500/20"
            variant="outline"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Template
          </Button>

          {/* Templates List */}
          <div className="space-y-3">
            {templates.map((template) => {
              const isSelected = selectedTemplateId === template.id;

              return (
                <div
                  key={template.id}
                  className={cn(
                    "rounded-lg border p-4 transition-all",
                    isSelected
                      ? "border-purple-500/50 bg-purple-500/10"
                      : "border-slate-800 bg-slate-800/30 hover:bg-slate-800/50"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {template.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditTemplate(template.id)}
                        className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-white"
                        title="Edit template"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="rounded-md p-2 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                        title="Delete template"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>{template.shifts.length} shifts</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>Created {formatDate(template.createdAt)}</span>
                    </div>
                    {template.lastUsed && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Users className="h-4 w-4" />
                        <span>Last used {formatDate(template.lastUsed)}</span>
                      </div>
                    )}
                  </div>

                  {/* Shifts Preview */}
                  {isSelected && (
                    <div className="mt-4 space-y-2 rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Shifts in Template
                      </div>
                      {template.shifts.map((shift, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md bg-slate-800/50 p-2"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className="border-slate-600 bg-slate-700/50 text-slate-300"
                            >
                              {shift.day}
                            </Badge>
                            <span className="text-sm text-white">
                              {shift.chatterName}
                            </span>
                          </div>
                          <div className="text-sm text-slate-400">
                            {shift.startTime} - {shift.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() =>
                        setSelectedTemplateId(
                          isSelected ? null : template.id
                        )
                      }
                      variant="outline"
                      className="flex-1 border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800"
                    >
                      {isSelected ? "Hide Details" : "View Details"}
                    </Button>
                    <Button
                      onClick={() => handleApplyTemplate(template.id)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Apply Template
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {templates.length === 0 && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-lg font-semibold text-white">
                No Templates Yet
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Create your first shift template to quickly apply recurring
                schedules
              </p>
              <Button
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
