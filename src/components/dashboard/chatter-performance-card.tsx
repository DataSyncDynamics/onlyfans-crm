"use client";

import { Chatter } from "@/types";
import { MessageSquare, DollarSign, Clock, Award } from "lucide-react";

interface ChatterPerformanceCardProps {
  chatter: Chatter;
}

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

export function ChatterPerformanceCard({ chatter }: ChatterPerformanceCardProps) {
  const grade = getPerformanceGrade(chatter.performanceScore);
  const gradeColor = getGradeColor(grade);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-5 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-purple-500/10">
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
          <span className="text-lg font-bold text-white">
            {chatter.name.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white">{chatter.name}</h3>
          <p className="text-sm capitalize text-slate-400">{chatter.role} Chatter</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${gradeColor}`}>
          <span className="text-lg font-bold">{grade}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-800/50 bg-slate-800/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-md bg-blue-500/10 p-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Messages</span>
          </div>
          <p className="text-xl font-bold text-white">
            {chatter.messageCount.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border border-slate-800/50 bg-slate-800/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-md bg-emerald-500/10 p-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Revenue</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">
            ${(chatter.revenueGenerated / 1000).toFixed(0)}k
          </p>
        </div>

        <div className="rounded-lg border border-slate-800/50 bg-slate-800/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-md bg-purple-500/10 p-1.5">
              <Clock className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Avg. Response</span>
          </div>
          <p className="text-xl font-bold text-white">
            {chatter.avgResponseTime.toFixed(1)}m
          </p>
        </div>

        <div className="rounded-lg border border-slate-800/50 bg-slate-800/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-md bg-amber-500/10 p-1.5">
              <Award className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Conversion</span>
          </div>
          <p className="text-xl font-bold text-white">
            {chatter.conversionRate}%
          </p>
        </div>
      </div>

      {/* Performance bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Performance Score</span>
          <span className="font-semibold text-white">{chatter.performanceScore}/100</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${chatter.performanceScore}%` }}
          />
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        <div className={`h-2 w-2 rounded-full ${chatter.status === "active" ? "bg-green-400" : "bg-slate-600"}`} />
        <span className="text-slate-400 capitalize">{chatter.status}</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">{chatter.hoursWorked}h this week</span>
      </div>
    </div>
  );
}
