"use client";

import { useState } from "react";
import { Plus, X, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Variant {
  id: string;
  name: string;
  message: string;
  mediaUrls: string[];
  trafficSplit: number;
}

interface ABTestConfiguratorProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
}

export function ABTestConfigurator({
  enabled,
  onEnabledChange,
  variants,
  onVariantsChange,
}: ABTestConfiguratorProps) {
  const handleAddVariant = () => {
    const newVariant: Variant = {
      id: `variant_${Date.now()}`,
      name: `Variant ${String.fromCharCode(65 + variants.length)}`,
      message: "",
      mediaUrls: [],
      trafficSplit: Math.floor(100 / (variants.length + 1)),
    };

    // Recalculate traffic splits
    const totalVariants = variants.length + 1;
    const baseSplit = Math.floor(100 / totalVariants);
    const remainder = 100 - baseSplit * totalVariants;

    const updatedVariants = [
      ...variants.map((v, i) => ({
        ...v,
        trafficSplit: baseSplit + (i === totalVariants - 1 ? remainder : 0),
      })),
      { ...newVariant, trafficSplit: baseSplit },
    ];

    onVariantsChange(updatedVariants);
  };

  const handleRemoveVariant = (id: string) => {
    const filtered = variants.filter((v) => v.id !== id);

    // Recalculate splits
    if (filtered.length > 0) {
      const baseSplit = Math.floor(100 / filtered.length);
      const remainder = 100 - baseSplit * filtered.length;
      const updatedVariants = filtered.map((v, i) => ({
        ...v,
        trafficSplit: baseSplit + (i === filtered.length - 1 ? remainder : 0),
      }));
      onVariantsChange(updatedVariants);
    } else {
      onVariantsChange([]);
      onEnabledChange(false);
    }
  };

  const handleVariantChange = (id: string, field: keyof Variant, value: any) => {
    const updated = variants.map((v) =>
      v.id === id ? { ...v, [field]: value } : v
    );
    onVariantsChange(updated);
  };

  const handleSplitChange = (id: string, newSplit: number) => {
    const index = variants.findIndex((v) => v.id === id);
    if (index === -1) return;

    const updated = [...variants];
    const oldSplit = updated[index].trafficSplit;
    const diff = newSplit - oldSplit;

    // Adjust this variant
    updated[index].trafficSplit = newSplit;

    // Distribute diff to other variants
    const others = updated.filter((_, i) => i !== index);
    const diffPerOther = -diff / others.length;

    updated.forEach((v, i) => {
      if (i !== index) {
        v.trafficSplit = Math.max(0, Math.round(v.trafficSplit + diffPerOther));
      }
    });

    // Ensure total is 100%
    const total = updated.reduce((sum, v) => sum + v.trafficSplit, 0);
    if (total !== 100) {
      updated[updated.length - 1].trafficSplit += 100 - total;
    }

    onVariantsChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Enable A/B Testing Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <FlaskConical className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <Label className="text-sm font-medium text-white">
              Enable A/B Testing
            </Label>
            <p className="text-xs text-slate-400 mt-1">
              Test different messages to optimize performance
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const newEnabled = !enabled;
            onEnabledChange(newEnabled);
            if (newEnabled && variants.length === 0) {
              // Initialize with 2 variants
              onVariantsChange([
                {
                  id: "variant_a",
                  name: "Variant A",
                  message: "",
                  mediaUrls: [],
                  trafficSplit: 50,
                },
                {
                  id: "variant_b",
                  name: "Variant B",
                  message: "",
                  mediaUrls: [],
                  trafficSplit: 50,
                },
              ]);
            }
          }}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${enabled ? "bg-blue-500" : "bg-slate-700"}
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

      {/* Variants Configuration */}
      {enabled && (
        <div className="space-y-4 p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Message Variants</h4>
              <p className="text-xs text-slate-400 mt-1">
                Create up to 5 variants to test
              </p>
            </div>
            {variants.length < 5 && (
              <Button
                size="sm"
                onClick={handleAddVariant}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variant
              </Button>
            )}
          </div>

          {/* Variants List */}
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 space-y-3"
              >
                {/* Variant Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {String.fromCharCode(65 + index)}
                    </Badge>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) =>
                        handleVariantChange(variant.id, "name", e.target.value)
                      }
                      className="bg-transparent text-sm font-medium text-white border-none outline-none focus:ring-0 w-32"
                      placeholder="Variant name"
                    />
                  </div>
                  {variants.length > 2 && (
                    <button
                      onClick={() => handleRemoveVariant(variant.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Message Input */}
                <div>
                  <Label className="text-xs text-slate-400 mb-2 block">
                    Message
                  </Label>
                  <textarea
                    value={variant.message}
                    onChange={(e) =>
                      handleVariantChange(variant.id, "message", e.target.value)
                    }
                    placeholder="Write your message variant..."
                    className="w-full min-h-[80px] p-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Traffic Split Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-slate-400">
                      Traffic Split
                    </Label>
                    <span className="text-sm font-medium text-white">
                      {variant.trafficSplit}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={variant.trafficSplit}
                    onChange={(e) =>
                      handleSplitChange(variant.id, parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${variant.trafficSplit}%, rgb(51 65 85) ${variant.trafficSplit}%, rgb(51 65 85) 100%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Traffic Split Summary */}
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Traffic Distribution</span>
              <span className="text-white font-medium">
                {variants.reduce((sum, v) => sum + v.trafficSplit, 0)}%
              </span>
            </div>
            <div className="mt-2 flex gap-1 h-2 rounded-full overflow-hidden">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="bg-blue-500"
                  style={{ width: `${variant.trafficSplit}%` }}
                  title={`${variant.name}: ${variant.trafficSplit}%`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400">
              <strong>How it works:</strong> VaultCRM will automatically send each
              variant to a portion of your audience, track performance, and
              declare a winner after 2 hours based on open rates and revenue.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
