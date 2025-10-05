"use client";

import { useState, useMemo } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import {
  calculateDailyRevenue,
  TRANSACTIONS,
  CREATORS,
  getCreatorById,
} from "@/lib/mock-data";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  MessageSquare,
  Gift,
  Image as ImageIcon,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RevenuePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 90>(30);

  // Calculate date ranges
  const dateRanges = useMemo(() => {
    const now = new Date();
    const currentStart = new Date(now.getTime() - selectedPeriod * 24 * 60 * 60 * 1000);
    const previousStart = new Date(currentStart.getTime() - selectedPeriod * 24 * 60 * 60 * 1000);
    const previousEnd = currentStart;

    return {
      currentStart,
      currentEnd: now,
      previousStart,
      previousEnd,
    };
  }, [selectedPeriod]);

  // Calculate current period revenue
  const currentPeriodRevenue = useMemo(() => {
    return TRANSACTIONS.filter(
      (t) =>
        t.createdAt >= dateRanges.currentStart &&
        t.createdAt <= dateRanges.currentEnd &&
        t.status === "completed"
    ).reduce((sum, t) => sum + t.amount, 0);
  }, [dateRanges]);

  // Calculate previous period revenue
  const previousPeriodRevenue = useMemo(() => {
    return TRANSACTIONS.filter(
      (t) =>
        t.createdAt >= dateRanges.previousStart &&
        t.createdAt < dateRanges.previousEnd &&
        t.status === "completed"
    ).reduce((sum, t) => sum + t.amount, 0);
  }, [dateRanges]);

  // Calculate growth percentage
  const growthPercentage = useMemo(() => {
    if (previousPeriodRevenue === 0) return 0;
    return ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
  }, [currentPeriodRevenue, previousPeriodRevenue]);

  // Get revenue chart data
  const revenueData = useMemo(() => calculateDailyRevenue(selectedPeriod), [selectedPeriod]);

  // Calculate revenue by source
  const revenueBySource = useMemo(() => {
    const breakdown = {
      subscription: 0,
      tip: 0,
      message: 0,
      ppv: 0,
    };

    TRANSACTIONS.filter(
      (t) =>
        t.createdAt >= dateRanges.currentStart &&
        t.createdAt <= dateRanges.currentEnd &&
        t.status === "completed"
    ).forEach((t) => {
      breakdown[t.type] += t.amount;
    });

    return {
      subscriptions: Math.round(breakdown.subscription * 100) / 100,
      tips: Math.round(breakdown.tip * 100) / 100,
      messages: Math.round(breakdown.message * 100) / 100,
      ppv: Math.round(breakdown.ppv * 100) / 100,
    };
  }, [dateRanges]);

  // Calculate revenue by creator
  const revenueByCreator = useMemo(() => {
    const creatorRevenue: Record<string, number> = {};

    TRANSACTIONS.filter(
      (t) =>
        t.createdAt >= dateRanges.currentStart &&
        t.createdAt <= dateRanges.currentEnd &&
        t.status === "completed"
    ).forEach((t) => {
      if (!creatorRevenue[t.creatorId]) {
        creatorRevenue[t.creatorId] = 0;
      }
      creatorRevenue[t.creatorId] = (creatorRevenue[t.creatorId] || 0) + t.amount;
    });

    // Sort by revenue and get top 3
    const sorted = Object.entries(creatorRevenue)
      .map(([creatorId, revenue]) => ({
        creatorId,
        revenue: Math.round(revenue * 100) / 100,
        creator: getCreatorById(creatorId),
      }))
      .filter((item) => item.creator !== undefined)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    return sorted;
  }, [dateRanges]);

  // Get top creator
  const topCreator = revenueByCreator[0];

  // Calculate sparklines for top creators (last 7 days)
  const creatorSparklines = useMemo(() => {
    const sparklines: Record<string, number[]> = {};
    revenueByCreator.forEach(({ creatorId }) => {
      const daily = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        const revenue = TRANSACTIONS.filter(
          (t) =>
            t.creatorId === creatorId &&
            t.createdAt >= dayStart &&
            t.createdAt <= dayEnd &&
            t.status === "completed"
        ).reduce((sum, t) => sum + t.amount, 0);
        daily.push(revenue);
      }
      sparklines[creatorId] = daily;
    });
    return sparklines;
  }, [revenueByCreator]);

  const handlePeriodChange = (period: 7 | 30 | 90) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header Section */}
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Revenue Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track earnings, revenue sources, and financial performance
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-800/50 bg-slate-900/30 px-4 py-2 backdrop-blur-xl">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">
            Last {selectedPeriod} days
          </span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <MetricCard
          title="Current Period"
          value={`$${currentPeriodRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={DollarSign}
          className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent"
        />
        <MetricCard
          title="Previous Period"
          value={`$${previousPeriodRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={TrendingUp}
          className="border-slate-800/50"
        />
        <MetricCard
          title="Growth"
          value={`${growthPercentage >= 0 ? "+" : ""}${growthPercentage.toFixed(1)}%`}
          change={growthPercentage}
          trend={growthPercentage >= 0 ? "up" : "down"}
          icon={TrendingUp}
          className={cn(
            growthPercentage >= 0
              ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent"
              : "border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent"
          )}
        />
        <MetricCard
          title="Top Creator"
          value={topCreator?.creator?.displayName || "N/A"}
          icon={Crown}
          className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent"
        />
      </div>

      {/* Revenue Chart Section */}
      <div className="animate-slide-up rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Revenue Trends</h2>
        <RevenueChart data={revenueData} onPeriodChange={handlePeriodChange} />
      </div>

      {/* Two Column Breakdown Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Source */}
        <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Revenue by Source</h2>
            <span className="text-sm text-slate-400">Last {selectedPeriod} days</span>
          </div>

          <div className="space-y-4">
            {/* Subscriptions */}
            <div className="group relative overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-purple-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500/10 p-2.5 ring-1 ring-purple-500/20">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Subscriptions</p>
                    <p className="text-xs text-slate-500">Monthly recurring</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ${revenueBySource.subscriptions.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {((revenueBySource.subscriptions / currentPeriodRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="group relative overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-amber-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-500/10 p-2.5 ring-1 ring-amber-500/20">
                    <Gift className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Tips</p>
                    <p className="text-xs text-slate-500">Fan appreciation</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ${revenueBySource.tips.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {((revenueBySource.tips / currentPeriodRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="group relative overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2.5 ring-1 ring-blue-500/20">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Messages</p>
                    <p className="text-xs text-slate-500">Paid unlocks</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ${revenueBySource.messages.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {((revenueBySource.messages / currentPeriodRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* PPV */}
            <div className="group relative overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-pink-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-pink-500/10 p-2.5 ring-1 ring-pink-500/20">
                    <ImageIcon className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">PPV Content</p>
                    <p className="text-xs text-slate-500">Exclusive content</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ${revenueBySource.ppv.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {((revenueBySource.ppv / currentPeriodRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Creator */}
        <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Top Creators</h2>
            <span className="text-sm text-slate-400">Last {selectedPeriod} days</span>
          </div>

          <div className="space-y-4">
            {revenueByCreator.map((item, index) => {
              const creator = item.creator;
              if (!creator) return null;

              const percentage = (item.revenue / currentPeriodRevenue) * 100;
              const rankColors = [
                "bg-yellow-500/10 ring-yellow-500/20 text-yellow-400", // 1st
                "bg-slate-400/10 ring-slate-400/20 text-slate-400", // 2nd
                "bg-orange-600/10 ring-orange-600/20 text-orange-600", // 3rd
              ];

              return (
                <div
                  key={creator.id}
                  className="group relative overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-purple-500/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Rank Badge */}
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg ring-1 text-sm font-bold",
                          rankColors[index]
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {creator.displayName}
                        </p>
                        <p className="text-xs text-slate-500">{creator.ofUsername}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        ${item.revenue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-slate-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Sparkline for creator revenue (last 7 days) */}
                  {(() => {
                    const sparklineData = creatorSparklines[creator.id];
                    if (!sparklineData || sparklineData.length === 0) return null;

                    return (
                      <div className="mt-3 flex h-8 items-end gap-1">
                        {sparklineData.map((value, idx) => {
                          const maxValue = Math.max(...sparklineData);
                          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                          return (
                            <div
                              key={idx}
                              className="flex-1 rounded-t bg-gradient-to-t from-purple-500 to-purple-400 opacity-50 transition-all duration-300 group-hover:opacity-100"
                              style={{ height: `${height}%`, minHeight: "2px" }}
                            />
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>

          {/* Total for all creators */}
          <div className="mt-4 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Total ({CREATORS.length} creators)
              </p>
              <p className="text-xl font-bold text-white">
                ${currentPeriodRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
