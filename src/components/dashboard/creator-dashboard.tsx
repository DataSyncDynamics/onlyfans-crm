"use client";

import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TopFansTable } from "@/components/dashboard/top-fans-table";
import {
  CREATORS,
  calculateDailyRevenue,
  TRANSACTIONS,
  FANS,
  getChatterPerformance,
  CREATORS as ALL_CREATORS,
} from "@/lib/mock-data";
import { DollarSign, Users, MessageSquare, TrendingUp } from "lucide-react";
import { ChatterPerformanceCard } from "./chatter-performance-card";

export function CreatorDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 90>(30);

  // Mock: Assume logged-in creator is Bella Rose (first creator)
  const currentCreator = CREATORS[0];

  // Filter data to only this creator's data
  const creatorFans = useMemo(() => {
    if (!currentCreator) return [];
    return FANS.filter(fan => fan.creatorId === currentCreator.id);
  }, [currentCreator]);

  const creatorTransactions = useMemo(() => {
    if (!currentCreator) return [];
    return TRANSACTIONS.filter(t => t.creatorId === currentCreator.id);
  }, [currentCreator]);

  // Calculate metrics for this creator only
  const activeFans = useMemo(() => {
    return creatorFans.filter(f => f.subscriptionStatus === "active").length;
  }, [creatorFans]);

  const totalRevenue = useMemo(() => {
    return creatorTransactions
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [creatorTransactions]);

  const avgRevenuePerFan = useMemo(() => {
    return creatorFans.length > 0 ? totalRevenue / creatorFans.length : 0;
  }, [totalRevenue, creatorFans.length]);

  // Calculate messages today (client-only)
  const [messagesToday, setMessagesToday] = useState(0);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = creatorTransactions.filter(
      (t) => t.type === "message" && t.createdAt >= today
    ).length;
    setMessagesToday(count);
  }, [creatorTransactions]);

  // Revenue data filtered to this creator
  const revenueData = useMemo(() => {
    const allData = calculateDailyRevenue(selectedPeriod);
    // Filter to only this creator's transactions
    return allData.map(day => ({
      ...day,
      amount: creatorTransactions
        .filter(t =>
          t.status === "completed" &&
          new Date(t.createdAt).toDateString() === new Date(day.date).toDateString()
        )
        .reduce((sum, t) => sum + t.amount, 0)
    }));
  }, [selectedPeriod, creatorTransactions]);

  // Top fans for this creator
  const topFans = useMemo(() => {
    return [...creatorFans]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  }, [creatorFans]);

  // Recent transactions for this creator
  const recentTransactions = useMemo(() => {
    return [...creatorTransactions]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 20);
  }, [creatorTransactions]);

  // Chatters assigned to this creator
  const assignedChatters = useMemo(() => {
    const allChatters = getChatterPerformance();
    // Mock: Filter chatters assigned to this creator (in real app, check assignments table)
    return allChatters.slice(0, 3); // For demo, show top 3
  }, []);

  // Sparkline for revenue trend
  const last7DaysRevenue = useMemo(() => {
    return calculateDailyRevenue(7).map(day => ({
      ...day,
      amount: creatorTransactions
        .filter(t =>
          t.status === "completed" &&
          new Date(t.createdAt).toDateString() === new Date(day.date).toDateString()
        )
        .reduce((sum, t) => sum + t.amount, 0)
    }));
  }, [creatorTransactions]);

  const revenueSparkline = last7DaysRevenue.map((d) => d.amount);

  // If no creator data, return null
  if (!currentCreator) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Welcome back, {currentCreator.displayName}! Here&apos;s your performance overview.
        </p>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <MetricCard
          title="My Total Revenue"
          value={`$${totalRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          sparklineData={revenueSparkline}
        />
        <MetricCard
          title="My Active Fans"
          value={activeFans.toLocaleString()}
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
          value={`$${avgRevenuePerFan.toFixed(2)}`}
          change="+5.3%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* My Team (Assigned Chatters) */}
      <div className="animate-fade-in">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">My Team</h2>
          <p className="text-sm text-slate-400">Chatters assigned to you</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedChatters.map((chatter) => (
            <ChatterPerformanceCard
              key={chatter.id}
              chatter={chatter}
            />
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="animate-slide-up rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">My Revenue Trends</h2>
        <RevenueChart data={revenueData} onPeriodChange={setSelectedPeriod} />
      </div>

      {/* Two Column Section - Top Fans & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Fans Table */}
        <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">My Top Fans</h2>
            <span className="text-sm text-slate-400">By total spend</span>
          </div>
          <TopFansTable fans={topFans} creators={ALL_CREATORS} />
        </div>

        {/* Recent Activity Feed */}
        <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">My Recent Activity</h2>
            <span className="text-sm text-slate-400">Last 20 transactions</span>
          </div>
          <ActivityFeed transactions={recentTransactions} limit={20} />
        </div>
      </div>
    </div>
  );
}
