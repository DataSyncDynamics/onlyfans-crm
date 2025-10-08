"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Activity,
  TrendingUp,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionHealth {
  totalConnections: number;
  connectedCount: number;
  warningCount: number;
  errorCount: number;
  syncSuccessRate: number; // 0-100
  totalItemsSynced: number;
  last24Hours: {
    syncs: number;
    items: number;
  };
}

interface ConnectionHealthDashboardProps {
  health: ConnectionHealth;
}

export function ConnectionHealthDashboard({
  health,
}: ConnectionHealthDashboardProps) {
  const getSuccessRateColor = () => {
    if (health.syncSuccessRate >= 90) return "text-emerald-500";
    if (health.syncSuccessRate >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const getSuccessRateBgColor = () => {
    if (health.syncSuccessRate >= 90) return "bg-emerald-500";
    if (health.syncSuccessRate >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const healthCards = [
    {
      title: "Connected",
      value: health.connectedCount,
      total: health.totalConnections,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Warnings",
      value: health.warningCount,
      total: health.totalConnections,
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Errors",
      value: health.errorCount,
      total: health.totalConnections,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Alert Banner */}
      {health.errorCount > 0 && (
        <div className="rounded-lg bg-red-950/30 border border-red-900/50 p-4">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-400">
                Connection Issues Detected
              </p>
              <p className="text-sm text-red-400/80 mt-1">
                {health.errorCount} connection{health.errorCount > 1 ? "s" : ""}{" "}
                {health.errorCount > 1 ? "require" : "requires"} attention.
                Please check the connection settings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {healthCards.map((card) => (
          <Card
            key={card.title}
            className={cn(
              "bg-slate-900/50 border",
              card.borderColor || "border-slate-800"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">{card.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      {card.value}
                    </span>
                    <span className="text-sm text-slate-500">
                      / {card.total}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center h-12 w-12 rounded-lg",
                    card.bgColor
                  )}
                >
                  <card.icon className={cn("h-6 w-6", card.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sync Success Rate */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Sync Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "text-3xl font-bold",
                    getSuccessRateColor()
                  )}
                >
                  {health.syncSuccessRate}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300 rounded-full",
                    getSuccessRateBgColor()
                  )}
                  style={{ width: `${health.syncSuccessRate}%` }}
                />
              </div>
              {health.syncSuccessRate >= 90 ? (
                <Badge variant="success" className="text-xs">
                  Excellent
                </Badge>
              ) : health.syncSuccessRate >= 70 ? (
                <Badge variant="warning" className="text-xs">
                  Good
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Needs Attention
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Items Synced */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Total Items Synced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  {formatNumber(health.totalItemsSynced)}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                All-time across all connections
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Last 24 Hours */}
        <Card className="bg-slate-900/50 border-slate-800 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Last 24 Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Syncs</span>
                <span className="text-xl font-bold text-white">
                  {health.last24Hours.syncs}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Items</span>
                <span className="text-xl font-bold text-purple-400">
                  {formatNumber(health.last24Hours.items)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
