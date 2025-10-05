"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Archive, Loader2 } from "lucide-react";
import { useState } from "react";

interface ArchiveCreatorDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  creatorName: string;
}

export function ArchiveCreatorDialog({
  open,
  onClose,
  onConfirm,
  creatorName,
}: ArchiveCreatorDialogProps) {
  const [isArchiving, setIsArchiving] = useState(false);

  const handleConfirm = async () => {
    setIsArchiving(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Archive failed:", error);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-950 border-slate-800">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Archive Creator?
              </DialogTitle>
              <DialogDescription className="text-slate-400 mt-1">
                This action will remove the creator from your active list
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Creator Info */}
          <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
            <p className="text-sm text-slate-400">You are about to archive:</p>
            <p className="text-lg font-semibold text-white mt-1">{creatorName}</p>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-start gap-3">
              <Archive className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-300">
                  What happens when you archive:
                </p>
                <ul className="text-xs text-red-400/80 space-y-1 list-disc list-inside">
                  <li>Creator will be removed from your dashboard</li>
                  <li>All historical data will be preserved</li>
                  <li>OnlyFans sync will be stopped</li>
                  <li>You can restore the creator later if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isArchiving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isArchiving}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isArchiving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Archiving...
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" />
                Archive Creator
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
