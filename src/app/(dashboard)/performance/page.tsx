"use client";

import { useMemo } from "react";
import { useRole } from "@/contexts/role-context";
import { Card } from "@/components/ui/card";
import { CHATTERS, CREATORS, TRANSACTIONS } from "@/lib/mock-data";
import {
  MessageSquare,
  Users,
  Clock,
  Award,
  Target,
  Zap,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PerformancePage() {
  const { role } = useRole();

  // Mock: Current chatter is Emma Wilson
  const currentChatter = CHATTERS[0];

  // Mock assigned creators (first 2)
  const assignedCreators = CREATORS.slice(0, 2);
  const assignedCreatorIds = assignedCreators.map(c => c.id);

  // Filter transactions to assigned creators
  const chatterTransactions = useMemo(() => {
    return TRANSACTIONS.filter(t => assignedCreatorIds.includes(t.creatorId));
  }, [assignedCreatorIds]);

  // Calculate performance metrics
  const totalMessagesSent = useMemo(() => {
    return chatterTransactions.filter(t => t.type === "message").length;
  }, [chatterTransactions]);

  const fansEngaged = useMemo(() => {
    const uniqueFanIds = new Set(
      chatterTransactions
        .filter(t => t.type === "message")
        .map(t => t.fanId)
    );
    return uniqueFanIds.size;
  }, [chatterTransactions]);

  const conversionRate = useMemo(() => {
    const messageCount = chatterTransactions.filter(t => t.type === "message").length;
    const purchaseCount = chatterTransactions.filter(t =>
      t.type === "tip" || t.type === "ppv"
    ).length;
    return messageCount > 0 ? (purchaseCount / messageCount) * 100 : 0;
  }, [chatterTransactions]);

  // Mock metrics
  const avgResponseTime = 12; // minutes
  const hoursWorkedThisWeek = 38.5;
  const performanceGrade = "A";
  const teamAvgConversionRate = 6.2;

  // Weekly goal metrics
  const weeklyGoal = {
    messages: 500,
    current: totalMessagesSent,
    conversions: 50,
    currentConversions: chatterTransactions.filter(t => t.type === "tip" || t.type === "ppv").length,
  };

  // Activity by day of week
  const activityByDay = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = Array(7).fill(0);

    chatterTransactions
      .filter(t => t.type === "message")
      .forEach(t => {
        const dayIndex = t.createdAt.getDay();
        counts[dayIndex === 0 ? 6 : dayIndex - 1]++; // Adjust Sunday to end
      });

    return days.map((day, i) => ({ day, count: counts[i] }));
  }, [chatterTransactions]);

  const maxDayCount = Math.max(...activityByDay.map(d => d.count), 1);

  // If not a chatter, show access denied
  if (role !== "chatter") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">This page is only available to chatters.</p>
        </Card>
      </div>
    );
  }

  // If no chatter data, show error
  if (!currentChatter) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-white mb-2">No Chatter Found</h2>
          <p className="text-slate-400">Unable to load chatter data.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white">My Performance</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track your metrics, goals, and achievements, {currentChatter.name}
        </p>
      </div>

      {/* Performance Grade Card */}
      <div className="animate-slide-up rounded-xl border border-slate-800/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-slate-400">Performance Grade</h2>
                <div className="text-5xl font-bold text-white">{performanceGrade}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              You&apos;re in the top 10% of the team! Keep up the excellent work.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Conversion Rate</div>
            <div className="text-3xl font-bold text-emerald-400">{conversionRate.toFixed(1)}%</div>
            <div className="text-xs text-emerald-400 mt-1">
              +{(conversionRate - teamAvgConversionRate).toFixed(1)}% vs team avg
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
              <MessageSquare className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Messages Sent</div>
              <div className="text-2xl font-bold text-white">{totalMessagesSent}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Fans Engaged</div>
              <div className="text-2xl font-bold text-white">{fansEngaged}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Avg Response</div>
              <div className="text-2xl font-bold text-white">{avgResponseTime} min</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Calendar className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Hours This Week</div>
              <div className="text-2xl font-bold text-white">{hoursWorkedThisWeek}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Goals */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Weekly Message Goal</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Progress</span>
              <span className="text-sm font-medium text-white">
                {weeklyGoal.current} / {weeklyGoal.messages}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-800">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${Math.min(100, (weeklyGoal.current / weeklyGoal.messages) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-slate-500">
              {((weeklyGoal.current / weeklyGoal.messages) * 100).toFixed(0)}% complete
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Weekly Conversion Goal</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Progress</span>
              <span className="text-sm font-medium text-white">
                {weeklyGoal.currentConversions} / {weeklyGoal.conversions}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-800">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                style={{ width: `${Math.min(100, (weeklyGoal.currentConversions / weeklyGoal.conversions) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-slate-500">
              {((weeklyGoal.currentConversions / weeklyGoal.conversions) * 100).toFixed(0)}% complete
            </div>
          </div>
        </Card>
      </div>

      {/* Activity by Day of Week */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
        <h3 className="text-lg font-semibold text-white mb-6">Activity by Day</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {activityByDay.map((day) => {
            const height = (day.count / maxDayCount) * 100;
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-full">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${height}%`, minHeight: day.count > 0 ? '10px' : '0' }}
                    title={`${day.count} messages`}
                  />
                </div>
                <div className="text-xs text-slate-400">{day.day}</div>
                <div className="text-xs font-medium text-slate-300">{day.count}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Assigned Creators Performance */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Performance by Creator</h3>
        <div className="space-y-4">
          {assignedCreators.map((creator) => {
            const creatorTransactions = chatterTransactions.filter(t => t.creatorId === creator.id);
            const messages = creatorTransactions.filter(t => t.type === "message").length;
            const conversions = creatorTransactions.filter(t => t.type === "tip" || t.type === "ppv").length;
            const convRate = messages > 0 ? (conversions / messages) * 100 : 0;

            return (
              <div
                key={creator.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                    {creator.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-white">{creator.displayName}</div>
                    <div className="text-xs text-slate-400">@{creator.username}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Messages</div>
                    <div className="text-sm font-medium text-white">{messages}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Conv. Rate</div>
                    <div className={cn(
                      "text-sm font-medium",
                      convRate >= 7 ? "text-emerald-400" :
                      convRate >= 5 ? "text-blue-400" : "text-slate-400"
                    )}>
                      {convRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
