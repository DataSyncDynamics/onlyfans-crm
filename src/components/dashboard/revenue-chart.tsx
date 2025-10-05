"use client";

import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface RevenueChartProps {
  data: { date: string; amount: number }[];
  onPeriodChange?: (period: 7 | 30 | 90) => void;
}

type Period = 7 | 30 | 90;

export function RevenueChart({ data, onPeriodChange }: RevenueChartProps) {
  const [activePeriod, setActivePeriod] = useState<Period>(30);

  const handlePeriodChange = (period: Period) => {
    setActivePeriod(period);
    onPeriodChange?.(period);
  };

  // Format data for display
  const chartData = (data || []).map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    revenue: item.amount,
  }));

  // Calculate total and average
  const total = (data || []).reduce((sum, item) => sum + item.amount, 0);
  const average = data && data.length > 0 ? total / data.length : 0;

  return (
    <div className="space-y-4">
      {/* Header with stats and period toggles */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-slate-400">Total Revenue</p>
            <p className="text-2xl font-bold text-white">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Daily Average</p>
            <p className="text-2xl font-bold text-slate-300">
              ${average.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Period toggles */}
        <div className="flex gap-2 rounded-lg bg-slate-800/50 p-1">
          {([7, 30, 90] as const).map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`
                rounded-md px-4 py-2 text-sm font-medium transition-all
                ${
                  activePeriod === period
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "text-slate-400 hover:text-white"
                }
              `}
            >
              {period}d
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg bg-slate-900/50 p-4">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
              }}
              labelStyle={{ color: "#cbd5e1" }}
              itemStyle={{ color: "#a855f7" }}
              formatter={(value: number) => [
                `$${value.toFixed(2)}`,
                "Revenue",
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
