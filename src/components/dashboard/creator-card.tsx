"use client";

import { Creator } from "@/types";
import { ArrowUpRight, TrendingUp, Users, DollarSign } from "lucide-react";
import { useState } from "react";

interface CreatorCardProps {
  creator: Creator;
  revenueData?: number[]; // 7-day revenue sparkline data
  onClick?: () => void;
}

export function CreatorCard({ creator, revenueData = [], onClick }: CreatorCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate trend from sparkline data
  const firstValue = revenueData[0] || 0;
  const lastValue = revenueData[revenueData.length - 1] || 0;
  const trend = revenueData.length >= 2 && firstValue !== 0
    ? ((lastValue - firstValue) / firstValue * 100)
    : 0;

  const conversionRate = creator.totalFans > 0
    ? ((creator.activeFans / creator.totalFans) * 100).toFixed(1)
    : "0.0";

  // Generate SVG path for sparkline
  const generateSparklinePath = (data: number[]) => {
    if (data.length === 0) return "";

    const width = 80;
    const height = 30;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative w-full rounded-xl border border-slate-800/50
        bg-gradient-to-br from-slate-900/50 to-slate-900/30
        backdrop-blur-xl p-6 text-left transition-all duration-300
        hover:border-slate-700/50 hover:shadow-lg hover:shadow-purple-500/10
        ${isHovered ? "scale-[1.02]" : "scale-100"}
      `}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <span className="text-lg font-bold text-white">
                {creator.displayName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{creator.displayName}</h3>
              <p className="text-sm text-slate-400">{creator.ofUsername}</p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Stats Grid */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-900/50 p-3 ring-1 ring-slate-800/50">
            <div className="mb-1 flex items-center gap-1 text-xs text-slate-400">
              <DollarSign className="h-3 w-3" />
              <span>Revenue</span>
            </div>
            <p className="text-base font-bold text-emerald-400">
              ${(creator.totalRevenue / 1000).toFixed(0)}k
            </p>
          </div>

          <div className="rounded-lg bg-slate-900/50 p-3 ring-1 ring-slate-800/50">
            <div className="mb-1 flex items-center gap-1 text-xs text-slate-400">
              <Users className="h-3 w-3" />
              <span>Fans</span>
            </div>
            <p className="text-base font-bold text-white">
              {creator.activeFans}
            </p>
          </div>

          <div className="rounded-lg bg-slate-900/50 p-3 ring-1 ring-slate-800/50">
            <div className="mb-1 flex items-center gap-1 text-xs text-slate-400">
              <TrendingUp className="h-3 w-3" />
              <span>Conv.</span>
            </div>
            <p className="text-base font-bold text-white">
              {conversionRate}%
            </p>
          </div>
        </div>

        {/* Sparkline */}
        {revenueData.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="80" height="30" className="overflow-visible">
                <defs>
                  <linearGradient id={`gradient-${creator.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={generateSparklinePath(revenueData)}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={`${generateSparklinePath(revenueData)} L 80,30 L 0,30 Z`}
                  fill={`url(#gradient-${creator.id})`}
                />
              </svg>
              <div className="text-xs">
                <p className="text-slate-400">7-day trend</p>
                <p className={`font-semibold ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {creator.tags && creator.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {creator.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
