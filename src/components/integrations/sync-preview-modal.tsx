"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Users,
  DollarSign,
  Image,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SyncPreview {
  newMessages: number;
  newSubscribers: number;
  newTransactions: number;
  newContent: number;
  estimatedDuration: number; // in seconds
}

interface SyncPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
  preview: SyncPreview;
  onConfirm: () => void;
}

type SyncState = "idle" | "syncing" | "complete";

export function SyncPreviewModal({
  open,
  onOpenChange,
  creatorName,
  preview,
  onConfirm,
}: SyncPreviewModalProps) {
  const [syncState, setSyncState] = React.useState<SyncState>("idle");
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!open) {
      setSyncState("idle");
      setProgress(0);
    }
  }, [open]);

  const handleConfirm = () => {
    setSyncState("syncing");
    setProgress(0);

    // Simulate sync progress
    const duration = preview.estimatedDuration * 1000;
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / steps) * 100;
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(timer);
        setSyncState("complete");
        setTimeout(() => {
          onConfirm();
          onOpenChange(false);
        }, 1500);
      }
    }, interval);

    return () => clearInterval(timer);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getTotalItems = () => {
    return (
      preview.newMessages +
      preview.newSubscribers +
      preview.newTransactions +
      preview.newContent
    );
  };

  const previewItems = [
    {
      icon: MessageSquare,
      label: "New Messages",
      count: preview.newMessages,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Users,
      label: "New Subscribers",
      count: preview.newSubscribers,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: DollarSign,
      label: "New Transactions",
      count: preview.newTransactions,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Image,
      label: "New Content",
      count: preview.newContent,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {syncState === "idle" && "Sync Preview"}
            {syncState === "syncing" && "Syncing..."}
            {syncState === "complete" && "Sync Complete"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {syncState === "idle" && (
            <>
              <div className="space-y-2">
                <p className="text-sm text-slate-400">
                  Preparing to sync data for{" "}
                  <span className="text-white font-medium">{creatorName}</span>
                </p>
                <div className="rounded-lg bg-slate-800/30 p-4 border border-slate-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total items to sync</span>
                    <span className="text-white font-semibold text-lg">
                      {getTotalItems()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {previewItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3 border border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center h-10 w-10 rounded-lg",
                          item.bgColor
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", item.color)} />
                      </div>
                      <span className="text-sm text-slate-300">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-white">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/30 rounded-lg p-3">
                <Clock className="h-4 w-4" />
                <span>
                  Estimated duration:{" "}
                  <span className="text-white font-medium">
                    {formatDuration(preview.estimatedDuration)}
                  </span>
                </span>
              </div>
            </>
          )}

          {syncState === "syncing" && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-500/10 animate-pulse">
                  <MessageSquare className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-sm text-slate-400">
                  Syncing data from OnlyFans...
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {previewItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <item.icon className={cn("h-4 w-4", item.color)} />
                    <span className="text-slate-400">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {syncState === "complete" && (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  Sync Successful
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {getTotalItems()} items synced successfully
                </p>
              </div>
            </div>
          )}
        </div>

        {syncState === "idle" && (
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-h-[44px] w-full sm:w-auto bg-slate-800/50 border-slate-700 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="min-h-[44px] w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Start Sync
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
