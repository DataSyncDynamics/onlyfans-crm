"use client";

import { useState } from "react";
import { Users, TrendingUp, UserX, Clock, DollarSign, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FanSegmentationPanelProps {
  selectedCreatorIds: string[];
  onSegmentChange: (segment: any) => void;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  icon: any;
  count: number;
  estimatedRevenue: { min: number; max: number };
}

const QUICK_SEGMENTS: Segment[] = [
  {
    id: "all-whales",
    name: "All Whales",
    description: "Top spenders ($5,000+)",
    icon: TrendingUp,
    count: 45,
    estimatedRevenue: { min: 2000, max: 3500 },
  },
  {
    id: "high-spenders",
    name: "High Spenders",
    description: "$1,000 - $5,000 total spend",
    icon: DollarSign,
    count: 128,
    estimatedRevenue: { min: 3200, max: 5400 },
  },
  {
    id: "expired",
    name: "Expired Subscriptions",
    description: "Recently unsubscribed",
    icon: UserX,
    count: 234,
    estimatedRevenue: { min: 1800, max: 3200 },
  },
  {
    id: "ppv-buyers",
    name: "PPV Buyers (Last 30d)",
    description: "Purchased PPV recently",
    icon: Zap,
    count: 156,
    estimatedRevenue: { min: 4500, max: 7200 },
  },
  {
    id: "inactive",
    name: "Inactive (7+ days)",
    description: "Haven't engaged recently",
    icon: Clock,
    count: 387,
    estimatedRevenue: { min: 2800, max: 4500 },
  },
];

export function FanSegmentationPanel({
  selectedCreatorIds,
  onSegmentChange,
}: FanSegmentationPanelProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [showCustomFilters, setShowCustomFilters] = useState(false);
  const [customFilters, setCustomFilters] = useState({
    tiers: [] as string[],
    spendMin: 0,
    spendMax: 10000,
    lastActiveDays: 30,
    subscriptionStatus: [] as string[],
    hasPurchasedPPV: false,
  });

  const handleQuickSegmentClick = (segment: Segment) => {
    setSelectedSegment(segment.id);
    setShowCustomFilters(false);
    onSegmentChange({
      type: segment.id,
      count: segment.count,
      estimatedRevenue: segment.estimatedRevenue,
    });
  };

  const handleCustomFilterChange = () => {
    setSelectedSegment("custom");
    // Calculate estimated count based on filters
    const estimatedCount = 387; // This would be calculated based on actual filters
    onSegmentChange({
      type: "custom",
      filters: customFilters,
      count: estimatedCount,
      estimatedRevenue: { min: 2000, max: 4000 },
    });
  };

  const toggleTier = (tier: string) => {
    const newTiers = customFilters.tiers.includes(tier)
      ? customFilters.tiers.filter((t) => t !== tier)
      : [...customFilters.tiers, tier];
    setCustomFilters({ ...customFilters, tiers: newTiers });
  };

  const toggleSubscriptionStatus = (status: string) => {
    const newStatus = customFilters.subscriptionStatus.includes(status)
      ? customFilters.subscriptionStatus.filter((s) => s !== status)
      : [...customFilters.subscriptionStatus, status];
    setCustomFilters({ ...customFilters, subscriptionStatus: newStatus });
  };

  const totalFans = selectedSegment
    ? selectedSegment === "custom"
      ? 387
      : QUICK_SEGMENTS.find((s) => s.id === selectedSegment)?.count || 0
    : 0;

  return (
    <div className="space-y-6">
      {/* Quick Segments */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Quick Segments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_SEGMENTS.map((segment) => {
            const Icon = segment.icon;
            const isSelected = selectedSegment === segment.id;

            return (
              <button
                key={segment.id}
                onClick={() => handleQuickSegmentClick(segment)}
                className={`
                  relative group text-left p-4 rounded-lg border-2 transition-all
                  ${
                    isSelected
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? "bg-purple-500/20" : "bg-slate-700/50"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isSelected ? "text-purple-400" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {segment.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {segment.description}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                  <Badge variant="secondary" className="text-xs">
                    {segment.count} fans
                  </Badge>
                  <span className="text-xs text-emerald-400 font-medium">
                    ${segment.estimatedRevenue.min}-${segment.estimatedRevenue.max}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Filters Toggle */}
      <div>
        <Button
          variant="outline"
          onClick={() => {
            setShowCustomFilters(!showCustomFilters);
            if (!showCustomFilters) {
              setSelectedSegment("custom");
            }
          }}
          className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-800"
        >
          {showCustomFilters ? "Hide" : "Show"} Custom Filters
        </Button>
      </div>

      {/* Custom Filters */}
      {showCustomFilters && (
        <div className="space-y-4 p-4 rounded-lg border border-slate-700 bg-slate-800/30">
          {/* Fan Tiers */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Fan Tiers
            </Label>
            <div className="flex flex-wrap gap-2">
              {["Whale", "High", "Medium", "Low"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => toggleTier(tier)}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${
                      customFilters.tiers.includes(tier)
                        ? "bg-purple-500 text-white"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    }
                  `}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Spend Range */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Spend Range
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={customFilters.spendMin}
                onChange={(e) =>
                  setCustomFilters({
                    ...customFilters,
                    spendMin: parseInt(e.target.value),
                  })
                }
                className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Min"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={customFilters.spendMax}
                onChange={(e) =>
                  setCustomFilters({
                    ...customFilters,
                    spendMax: parseInt(e.target.value),
                  })
                }
                className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Last Active */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Last Active Within
            </Label>
            <select
              value={customFilters.lastActiveDays}
              onChange={(e) =>
                setCustomFilters({
                  ...customFilters,
                  lastActiveDays: parseInt(e.target.value),
                })
              }
              className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>

          {/* Subscription Status */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Subscription Status
            </Label>
            <div className="space-y-2">
              {["Active", "Expired", "Cancelled"].map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={customFilters.subscriptionStatus.includes(
                      status.toLowerCase()
                    )}
                    onCheckedChange={() =>
                      toggleSubscriptionStatus(status.toLowerCase())
                    }
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="text-sm text-slate-300 cursor-pointer"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* PPV Purchaser */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-white">
              Has Purchased PPV
            </Label>
            <button
              onClick={() =>
                setCustomFilters({
                  ...customFilters,
                  hasPurchasedPPV: !customFilters.hasPurchasedPPV,
                })
              }
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${customFilters.hasPurchasedPPV ? "bg-purple-500" : "bg-slate-700"}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${customFilters.hasPurchasedPPV ? "translate-x-6" : "translate-x-1"}
                `}
              />
            </button>
          </div>

          <Button
            onClick={handleCustomFilterChange}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Apply Custom Filters
          </Button>
        </div>
      )}

      {/* Live Preview */}
      {selectedSegment && (
        <div className="p-4 rounded-lg border-2 border-purple-500/50 bg-purple-500/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Target Audience</div>
              <div className="text-2xl font-bold text-white">{totalFans} fans</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Est. Revenue</div>
              <div className="text-lg font-semibold text-emerald-400">
                ${selectedSegment === "custom" ? "2,000" : QUICK_SEGMENTS.find((s) => s.id === selectedSegment)?.estimatedRevenue.min}-
                ${selectedSegment === "custom" ? "4,000" : QUICK_SEGMENTS.find((s) => s.id === selectedSegment)?.estimatedRevenue.max}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
