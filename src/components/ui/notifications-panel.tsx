"use client";

import * as React from "react";
import { Alert } from "@/types";
import { formatDistanceToNow } from "date-fns";
import {
  DollarSign,
  MessageSquare,
  Users,
  AlertTriangle,
  Info,
  X,
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NotificationsPanelProps {
  alerts: Alert[];
  open: boolean;
  onClose: () => void;
  onMarkAsRead?: (alertId: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

// Get icon based on alert type
function getAlertIcon(type: Alert["type"]) {
  switch (type) {
    case "revenue":
      return DollarSign;
    case "message":
      return MessageSquare;
    case "chat":
      return Users;
    case "warning":
      return AlertTriangle;
    case "info":
    default:
      return Info;
  }
}

// Get color classes based on alert type
function getAlertColors(type: Alert["type"]) {
  switch (type) {
    case "revenue":
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: "text-emerald-400",
      };
    case "message":
      return {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        icon: "text-blue-400",
      };
    case "chat":
      return {
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        icon: "text-purple-400",
      };
    case "warning":
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: "text-amber-400",
      };
    case "info":
    default:
      return {
        bg: "bg-slate-500/10",
        border: "border-slate-500/20",
        icon: "text-slate-400",
      };
  }
}

// Notification Item Component
function NotificationItem({
  alert,
  onMarkAsRead,
}: {
  alert: Alert;
  onMarkAsRead?: (id: string) => void;
}) {
  const Icon = getAlertIcon(alert.type);
  const colors = getAlertColors(alert.type);

  const content = (
    <div
      className={cn(
        "group relative flex gap-3 rounded-lg border p-3 transition-all duration-200",
        alert.read
          ? "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50"
          : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
      )}
    >
      {/* Unread indicator */}
      {!alert.read && (
        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-blue-500" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
          colors.bg,
          colors.border
        )}
      >
        <Icon className={cn("h-5 w-5", colors.icon)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
          {!alert.read && onMarkAsRead && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMarkAsRead(alert.id);
              }}
              className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              title="Mark as read"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-400">{alert.message}</p>
        <p className="mt-2 text-xs text-slate-500">
          {formatDistanceToNow(alert.createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  );

  // Wrap in Link if actionUrl exists
  if (alert.actionUrl) {
    return (
      <Link href={alert.actionUrl} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export function NotificationsPanel({
  alerts,
  open,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}: NotificationsPanelProps) {
  const unreadCount = alerts.filter((a) => !a.read).length;

  // Group alerts by time
  const groupedAlerts = React.useMemo(() => {
    const now = new Date();
    const today: Alert[] = [];
    const yesterday: Alert[] = [];
    const thisWeek: Alert[] = [];
    const older: Alert[] = [];

    alerts.forEach((alert) => {
      const hoursDiff =
        (now.getTime() - alert.createdAt.getTime()) / (1000 * 60 * 60);
      const daysDiff = hoursDiff / 24;

      if (hoursDiff < 24) {
        today.push(alert);
      } else if (hoursDiff < 48) {
        yesterday.push(alert);
      } else if (daysDiff < 7) {
        thisWeek.push(alert);
      } else {
        older.push(alert);
      }
    });

    return { today, yesterday, thisWeek, older };
  }, [alerts]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-full max-w-md border-l border-slate-800/50 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/50 p-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-400">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
            )}
            {alerts.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                title="Clear all notifications"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-800/50 p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="h-[calc(100%-5rem)] overflow-y-auto p-4">
          {alerts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-slate-800/50 p-4">
                <Info className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-white">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Today */}
              {groupedAlerts.today.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Today
                  </h3>
                  <div className="space-y-2">
                    {groupedAlerts.today.map((alert) => (
                      <NotificationItem
                        key={alert.id}
                        alert={alert}
                        onMarkAsRead={onMarkAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday */}
              {groupedAlerts.yesterday.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Yesterday
                  </h3>
                  <div className="space-y-2">
                    {groupedAlerts.yesterday.map((alert) => (
                      <NotificationItem
                        key={alert.id}
                        alert={alert}
                        onMarkAsRead={onMarkAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* This Week */}
              {groupedAlerts.thisWeek.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    This Week
                  </h3>
                  <div className="space-y-2">
                    {groupedAlerts.thisWeek.map((alert) => (
                      <NotificationItem
                        key={alert.id}
                        alert={alert}
                        onMarkAsRead={onMarkAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Older */}
              {groupedAlerts.older.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Older
                  </h3>
                  <div className="space-y-2">
                    {groupedAlerts.older.map((alert) => (
                      <NotificationItem
                        key={alert.id}
                        alert={alert}
                        onMarkAsRead={onMarkAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
