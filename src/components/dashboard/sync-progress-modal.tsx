"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  Users,
  DollarSign,
  Loader2,
} from "lucide-react";
import { SyncProgress } from "@/lib/services/data-sync";

interface SyncProgressModalProps {
  open: boolean;
  onClose: () => void;
  creatorId: string;
  ofUsername: string;
}

export function SyncProgressModal({
  open,
  onClose,
  creatorId,
  ofUsername,
}: SyncProgressModalProps) {
  const [progress, setProgress] = useState<SyncProgress>({
    stage: "authenticating",
    message: "Starting sync...",
    progress: 0,
  });
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!open) return;

    const startSync = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/creators/${creatorId}/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Sync failed");
        }

        // Poll for progress
        const pollInterval = setInterval(async () => {
          const statusResponse = await fetch(
            `/api/creators/${creatorId}/sync-status`
          );
          const status = await statusResponse.json();

          setProgress(status);

          if (status.stage === "completed") {
            clearInterval(pollInterval);
            setCanClose(true);
          } else if (status.stage === "error") {
            clearInterval(pollInterval);
            setCanClose(true);
          }
        }, 1000);
      } catch (error) {
        setProgress({
          stage: "error",
          message: error instanceof Error ? error.message : "Sync failed",
          progress: 0,
        });
        setCanClose(true);
      }
    };

    // Start sync process
    startSync();
  }, [open, creatorId]);

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  const getStageIcon = () => {
    if (progress.stage === "completed") {
      return <CheckCircle2 className="h-12 w-12 text-emerald-500" />;
    }
    if (progress.stage === "error") {
      return <AlertCircle className="h-12 w-12 text-red-500" />;
    }
    return <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />;
  };

  return (
    <Dialog open={open} onOpenChange={canClose ? onClose : undefined}>
      <DialogContent
        className="max-w-lg bg-slate-950 border-slate-800"
        onPointerDownOutside={(e) => !canClose && e.preventDefault()}
        onEscapeKeyDown={(e) => !canClose && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Syncing {ofUsername}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Icon */}
          <div className="flex justify-center">{getStageIcon()}</div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{progress.message}</span>
              <span className="text-white font-medium">{progress.progress}%</span>
            </div>
            <Progress value={progress.progress} className="h-2" />
          </div>

          {/* Stage Indicator */}
          <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
            <div className="space-y-3">
              <div className={`flex items-center gap-3 ${
                ["authenticating", "fetching_stats", "fetching_transactions", "fetching_fans", "processing", "completed"].includes(progress.stage)
                  ? "opacity-100"
                  : "opacity-40"
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  progress.stage === "authenticating" ? "bg-purple-500 animate-pulse" : "bg-slate-600"
                }`} />
                <span className="text-sm text-slate-300">Authenticating</span>
              </div>

              <div className={`flex items-center gap-3 ${
                ["fetching_stats", "fetching_transactions", "fetching_fans", "processing", "completed"].includes(progress.stage)
                  ? "opacity-100"
                  : "opacity-40"
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  progress.stage === "fetching_stats" ? "bg-purple-500 animate-pulse" : "bg-slate-600"
                }`} />
                <span className="text-sm text-slate-300">Fetching Statistics</span>
              </div>

              <div className={`flex items-center gap-3 ${
                ["fetching_transactions", "fetching_fans", "processing", "completed"].includes(progress.stage)
                  ? "opacity-100"
                  : "opacity-40"
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  progress.stage === "fetching_transactions" ? "bg-purple-500 animate-pulse" : "bg-slate-600"
                }`} />
                <span className="text-sm text-slate-300">Syncing Transactions</span>
              </div>

              <div className={`flex items-center gap-3 ${
                ["fetching_fans", "processing", "completed"].includes(progress.stage)
                  ? "opacity-100"
                  : "opacity-40"
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  progress.stage === "fetching_fans" ? "bg-purple-500 animate-pulse" : "bg-slate-600"
                }`} />
                <span className="text-sm text-slate-300">Syncing Subscribers</span>
              </div>

              <div className={`flex items-center gap-3 ${
                ["processing", "completed"].includes(progress.stage)
                  ? "opacity-100"
                  : "opacity-40"
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  progress.stage === "processing" ? "bg-purple-500 animate-pulse" : "bg-slate-600"
                }`} />
                <span className="text-sm text-slate-300">Processing Data</span>
              </div>
            </div>
          </div>

          {/* Items Synced (shown when completed) */}
          {progress.stage === "completed" && progress.itemsSynced && (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-emerald-400">Transactions</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {progress.itemsSynced.transactions.toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-purple-400">Fans</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {progress.itemsSynced.fans.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {progress.stage === "error" && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm text-red-400">{progress.message}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {progress.stage === "completed" || progress.stage === "error" ? (
              <Button
                onClick={handleClose}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {progress.stage === "completed" ? "Done" : "Close"}
              </Button>
            ) : (
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full"
                disabled={!canClose}
              >
                Continue in Background
              </Button>
            )}
          </div>

          {/* Note */}
          {progress.stage !== "completed" && progress.stage !== "error" && (
            <p className="text-xs text-slate-500 text-center">
              This may take a few minutes. You can close this and we&apos;ll continue syncing in the background.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
