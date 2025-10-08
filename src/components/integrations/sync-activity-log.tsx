"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Users,
  DollarSign,
  Image,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SyncActivity {
  id: string;
  timestamp: Date;
  type: "auto" | "manual";
  status: "success" | "failed" | "partial";
  creatorName: string;
  itemsSynced: {
    messages: number;
    subscribers: number;
    transactions: number;
    content: number;
  };
  error?: string;
  duration?: number; // in seconds
}

interface SyncActivityLogProps {
  activities: SyncActivity[];
  maxItems?: number;
  showFilter?: boolean;
}

export function SyncActivityLog({
  activities,
  maxItems = 10,
  showFilter = true,
}: SyncActivityLogProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "success" | "failed">(
    "all"
  );

  const filteredActivities = React.useMemo(() => {
    let filtered = activities;
    if (filter !== "all") {
      filtered = activities.filter((activity) => activity.status === filter);
    }
    return filtered.slice(0, maxItems);
  }, [activities, filter, maxItems]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusIcon = (status: SyncActivity["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "partial":
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: SyncActivity["status"]) => {
    switch (status) {
      case "success":
        return <Badge variant="success">Success</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "partial":
        return <Badge variant="warning">Partial</Badge>;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getTotalItems = (itemsSynced: SyncActivity["itemsSynced"]) => {
    return (
      itemsSynced.messages +
      itemsSynced.subscribers +
      itemsSynced.transactions +
      itemsSynced.content
    );
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">
            Sync Activity
          </CardTitle>
          {showFilter && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "success" | "failed")
                }
                className="h-9 rounded-md border border-slate-800 bg-slate-900/50 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No sync activities found</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {getStatusIcon(activity.status)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">
                        {activity.creatorName}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs bg-slate-800/50"
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(activity.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(activity.id)}
                    className="h-8 w-8 p-0 hover:bg-slate-800"
                  >
                    {expandedId === activity.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>
                  {getTotalItems(activity.itemsSynced)} items synced
                </span>
                {activity.duration && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span>{formatDuration(activity.duration)}</span>
                  </>
                )}
              </div>

              {/* Error Message */}
              {activity.error && (
                <div className="rounded-md bg-red-950/30 border border-red-900/50 p-3">
                  <p className="text-sm text-red-400">{activity.error}</p>
                </div>
              )}

              {/* Expanded Details */}
              {expandedId === activity.id && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">
                          {activity.itemsSynced.messages}
                        </p>
                        <p className="text-xs text-slate-400">Messages</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">
                          {activity.itemsSynced.subscribers}
                        </p>
                        <p className="text-xs text-slate-400">Subscribers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      <div>
                        <p className="text-white font-medium">
                          {activity.itemsSynced.transactions}
                        </p>
                        <p className="text-xs text-slate-400">Transactions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Image className="h-4 w-4 text-pink-400" />
                      <div>
                        <p className="text-white font-medium">
                          {activity.itemsSynced.content}
                        </p>
                        <p className="text-xs text-slate-400">Content</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
