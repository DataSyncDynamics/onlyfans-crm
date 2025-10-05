"use client";

import { useState, useMemo } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { CreatorCard } from "@/components/dashboard/creator-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TopFansTable } from "@/components/dashboard/top-fans-table";
import { ChatterPerformanceCard } from "@/components/dashboard/chatter-performance-card";
import {
  getAgencyMetrics,
  CREATORS,
  calculateDailyRevenue,
  getTopFans,
  TRANSACTIONS,
  getChatterPerformance,
} from "@/lib/mock-data";
import { DollarSign, Users, MessageSquare, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 90>(30);

  // Get metrics
  const metrics = getAgencyMetrics();
  const revenueData = useMemo(() => calculateDailyRevenue(selectedPeriod), [selectedPeriod]);
  const topFans = getTopFans(10);
  const topChatters = getChatterPerformance().slice(0, 3);

  // Get recent transactions (last 20)
  const recentTransactions = useMemo(() => {
    return [...TRANSACTIONS]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 20);
  }, []);

  // Calculate sparkline data for metrics (last 7 days)
  const last7DaysRevenue = useMemo(() => calculateDailyRevenue(7), []);
  const revenueSparkline = last7DaysRevenue.map((d) => d.amount);

  // Calculate creator sparklines (last 7 days revenue per creator)
  const creatorSparklines = useMemo(() => {
    const sparklines: Record<string, number[]> = {};
    CREATORS.forEach((creator) => {
      const daily = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        const revenue = TRANSACTIONS.filter(
          (t) =>
            t.creatorId === creator.id &&
            t.createdAt >= dayStart &&
            t.createdAt <= dayEnd &&
            t.status === "completed"
        ).reduce((sum, t) => sum + t.amount, 0);
        daily.push(revenue);
      }
      sparklines[creator.id] = daily;
    });
    return sparklines;
  }, []);

  // Calculate messages today
  const messagesToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return TRANSACTIONS.filter(
      (t) => t.type === "message" && t.createdAt >= today
    ).length;
  }, []);

  const handlePeriodChange = (period: 7 | 30 | 90) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white">Overview Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Welcome back! Here&apos;s your agency performance at a glance.
        </p>
      </div>

      {/* Hero Metrics Row - Bento Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          sparklineData={revenueSparkline}
          variant="large"
        />
        <MetricCard
          title="Active Fans"
          value={metrics.activeFans.toLocaleString()}
          change="+8.2%"
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="Messages Today"
          value={messagesToday.toLocaleString()}
          change="-3.1%"
          trend="down"
          icon={MessageSquare}
        />
        <MetricCard
          title="Avg Revenue Per Fan"
          value={`$${metrics.avgRevenuePerFan.toFixed(2)}`}
          change="+5.3%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Creator Performance Grid */}
      <div className="animate-fade-in">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Creator Performance</h2>
          <p className="text-sm text-slate-400">Click to filter dashboard</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CREATORS.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              revenueData={creatorSparklines[creator.id]}
              onClick={() => console.log("Filter by creator:", creator.id)}
            />
          ))}
        </div>
      </div>

      {/* Revenue Chart Section - Full Width */}
      <div className="animate-slide-up rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Revenue Trends</h2>
        <RevenueChart data={revenueData} onPeriodChange={handlePeriodChange} />
      </div>

      {/* Two Column Section - Top Fans & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Fans Table */}
        <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Top Fans</h2>
            <span className="text-sm text-slate-400">By total spend</span>
          </div>
          <TopFansTable fans={topFans} creators={CREATORS} />
        </div>

        {/* Recent Activity Feed */}
        <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <span className="text-sm text-slate-400">Last 20 transactions</span>
          </div>
          <ActivityFeed transactions={recentTransactions} limit={20} />
        </div>
      </div>

      {/* Chatter Performance Row */}
      <div className="animate-fade-in">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Top Chatters</h2>
          <p className="text-sm text-slate-400">Performance leaders</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topChatters.map((chatter, index) => (
            <ChatterPerformanceCard
              key={chatter.id}
              chatter={chatter}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
