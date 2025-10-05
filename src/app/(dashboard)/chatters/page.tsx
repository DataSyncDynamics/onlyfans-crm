"use client";

import { useState, useMemo } from "react";
import { ChatterPerformanceCard } from "@/components/dashboard/chatter-performance-card";
import { getChatterPerformance, CHATTERS, getCreatorById } from "@/lib/mock-data";
import {
  Users,
  Clock,
  DollarSign,
  Activity,
  Trophy,
  Medal,
  Award,
  ChevronDown,
} from "lucide-react";

// Performance grade utilities
const getPerformanceGrade = (score: number): string => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const getGradeColor = (grade: string): string => {
  switch (grade) {
    case "A":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    case "B":
      return "text-blue-500 bg-blue-500/10 border-blue-500/30";
    case "C":
      return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    case "D":
      return "text-orange-500 bg-orange-500/10 border-orange-500/30";
    default:
      return "text-red-500 bg-red-500/10 border-red-500/30";
  }
};

const getRankBadge = (rank: number) => {
  if (rank === 1) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/50">
        <Trophy className="h-4 w-4 text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-500 shadow-lg shadow-slate-500/50">
        <Medal className="h-4 w-4 text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 shadow-lg shadow-amber-600/50">
        <Award className="h-4 w-4 text-white" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50 text-slate-400">
      <span className="text-sm font-semibold">#{rank}</span>
    </div>
  );
};

const getStatusDot = (status: string) => {
  switch (status) {
    case "active":
      return <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />;
    case "on_break":
      return <div className="h-2 w-2 rounded-full bg-amber-500" />;
    default:
      return <div className="h-2 w-2 rounded-full bg-slate-600" />;
  }
};

export default function ChattersPage() {
  const [timeRange] = useState<"today" | "week" | "month" | "all">("month");

  // Get ranked chatters
  const rankedChatters = useMemo(() => {
    return getChatterPerformance();
  }, []);

  // Calculate overview stats
  const stats = useMemo(() => {
    const totalChatters = CHATTERS.length;
    const activeChatters = CHATTERS.filter((c) => c.status === "active").length;
    const totalResponseTimes = CHATTERS.reduce((sum, c) => sum + c.avgResponseTime, 0);
    const avgResponseTime = totalResponseTimes / totalChatters;
    const totalRevenue = CHATTERS.reduce((sum, c) => sum + c.revenueGenerated, 0);

    return {
      totalChatters,
      activeChatters,
      avgResponseTime,
      totalRevenue,
    };
  }, []);

  // Calculate performance distribution
  const performanceDistribution = useMemo(() => {
    const distribution = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    };

    CHATTERS.forEach((chatter) => {
      const grade = getPerformanceGrade(chatter.performanceScore);
      distribution[grade as keyof typeof distribution]++;
    });

    return distribution;
  }, []);

  // Get top 3 performers
  const topPerformers = rankedChatters.slice(0, 3);

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header */}
      <div className="animate-fade-in flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Chatter Performance</h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor team performance, rankings, and individual metrics
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="relative">
          <button className="flex items-center gap-2 rounded-lg border border-slate-800/50 bg-slate-900/50 px-4 py-2 text-sm text-white backdrop-blur-xl transition-all hover:border-slate-700/50 hover:bg-slate-800/50">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="capitalize">{timeRange === "all" ? "All Time" : `This ${timeRange}`}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-purple-500/10 p-3">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Chatters</p>
              <p className="text-2xl font-bold text-white">{stats.totalChatters}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-green-500/10 p-3">
              <Activity className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Now</p>
              <p className="text-2xl font-bold text-white">{stats.activeChatters}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">{stats.avgResponseTime.toFixed(1)}m</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-green-500/10 p-3">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">
                ${(stats.totalRevenue / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Performance Leaderboard</h2>
          <p className="mt-1 text-sm text-slate-400">Ranked by performance score</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="pb-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="pb-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Chatter
                </th>
                <th className="pb-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Assigned Creators
                </th>
                <th className="pb-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Messages
                </th>
                <th className="pb-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="pb-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Avg Response
                </th>
                <th className="pb-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="pb-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {rankedChatters.map((chatter, index) => {
                const rank = index + 1;
                const grade = getPerformanceGrade(chatter.performanceScore);
                const gradeColor = getGradeColor(grade);

                return (
                  <tr
                    key={chatter.id}
                    className="group transition-colors hover:bg-slate-800/20"
                  >
                    {/* Rank */}
                    <td className="py-4">
                      {getRankBadge(rank)}
                    </td>

                    {/* Chatter Name */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                          <span className="text-sm font-bold text-white">
                            {chatter.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{chatter.name}</p>
                          <p className="text-xs capitalize text-slate-400">{chatter.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Creators */}
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {chatter.assignedCreators.map((creatorId) => {
                          const creator = getCreatorById(creatorId);
                          return (
                            <span
                              key={creatorId}
                              className="inline-flex items-center rounded-md bg-slate-800/50 px-2 py-0.5 text-xs text-slate-300"
                              title={creator?.displayName}
                            >
                              {creator?.username || "Unknown"}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Messages */}
                    <td className="py-4 text-right">
                      <span className="text-sm font-medium text-white">
                        {chatter.messageCount.toLocaleString()}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="py-4 text-right">
                      <span className="text-sm font-semibold text-green-400">
                        ${(chatter.revenueGenerated / 1000).toFixed(0)}k
                      </span>
                    </td>

                    {/* Avg Response Time */}
                    <td className="py-4 text-right">
                      <span className="text-sm text-slate-300">
                        {chatter.avgResponseTime.toFixed(1)}m
                      </span>
                    </td>

                    {/* Performance Score */}
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${gradeColor}`}
                        >
                          <span className="text-sm font-bold">{grade}</span>
                        </div>
                        <span className="text-sm text-slate-400">
                          {chatter.performanceScore}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusDot(chatter.status)}
                        <span className="text-xs capitalize text-slate-400">
                          {chatter.status.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section - Top Performers & Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Performers - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-fade-in">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Top Performers</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {topPerformers.map((chatter, index) => (
                <ChatterPerformanceCard
                  key={chatter.id}
                  chatter={chatter}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="animate-fade-in rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Performance Distribution</h2>
            <p className="mt-1 text-sm text-slate-400">Grade breakdown</p>
          </div>

          <div className="space-y-4">
            {Object.entries(performanceDistribution).map(([grade, count]) => {
              const gradeColor = getGradeColor(grade);
              const percentage = (count / CHATTERS.length) * 100;

              return (
                <div key={grade} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border ${gradeColor}`}
                      >
                        <span className="text-sm font-bold">{grade}</span>
                      </div>
                      <span className="text-sm text-slate-300">
                        Grade {grade}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        grade === "A"
                          ? "bg-emerald-500"
                          : grade === "B"
                          ? "bg-blue-500"
                          : grade === "C"
                          ? "bg-amber-500"
                          : grade === "D"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Excellence Rate (A+B)</span>
              <span className="text-sm font-semibold text-emerald-400">
                {(
                  ((performanceDistribution.A + performanceDistribution.B) /
                    CHATTERS.length) *
                  100
                ).toFixed(0)}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Needs Improvement (D+F)</span>
              <span className="text-sm font-semibold text-orange-400">
                {(
                  ((performanceDistribution.D + performanceDistribution.F) /
                    CHATTERS.length) *
                  100
                ).toFixed(0)}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
