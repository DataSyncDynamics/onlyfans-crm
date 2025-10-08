"use client";

import { useState } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface PPVPricingSelectorProps {
  value: number;
  onChange: (value: number) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

const QUICK_PRICES = [15, 25, 35, 50, 100];

const PRICE_RECOMMENDATIONS = {
  15: { label: "Entry Level", conversion: "High", avgPurchaseRate: 45 },
  25: { label: "Standard", conversion: "Good", avgPurchaseRate: 35 },
  35: { label: "Premium", conversion: "Medium", avgPurchaseRate: 25 },
  50: { label: "Exclusive", conversion: "Low", avgPurchaseRate: 18 },
  100: { label: "VIP Only", conversion: "Very Low", avgPurchaseRate: 8 },
};

export function PPVPricingSelector({
  value,
  onChange,
  enabled,
  onEnabledChange,
}: PPVPricingSelectorProps) {
  const handleQuickPrice = (price: number) => {
    onChange(price);
    if (!enabled) {
      onEnabledChange(true);
    }
  };

  const recommendation =
    PRICE_RECOMMENDATIONS[value as keyof typeof PRICE_RECOMMENDATIONS] ||
    PRICE_RECOMMENDATIONS[35];

  return (
    <div className="space-y-4">
      {/* Enable PPV Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/30">
        <div>
          <Label className="text-sm font-medium text-white">
            Enable Pay-Per-View
          </Label>
          <p className="text-xs text-slate-400 mt-1">
            Require payment to unlock this message
          </p>
        </div>
        <button
          onClick={() => onEnabledChange(!enabled)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${enabled ? "bg-purple-500" : "bg-slate-700"}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${enabled ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>
      </div>

      {/* PPV Configuration */}
      {enabled && (
        <div className="space-y-4 p-4 rounded-lg border border-purple-500/30 bg-purple-500/5">
          {/* Quick Price Buttons */}
          <div>
            <Label className="text-sm font-medium text-white mb-3 block">
              Quick Select
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {QUICK_PRICES.map((price) => (
                <button
                  key={price}
                  onClick={() => handleQuickPrice(price)}
                  className={`
                    relative py-3 rounded-lg font-semibold text-sm transition-all
                    ${
                      value === price
                        ? "bg-purple-500 text-white shadow-lg scale-105"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    }
                  `}
                >
                  ${price}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Price Input */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Custom Price
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                min={5}
                max={500}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter custom price"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Price range: $5 - $500
            </p>
          </div>

          {/* Price Recommendation */}
          {value >= 5 && value <= 500 && (
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">
                      {recommendation.label} Pricing
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        recommendation.conversion === "High"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : recommendation.conversion === "Good"
                          ? "bg-blue-500/20 text-blue-400"
                          : recommendation.conversion === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {recommendation.conversion} Conversion
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Avg. purchase rate: ~{recommendation.avgPurchaseRate}% of
                    recipients
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Estimate */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">
                Estimated Revenue
              </span>
              <span className="text-xs text-slate-400">
                Based on {recommendation.avgPurchaseRate}% conversion
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              ${Math.round(value * recommendation.avgPurchaseRate * 0.1 * 387).toLocaleString()} - $
              {Math.round(value * recommendation.avgPurchaseRate * 0.15 * 387).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              From 387 targeted fans at ${value}/message
            </p>
          </div>

          {/* Tips */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400">
              <strong>Pro Tip:</strong> $25-$35 is the sweet spot for most
              creators. Higher prices work best for exclusive or custom content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
