"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Settings,
  Unplug,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionStatusCardProps {
  connection: {
    id: string;
    creatorName: string;
    ofUsername: string;
    status: "connected" | "warning" | "error";
    lastSync: Date;
    nextSync?: Date;
    autoSync: boolean;
    health: number; // 0-100
  };
  onSync?: () => void;
  onDisconnect?: () => void;
  onSettings?: () => void;
  onToggleAutoSync?: (enabled: boolean) => void;
}

export function ConnectionStatusCard({
  connection,
  onSync,
  onDisconnect,
  onSettings,
  onToggleAutoSync,
}: ConnectionStatusCardProps) {
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = React.useState(
    connection.autoSync
  );

  const handleSync = async () => {
    setIsSyncing(true);
    onSync?.();
    // Simulate sync duration
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleToggleAutoSync = () => {
    const newValue = !autoSyncEnabled;
    setAutoSyncEnabled(newValue);
    onToggleAutoSync?.(newValue);
  };

  const getStatusIcon = () => {
    switch (connection.status) {
      case "connected":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (connection.status) {
      case "connected":
        return <Badge variant="success">Connected</Badge>;
      case "warning":
        return <Badge variant="warning">Warning</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  const getHealthColor = () => {
    if (connection.health >= 80) return "bg-emerald-500";
    if (connection.health >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatLastSync = () => {
    const now = new Date();
    const diff = now.getTime() - connection.lastSync.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const formatNextSync = () => {
    if (!connection.nextSync || !autoSyncEnabled) return null;
    const now = new Date();
    const diff = connection.nextSync.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `in ${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `in ${minutes}m`;
    return "Soon";
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {getStatusIcon()}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-white truncate">
                {connection.creatorName}
              </CardTitle>
              <p className="text-sm text-slate-400 truncate mt-1">
                @{connection.ofUsername}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Connection Health</span>
            <span className="text-white font-medium">
              {connection.health}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                getHealthColor()
              )}
              style={{ width: `${connection.health}%` }}
            />
          </div>
        </div>

        {/* Sync Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4" />
              <span>Last sync</span>
            </div>
            <span className="text-white">{formatLastSync()}</span>
          </div>

          {autoSyncEnabled && connection.nextSync && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="h-4 w-4" />
                <span>Next sync</span>
              </div>
              <span className="text-emerald-500">{formatNextSync()}</span>
            </div>
          )}
        </div>

        {/* Auto-sync Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-slate-800">
          <span className="text-sm text-slate-400">Auto-sync</span>
          <button
            onClick={handleToggleAutoSync}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900",
              autoSyncEnabled ? "bg-purple-600" : "bg-slate-700"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                autoSyncEnabled ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="min-h-[44px] bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:border-slate-600"
          >
            <RefreshCw
              className={cn("h-4 w-4", isSyncing && "animate-spin")}
            />
            <span className="ml-2 hidden sm:inline">Sync</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSettings}
            className="min-h-[44px] bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:border-slate-600"
          >
            <Settings className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Settings</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDisconnect}
            className="min-h-[44px] bg-slate-800/50 border-slate-700 hover:bg-red-900/50 hover:border-red-700 hover:text-red-400"
          >
            <Unplug className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Disconnect</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
