"use client";

import { RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SyncStatusBadgeProps {
  lastSyncAt: Date | null;
  isCurrentlySyncing: boolean;
  error?: string;
  onManualSync?: () => void;
  className?: string;
}

export function SyncStatusBadge({
  lastSyncAt,
  isCurrentlySyncing,
  error,
  onManualSync,
  className,
}: SyncStatusBadgeProps) {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (isCurrentlySyncing) {
    return (
      <div className={cn("inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1", className)}>
        <RefreshCw className="h-3 w-3 text-purple-500 animate-spin" />
        <span className="text-xs font-medium text-purple-400">Syncing...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1">
          <AlertCircle className="h-3 w-3 text-red-500" />
          <span className="text-xs font-medium text-red-400">Sync Failed</span>
        </div>
        {onManualSync && (
          <Button
            size="sm"
            variant="outline"
            onClick={onManualSync}
            className="h-6 px-2 text-xs"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (!lastSyncAt) {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/20 bg-slate-600/5 px-3 py-1">
          <Clock className="h-3 w-3 text-slate-500" />
          <span className="text-xs font-medium text-slate-400">Not Synced</span>
        </div>
        {onManualSync && (
          <Button
            size="sm"
            variant="outline"
            onClick={onManualSync}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Sync Now
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
        <span className="text-xs font-medium text-emerald-400">
          {getTimeAgo(lastSyncAt)}
        </span>
      </div>
      {onManualSync && (
        <button
          onClick={onManualSync}
          className="text-slate-400 hover:text-white transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
