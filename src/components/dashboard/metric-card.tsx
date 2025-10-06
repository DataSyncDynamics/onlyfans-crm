"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon?: LucideIcon;
  sparklineData?: number[];
  variant?: "default" | "large";
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  sparklineData = [],
  variant = "default",
}: MetricCardProps) {
  const isPositive = trend === "up";

  // Generate SVG path for sparkline
  const generateSparklinePath = (data: number[]) => {
    if (data.length === 0) return "";

    const width = 100;
    const height = 40;
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
    <Card
      className={`
        group relative overflow-hidden border-slate-800/50
        bg-gradient-to-br from-slate-900/50 to-slate-900/30
        backdrop-blur-xl transition-all duration-300
        hover:border-slate-700/50 hover:shadow-lg hover:shadow-purple-500/10
        hover:scale-[1.02]
        ${variant === "large" ? "col-span-2" : ""}
      `}
    >
      {/* Gradient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">
          {title}
        </CardTitle>
        {Icon && (
          <div className="rounded-full bg-purple-500/10 p-2">
            <Icon className="h-4 w-4 text-purple-400" />
          </div>
        )}
      </CardHeader>

      <CardContent className="relative">
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <div className={`font-bold text-white ${variant === "large" ? "text-4xl" : "text-2xl"}`}>
              {value}
            </div>
            <div className="mt-1 flex items-center text-xs">
              {isPositive ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-400" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-400" />
              )}
              <span className={isPositive ? "text-green-400" : "text-red-400"}>
                {change}
              </span>
              <span className="ml-1 text-slate-500">vs last period</span>
            </div>
          </div>

          {/* Sparkline */}
          {sparklineData.length > 0 && (
            <div className="ml-4">
              <svg width="100" height="40" className="overflow-visible">
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={generateSparklinePath(sparklineData)}
                  fill="none"
                  stroke={isPositive ? "#10b981" : "#ef4444"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={`${generateSparklinePath(sparklineData)} L 100,40 L 0,40 Z`}
                  fill={`url(#gradient-${title})`}
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
