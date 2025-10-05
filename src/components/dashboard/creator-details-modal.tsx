"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MetricCard } from "@/components/ui/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ArchiveCreatorDialog } from "@/components/dashboard/archive-creator-dialog";
import { Creator, Fan, Transaction, Chatter } from "@/types";
import { TRANSACTIONS, FANS, CHATTERS, getCreatorById } from "@/lib/mock-data";
import {
  DollarSign,
  Users,
  UserCheck,
  TrendingUp,
  CreditCard,
  Gift,
  MessageSquare,
  Image as ImageIcon,
  Crown,
  ExternalLink,
  Edit,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CreatorWithMetrics extends Creator {
  avgRevenuePerFan: number;
  revenueData: number[];
}

interface CreatorDetailsModalProps {
  creator: CreatorWithMetrics | null;
  open: boolean;
  onClose: () => void;
  onArchive?: (creatorId: string) => void;
}

export function CreatorDetailsModal({
  creator,
  open,
  onClose,
  onArchive,
}: CreatorDetailsModalProps) {
  const [revenuePeriod, setRevenuePeriod] = useState<7 | 30 | 90>(30);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  // Calculate all metrics
  const metrics = useMemo(() => {
    if (!creator) return null;

    // Get all data for this creator
    const creatorFans = FANS.filter((f) => f.creatorId === creator.id);
    const creatorTransactions = TRANSACTIONS.filter(
      (t) => t.creatorId === creator.id && t.status === "completed"
    );

    // Calculate revenue by type
    const revenueByType = {
      subscription: 0,
      tip: 0,
      message: 0,
      ppv: 0,
    };

    creatorTransactions.forEach((t) => {
      revenueByType[t.type] += t.amount;
    });

    // Calculate revenue by chatter
    const revenueByChatter: Record<string, { chatter: Chatter | undefined; revenue: number }> = {};

    creatorTransactions.forEach((t) => {
      if (t.chatterId) {
        if (!revenueByChatter[t.chatterId]) {
          revenueByChatter[t.chatterId] = {
            chatter: CHATTERS.find((c) => c.id === t.chatterId),
            revenue: 0,
          };
        }
        revenueByChatter[t.chatterId].revenue += t.amount;
      }
    });

    // Get top fans for this creator
    const topFans = creatorFans
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // Calculate tier distribution
    const tierDistribution = {
      whale: creatorFans.filter((f) => f.tier === "whale").length,
      high: creatorFans.filter((f) => f.tier === "high").length,
      medium: creatorFans.filter((f) => f.tier === "medium").length,
      low: creatorFans.filter((f) => f.tier === "low").length,
    };

    // Calculate revenue data for selected period
    const revenueDataByPeriod: { date: string; amount: number }[] = [];
    for (let i = revenuePeriod - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayRevenue = TRANSACTIONS.filter(
        (t) =>
          t.creatorId === creator.id &&
          t.createdAt >= dayStart &&
          t.createdAt <= dayEnd &&
          t.status === "completed"
      ).reduce((sum, t) => sum + t.amount, 0);

      revenueDataByPeriod.push({
        date: dayStart.toISOString(),
        amount: dayRevenue,
      });
    }

    // Calculate previous 30-day revenue for comparison
    const prev30DayRevenue = TRANSACTIONS.filter((t) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      return (
        t.creatorId === creator.id &&
        t.createdAt >= sixtyDaysAgo &&
        t.createdAt < thirtyDaysAgo &&
        t.status === "completed"
      );
    }).reduce((sum, t) => sum + t.amount, 0);

    const revenueChange = prev30DayRevenue > 0
      ? ((creator.totalRevenue - prev30DayRevenue) / prev30DayRevenue) * 100
      : 0;

    return {
      creatorFans,
      creatorTransactions,
      revenueByType,
      revenueByChatter: Object.values(revenueByChatter)
        .filter((item) => item.chatter)
        .sort((a, b) => b.revenue - a.revenue),
      topFans,
      tierDistribution,
      revenueDataByPeriod,
      revenueChange,
    };
  }, [creator, revenuePeriod]);

  if (!creator || !metrics) return null;

  const getStatusBadge = (status: Creator["status"]) => {
    const styles = {
      active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      inactive: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      suspended: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
      <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium", styles[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTierBadge = (tier: Fan["tier"]) => {
    const variants = {
      whale: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      high: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      low: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    };

    return (
      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold", variants[tier])}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    );
  };

  const handleArchive = async () => {
    if (onArchive && creator) {
      await onArchive(creator.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <span className="text-2xl font-bold text-white">
                  {creator.displayName.charAt(0)}
                </span>
              </div>

              {/* Creator Info */}
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {creator.displayName}
                </DialogTitle>
                <p className="text-sm text-slate-400">{creator.ofUsername}</p>
                <div className="mt-2">{getStatusBadge(creator.status)}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-400 hover:text-red-300"
                onClick={() => setArchiveDialogOpen(true)}
              >
                <Archive className="h-4 w-4" />
                Archive
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Revenue"
              value={`$${(creator.totalRevenue / 1000).toFixed(1)}k`}
              change={`${metrics.revenueChange >= 0 ? "+" : ""}${metrics.revenueChange.toFixed(1)}%`}
              trend={metrics.revenueChange >= 0 ? "up" : "down"}
              icon={DollarSign}
              className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent"
            />
            <MetricCard
              title="Total Fans"
              value={creator.totalFans.toLocaleString()}
              icon={Users}
              className="border-slate-800/50"
            />
            <MetricCard
              title="Active Fans"
              value={creator.activeFans.toLocaleString()}
              icon={UserCheck}
              className="border-slate-800/50"
            />
            <MetricCard
              title="Avg Revenue/Fan"
              value={`$${creator.avgRevenuePerFan.toFixed(0)}`}
              icon={TrendingUp}
              className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent"
            />
          </div>

          {/* Revenue Trend Chart */}
          <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Revenue Trends</h3>
            <RevenueChart
              data={metrics.revenueDataByPeriod}
              onPeriodChange={(period) => setRevenuePeriod(period)}
            />
          </div>

          {/* Revenue Breakdown - 2 Columns */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue by Type */}
            <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Revenue by Type</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/10 p-2 ring-1 ring-purple-500/20">
                      <CreditCard className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Subscriptions</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${(metrics.revenueByType.subscription / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-slate-500">
                      {((metrics.revenueByType.subscription / creator.totalRevenue) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/10 p-2 ring-1 ring-amber-500/20">
                      <Gift className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Tips</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${(metrics.revenueByType.tip / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-slate-500">
                      {((metrics.revenueByType.tip / creator.totalRevenue) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2 ring-1 ring-blue-500/20">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Messages</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${(metrics.revenueByType.message / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-slate-500">
                      {((metrics.revenueByType.message / creator.totalRevenue) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-pink-500/10 p-2 ring-1 ring-pink-500/20">
                      <ImageIcon className="h-4 w-4 text-pink-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">PPV Content</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${(metrics.revenueByType.ppv / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-slate-500">
                      {((metrics.revenueByType.ppv / creator.totalRevenue) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue by Chatter */}
            <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Revenue by Chatter</h3>
              <div className="space-y-3">
                {metrics.revenueByChatter.length > 0 ? (
                  metrics.revenueByChatter.map((item, index) => (
                    <div
                      key={item.chatter?.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg ring-1 text-xs font-bold",
                          index === 0 ? "bg-yellow-500/10 ring-yellow-500/20 text-yellow-400" :
                          index === 1 ? "bg-slate-400/10 ring-slate-400/20 text-slate-400" :
                          "bg-orange-600/10 ring-orange-600/20 text-orange-600"
                        )}>
                          #{index + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-300">{item.chatter?.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">
                          ${(item.revenue / 1000).toFixed(1)}k
                        </p>
                        <p className="text-xs text-slate-500">
                          {((item.revenue / creator.totalRevenue) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-slate-400 py-8">
                    No chatter data available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Top Fans Table */}
          <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Top 10 Fans</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Rank</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Fan</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Tier</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Total Spent</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Messages</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {metrics.topFans.map((fan, index) => (
                    <tr key={fan.id} className="group hover:bg-slate-800/20">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {index < 3 && <Crown className="h-4 w-4 text-yellow-400" />}
                          <span className="text-sm font-medium text-slate-300">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-white">{fan.username}</div>
                        {fan.displayName && (
                          <div className="text-xs text-slate-400">{fan.displayName}</div>
                        )}
                      </td>
                      <td className="py-3">{getTierBadge(fan.tier)}</td>
                      <td className="py-3">
                        <span className="font-semibold text-emerald-400">
                          ${fan.totalSpent.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">{fan.messageCount}</td>
                      <td className="py-3">
                        <span className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          fan.subscriptionStatus === "active"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        )}>
                          {fan.subscriptionStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tier Distribution */}
          <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Fan Tier Distribution</h3>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-4">
                <p className="text-sm text-yellow-400">Whales</p>
                <p className="text-2xl font-bold text-white">{metrics.tierDistribution.whale}</p>
                <p className="text-xs text-slate-400">
                  {((metrics.tierDistribution.whale / creator.totalFans) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="rounded-lg bg-purple-500/5 border border-purple-500/20 p-4">
                <p className="text-sm text-purple-400">High Tier</p>
                <p className="text-2xl font-bold text-white">{metrics.tierDistribution.high}</p>
                <p className="text-xs text-slate-400">
                  {((metrics.tierDistribution.high / creator.totalFans) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-4">
                <p className="text-sm text-blue-400">Medium Tier</p>
                <p className="text-2xl font-bold text-white">{metrics.tierDistribution.medium}</p>
                <p className="text-xs text-slate-400">
                  {((metrics.tierDistribution.medium / creator.totalFans) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="rounded-lg bg-slate-500/5 border border-slate-500/20 p-4">
                <p className="text-sm text-slate-400">Low Tier</p>
                <p className="text-2xl font-bold text-white">{metrics.tierDistribution.low}</p>
                <p className="text-xs text-slate-400">
                  {((metrics.tierDistribution.low / creator.totalFans) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <ArchiveCreatorDialog
        open={archiveDialogOpen}
        onClose={() => setArchiveDialogOpen(false)}
        onConfirm={handleArchive}
        creatorName={creator.displayName}
      />
    </Dialog>
  );
}
