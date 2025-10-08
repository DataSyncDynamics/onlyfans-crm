"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { CHATTERS, TRANSACTIONS, CREATORS, FANS } from "@/lib/mock-data";
import {
  MessageSquare,
  DollarSign,
  Clock,
  Award,
  TrendingUp,
  Users,
  ArrowLeft,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      return "text-green-400 bg-green-500/10 border-green-500/30";
    case "B":
      return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    case "C":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
    case "D":
      return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    default:
      return "text-red-400 bg-red-500/10 border-red-500/30";
  }
};

export default function ChatterProfilePage() {
  const params = useParams();
  const router = useRouter();
  const chatterId = params.id as string;

  // Get chatter data
  const chatter = useMemo(() => {
    return CHATTERS.find((c) => c.id === chatterId);
  }, [chatterId]);

  // Get assigned creators
  const assignedCreators = useMemo(() => {
    if (!chatter) return [];
    return CREATORS.filter((creator) =>
      chatter.assignedCreators.includes(creator.id)
    );
  }, [chatter]);

  // Get transactions for this chatter's assigned creators
  const chatterTransactions = useMemo(() => {
    if (!chatter) return [];
    return TRANSACTIONS.filter(
      (t) =>
        chatter.assignedCreators.includes(t.creatorId) &&
        t.type === "message" &&
        t.status === "completed"
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by most recent first
  }, [chatter]);

  // Calculate metrics
  const totalFans = useMemo(() => {
    if (!chatter) return 0;
    return FANS.filter((f) =>
      chatter.assignedCreators.includes(f.creatorId)
    ).length;
  }, [chatter]);

  const recentActivity = useMemo(() => {
    return chatterTransactions.slice(0, 20);
  }, [chatterTransactions]);

  if (!chatter) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Chatter Not Found</h2>
          <p className="mt-2 text-slate-400">
            The chatter profile you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => router.push("/chatters")}
            className="mt-6"
          >
            Back to Chatters
          </Button>
        </div>
      </div>
    );
  }

  const grade = getPerformanceGrade(chatter.performanceScore);
  const gradeColor = getGradeColor(grade);

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <Button
        onClick={() => router.push("/")}
        variant="outline"
        className="gap-2 border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Chatter Header */}
      <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ring-4 ring-slate-800">
              <span className="text-3xl font-bold text-white">
                {chatter.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{chatter.name}</h1>
                {chatter.role === "lead" && (
                  <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/30">
                    <Crown className="h-3 w-3" />
                    Lead Chatter
                  </div>
                )}
              </div>
              <p className="mt-1 text-slate-400 capitalize">{chatter.role} Chatter</p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <div className={`h-2 w-2 rounded-full ${chatter.status === "active" ? "bg-green-400" : "bg-slate-600"}`} />
                <span className="text-slate-400 capitalize">{chatter.status}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{chatter.email}</span>
              </div>
            </div>
          </div>

          {/* Performance Grade */}
          <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 ${gradeColor}`}>
            <div className="text-center">
              <div className="text-4xl font-bold">{grade}</div>
              <div className="text-xs opacity-80">Grade</div>
            </div>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>Performance Score</span>
            <span className="font-semibold text-white">{chatter.performanceScore}/100</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${chatter.performanceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Messages Sent"
          value={chatter.messageCount.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={MessageSquare}
        />
        <MetricCard
          title="Revenue Generated"
          value={`$${(chatter.revenueGenerated / 1000).toFixed(0)}k`}
          change="+18.3%"
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${chatter.avgResponseTime.toFixed(1)}m`}
          change="-5.2%"
          trend="up"
          icon={Clock}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${chatter.conversionRate}%`}
          change="+3.1%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Assigned Creators & Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assigned Creators */}
        <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Assigned Creators</h2>
            <span className="text-sm text-slate-400">{assignedCreators.length} creators</span>
          </div>
          <div className="space-y-3">
            {assignedCreators.map((creator) => (
              <div
                key={creator.id}
                className="flex items-center gap-3 rounded-lg border border-slate-800/50 bg-slate-800/30 p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <span className="text-sm font-bold text-white">
                    {creator.displayName.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{creator.displayName}</p>
                  <p className="text-xs text-slate-400">{creator.ofUsername}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">
                    ${(creator.totalRevenue / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-slate-400">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Additional Metrics</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-800/30 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Fans Managed</p>
                  <p className="text-2xl font-bold text-white">{totalFans}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-800/30 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Hours This Week</p>
                  <p className="text-2xl font-bold text-white">{chatter.hoursWorked}h</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-800/30 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Revenue per Hour</p>
                  <p className="text-2xl font-bold text-white">
                    ${chatter.hoursWorked > 0 ? Math.round(chatter.revenueGenerated / chatter.hoursWorked) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <span className="text-sm text-slate-400">Last 20 message transactions</span>
        </div>
        <ActivityFeed transactions={recentActivity} limit={20} />
      </div>
    </div>
  );
}
