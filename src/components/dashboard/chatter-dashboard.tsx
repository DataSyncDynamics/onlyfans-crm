"use client";

import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CreatorCard } from "@/components/dashboard/creator-card";
import {
  CREATORS,
  TRANSACTIONS,
  FANS,
  CHATTERS,
  calculateDailyRevenue,
} from "@/lib/mock-data";
import { MessageSquare, Users, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ChatterDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 90>(30);

  // Mock: Assume logged-in chatter is Emma Wilson (first chatter)
  const currentChatter = CHATTERS[0];

  // Mock assigned creators (in real app, get from chatter_assignments table)
  const assignedCreators = useMemo(() => {
    // For demo: assign first 2 creators to this chatter
    return CREATORS.slice(0, 2);
  }, []);

  const assignedCreatorIds = assignedCreators.map(c => c.id);

  // Filter fans to only assigned creators
  const assignedFans = useMemo(() => {
    return FANS.filter(fan => assignedCreatorIds.includes(fan.creatorId));
  }, [assignedCreatorIds]);

  // Filter transactions to this chatter's work
  const chatterTransactions = useMemo(() => {
    // In real app: filter by chatterId
    // For demo: use transactions from assigned creators
    return TRANSACTIONS.filter(t => assignedCreatorIds.includes(t.creatorId));
  }, [assignedCreatorIds]);

  // Calculate chatter metrics (NO DOLLAR AMOUNTS - only counts and percentages)
  const [messagesToday, setMessagesToday] = useState(0);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = chatterTransactions.filter(
      (t) => t.type === "message" && t.createdAt >= today
    ).length;
    setMessagesToday(count);
  }, [chatterTransactions]);

  const fansEngaged = useMemo(() => {
    // Count unique fans this chatter messaged
    const uniqueFanIds = new Set(
      chatterTransactions
        .filter(t => t.type === "message")
        .map(t => t.fanId)
    );
    return uniqueFanIds.size;
  }, [chatterTransactions]);

  // Conversion rate (% of messages that led to purchases)
  const conversionRate = useMemo(() => {
    const messageCount = chatterTransactions.filter(t => t.type === "message").length;
    const purchaseCount = chatterTransactions.filter(t =>
      t.type === "tip" || t.type === "ppv"
    ).length;
    return messageCount > 0 ? (purchaseCount / messageCount) * 100 : 0;
  }, [chatterTransactions]);

  // Mock average response time (in minutes)
  const avgResponseTime = 12; // Mock data

  // Calculate engagement trend (messages sent over time) - NOT revenue
  const engagementData = useMemo(() => {
    const allData = calculateDailyRevenue(selectedPeriod);
    return allData.map(day => ({
      date: day.date,
      amount: chatterTransactions
        .filter(t =>
          t.type === "message" &&
          new Date(t.createdAt).toDateString() === new Date(day.date).toDateString()
        ).length // COUNT of messages, not $
    }));
  }, [selectedPeriod, chatterTransactions]);

  // Recent messages (not transactions with $)
  const recentMessages = useMemo(() => {
    return [...chatterTransactions]
      .filter(t => t.type === "message")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }, [chatterTransactions]);

  // Top engaged fans (by message count, NOT spending)
  const topEngagedFans = useMemo(() => {
    const fanEngagement = new Map<string, number>();

    chatterTransactions
      .filter(t => t.type === "message")
      .forEach(t => {
        const count = fanEngagement.get(t.fanId) || 0;
        fanEngagement.set(t.fanId, count + 1);
      });

    return Array.from(fanEngagement.entries())
      .map(([fanId, messageCount]) => {
        const fan = FANS.find(f => f.id === fanId);
        return fan ? { ...fan, messageCount } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.messageCount || 0) - (a?.messageCount || 0))
      .slice(0, 10);
  }, [chatterTransactions]);

  // Creator sparklines (message counts, not revenue)
  const creatorSparklines = useMemo(() => {
    const sparklines: Record<string, number[]> = {};
    assignedCreators.forEach((creator) => {
      const daily = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        const messageCount = chatterTransactions.filter(
          (t) =>
            t.creatorId === creator.id &&
            t.type === "message" &&
            t.createdAt >= dayStart &&
            t.createdAt <= dayEnd
        ).length;
        daily.push(messageCount);
      }
      sparklines[creator.id] = daily;
    });
    return sparklines;
  }, [assignedCreators, chatterTransactions]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white">My Performance</h1>
        <p className="mt-1 text-sm text-slate-400">
          Welcome back, {currentChatter.name}! Here&apos;s how you&apos;re doing.
        </p>
      </div>

      {/* Hero Metrics Row - NO REVENUE AMOUNTS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <MetricCard
          title="Messages Sent Today"
          value={messagesToday.toLocaleString()}
          change="+15.2%"
          trend="up"
          icon={MessageSquare}
        />
        <MetricCard
          title="Fans Engaged"
          value={fansEngaged.toLocaleString()}
          change="+8.1%"
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          change="+2.3%"
          trend="up"
          icon={TrendingUp}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${avgResponseTime} min`}
          change="-5.0%"
          trend="up"
          icon={Clock}
        />
      </div>

      {/* Assigned Creators */}
      <div className="animate-fade-in">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">My Assigned Creators</h2>
          <p className="text-sm text-slate-400">Creators you&apos;re chatting for</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {assignedCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              revenueData={creatorSparklines[creator.id]}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Engagement Trends Chart */}
      <div className="animate-slide-up rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">My Engagement Trends</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Messages sent over time</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod(7)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  selectedPeriod === 7
                    ? "bg-purple-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setSelectedPeriod(30)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  selectedPeriod === 30
                    ? "bg-purple-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setSelectedPeriod(90)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  selectedPeriod === 90
                    ? "bg-purple-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                90D
              </button>
            </div>
          </div>
          {/* Simple bar chart visualization */}
          <div className="flex items-end gap-1 h-32">
            {engagementData.map((day, i) => {
              const maxMessages = Math.max(...engagementData.map(d => d.amount));
              const height = maxMessages > 0 ? (day.amount / maxMessages) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${height}%` }}
                  title={`${day.amount} messages on ${new Date(day.date).toLocaleDateString()}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Engaged Fans (by messages, NOT spending) */}
        <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Most Engaged Fans</h2>
            <span className="text-sm text-slate-400">By message count</span>
          </div>
          <div className="space-y-3">
            {topEngagedFans.map((fan, index) => (
              <div
                key={fan?.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{fan?.username}</div>
                  <div className="text-xs text-slate-400">{fan?.messageCount} messages</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  fan?.tier === "whale"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : fan?.tier === "high"
                    ? "bg-purple-500/10 text-purple-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}>
                  {fan?.tier}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Messages</h2>
            <span className="text-sm text-slate-400">Last 10</span>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg) => {
              const fan = FANS.find(f => f.id === msg.fanId);
              const creator = CREATORS.find(c => c.id === msg.creatorId);
              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30"
                >
                  <MessageSquare className="h-4 w-4 text-blue-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white">
                      {fan?.username} <span className="text-slate-500">•</span>{" "}
                      <span className="text-slate-400">{creator?.displayName}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {msg.createdAt.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
