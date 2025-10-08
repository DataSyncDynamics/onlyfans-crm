"use client";

import { ContentAnalytics, ContentItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Image,
  Video,
  FolderOpen,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PPVAnalyticsDashboardProps {
  analytics: ContentAnalytics;
  className?: string;
}

export function PPVAnalyticsDashboard({
  analytics,
  className,
}: PPVAnalyticsDashboardProps) {
  const avgPrice =
    analytics.ppvItems > 0
      ? analytics.ppvRevenue / (analytics.topPerformingItems.filter((i) => i.isPPV).reduce((sum, i) => sum + (i.ppvPurchases || 0), 0) || 1)
      : 0;

  const totalPurchases = analytics.topPerformingItems
    .filter((i) => i.isPPV)
    .reduce((sum, item) => sum + (item.ppvPurchases || 0), 0);

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'photo':
        return <Image className="h-3.5 w-3.5" />;
      case 'video':
        return <Video className="h-3.5 w-3.5" />;
      case 'photoset':
        return <FolderOpen className="h-3.5 w-3.5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const maxRevenue = Math.max(
    ...analytics.revenueByMonth.map((m) => m.revenue),
    1
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-emerald-400/80 mb-1">Total PPV Revenue</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(analytics.ppvRevenue)}
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </Card>

        {/* Total Purchases */}
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-purple-400/80 mb-1">Total Purchases</div>
              <div className="text-2xl font-bold text-white">
                {totalPurchases.toLocaleString()}
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
              <ShoppingCart className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>

        {/* Average Price */}
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-blue-400/80 mb-1">Avg. Price</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(avgPrice)}
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        {/* PPV Items */}
        <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-pink-400/80 mb-1">PPV Items</div>
              <div className="text-2xl font-bold text-white">
                {analytics.ppvItems}
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10 ring-1 ring-pink-500/20">
              <BarChart3 className="h-6 w-6 text-pink-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue by Month Chart */}
      <Card className="p-6 bg-slate-900/50 border-slate-800/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Revenue by Month</h3>
            <p className="text-sm text-slate-400">Last 6 months</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="h-3 w-3 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
            PPV Revenue
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-3">
          {analytics.revenueByMonth.map((month, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-medium">{month.month}</span>
                <span className="text-white font-semibold">
                  {formatCurrency(month.revenue)}
                </span>
              </div>
              <div className="relative h-8 bg-slate-800/50 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition-all duration-500"
                  style={{
                    width: `${(month.revenue / maxRevenue) * 100}%`,
                  }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-medium text-white/80">
                    {((month.revenue / maxRevenue) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Performing Content */}
      <Card className="p-6 bg-slate-900/50 border-slate-800/50">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Top Performing PPV Content</h3>
          <p className="text-sm text-slate-400">Sorted by revenue</p>
        </div>

        <div className="space-y-3">
          {analytics.topPerformingItems
            .filter((item) => item.isPPV)
            .slice(0, 5)
            .map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-800/50 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                {/* Rank */}
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-slate-800/50 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-white truncate">
                      {item.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs flex items-center gap-1 flex-shrink-0",
                        item.type === 'photo' && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                        item.type === 'video' && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                        item.type === 'photoset' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      )}
                    >
                      {getTypeIcon(item.type)}
                      <span className="capitalize">{item.type}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      <span>{item.ppvPurchases || 0} purchases</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${item.ppvPrice?.toFixed(2)} each</span>
                    </div>
                  </div>
                </div>

                {/* Revenue */}
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">
                    {formatCurrency(item.ppvRevenue || 0)}
                  </div>
                  <div className="text-xs text-slate-500">revenue</div>
                </div>
              </div>
            ))}

          {analytics.topPerformingItems.filter((item) => item.isPPV).length === 0 && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/50">
                  <DollarSign className="h-6 w-6 text-slate-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500">No PPV content yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
