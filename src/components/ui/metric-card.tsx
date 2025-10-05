"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { LineChart, Line, ResponsiveContainer } from "recharts"

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down"
  icon?: LucideIcon
  sparklineData?: number[]
  loading?: boolean
  prefix?: string
  suffix?: string
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  sparklineData,
  loading = false,
  prefix = "",
  suffix = "",
  className,
  ...props
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = React.useState(0)
  const isPositive = trend === "up" || (change !== undefined && change >= 0)

  // Animated counter effect
  React.useEffect(() => {
    if (typeof value === "number" && !loading) {
      const duration = 1000 // 1 second
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)

      return () => {
        clearInterval(timer)
      }
    } else if (typeof value === "number") {
      setDisplayValue(value)
    }
    return undefined
  }, [value, loading])

  // Format sparkline data for Recharts
  const chartData = React.useMemo(
    () =>
      sparklineData?.map((value, index) => ({
        index,
        value,
      })) || [],
    [sparklineData]
  )

  if (loading) {
    return (
      <div
        className={cn(
          "glass-hover rounded-lg border border-border p-6 shadow-subtle",
          className
        )}
        {...props}
      >
        <div className="space-y-3">
          <div className="h-4 w-24 skeleton rounded" />
          <div className="h-8 w-32 skeleton rounded" />
          <div className="h-12 skeleton rounded" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "glass-hover rounded-lg border border-border p-6 shadow-subtle slide-up",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          {/* Value with animated counter */}
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-white">
              {prefix}
              {typeof value === "number" ? displayValue.toLocaleString() : value}
              {suffix}
            </h3>

            {/* Change indicator */}
            {change !== undefined && !isNaN(change) && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-smooth",
                  isPositive ? "text-emerald-500" : "text-red-500"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {Math.abs(change).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Icon */}
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Sparkline chart */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-4 h-12 w-full fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export { MetricCard }
