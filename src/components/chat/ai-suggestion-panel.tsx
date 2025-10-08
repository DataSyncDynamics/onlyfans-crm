"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AISuggestion, Fan } from "@/types";
import {
  getSuggestionsByConversation,
  getTemplatesByCategory,
  getFanById,
  getConversationById
} from "@/lib/mock-data";
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Send,
  Copy,
  Heart,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AISuggestionPanelProps {
  conversationId: string;
  onUseSuggestion?: (message: string) => void;
}

export function AISuggestionPanel({ conversationId, onUseSuggestion }: AISuggestionPanelProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const suggestions = getSuggestionsByConversation(conversationId);
  const templates = getTemplatesByCategory("ppv_pitch").slice(0, 3);

  // Get conversation details to extract fan info
  const conversation = getConversationById(conversationId);
  const fan = conversation ? getFanById(conversation.fanId) : null;

  if (!conversation || !fan) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-slate-500">Select a conversation to see AI suggestions</p>
      </div>
    );
  }

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 80) return "default";
    if (confidence >= 60) return "secondary";
    return "outline";
  };

  const getTierBadgeVariant = (tier: Fan['tier']) => {
    switch (tier) {
      case "whale":
        return "default";
      case "high":
        return "info";
      case "medium":
        return "success";
      case "low":
        return "outline";
    }
  };

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case "upsell":
        return <TrendingUp className="h-4 w-4" />;
      case "ppv":
        return <DollarSign className="h-4 w-4" />;
      case "engagement":
        return <Heart className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const handleUseSuggestion = (message: string) => {
    onUseSuggestion?.(message);
    setSelectedSuggestion(null);
  };

  const handleCopySuggestion = async (message: string) => {
    await navigator.clipboard.writeText(message);
    // Show toast notification
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Fan Context Card */}
        <Card className="border-slate-800/50 bg-slate-900/50 p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{fan.displayName || fan.username}</h3>
                  <Badge variant={getTierBadgeVariant(fan.tier)} className="uppercase">
                    {fan.tier}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-400">@{fan.username}</p>
              </div>
            </div>

            {/* LTV & Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-800/50 p-3">
                <p className="text-xs text-slate-400">Lifetime Value</p>
                <p className="mt-1 text-lg font-bold text-green-400">
                  ${fan.totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-3">
                <p className="text-xs text-slate-400">Messages</p>
                <p className="mt-1 text-lg font-bold text-blue-400">
                  {fan.messageCount}
                </p>
              </div>
            </div>

            {/* Engagement Level */}
            {conversation.aiContext && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs text-slate-400">Engagement Level</p>
                  <p className="text-xs font-semibold text-purple-400">
                    {conversation.aiContext.engagementLevel}%
                  </p>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${conversation.aiContext.engagementLevel}%` }}
                  />
                </div>
              </div>
            )}

            {/* Recent Purchases */}
            {conversation.aiContext?.recentPurchases && conversation.aiContext.recentPurchases.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-slate-400">Recent Purchases</p>
                <div className="flex flex-wrap gap-1.5">
                  {conversation.aiContext.recentPurchases.map((purchase, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400"
                    >
                      {purchase}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* AI Suggestions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">AI Suggestions</h3>

          {suggestions.length === 0 ? (
            <Card className="border-slate-800/50 bg-slate-900/30 p-6 text-center">
              <Sparkles className="mx-auto mb-2 h-8 w-8 text-slate-600" />
              <p className="text-sm text-slate-500">No suggestions available</p>
            </Card>
          ) : (
            suggestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className={cn(
                  "group cursor-pointer border-slate-800/50 bg-slate-900/50 p-4 transition-all hover:border-purple-500/30 hover:bg-slate-900/80",
                  selectedSuggestion === suggestion.id && "border-purple-500/50 bg-slate-900/80"
                )}
                onClick={() => setSelectedSuggestion(suggestion.id)}
              >
                <div className="space-y-3">
                  {/* Suggestion Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          {suggestion.type}
                        </p>
                        {suggestion.suggestedPrice && (
                          <p className="text-xs text-green-400">
                            ${suggestion.suggestedPrice}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={getConfidenceBadgeVariant(suggestion.confidence)}>
                      {suggestion.confidence}%
                    </Badge>
                  </div>

                  {/* Suggestion Message */}
                  <p className="text-sm leading-relaxed text-slate-200">
                    {suggestion.message}
                  </p>

                  {/* Reasoning */}
                  <div className="rounded-lg bg-slate-800/30 p-2">
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-purple-400">Why: </span>
                      {suggestion.reasoning}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseSuggestion(suggestion.message);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Use This Response
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySuggestion(suggestion.message);
                      }}
                      className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Quick Templates */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Quick Templates</h3>

          {templates.map((template) => (
            <Card
              key={template.id}
              className="group cursor-pointer border-slate-800/50 bg-slate-900/30 p-3 transition-all hover:border-blue-500/30 hover:bg-slate-900/50"
              onClick={() => handleUseSuggestion(template.message)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{template.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="text-xs">
                      {template.avgConversionRate}% CR
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
                <p className="line-clamp-2 text-xs text-slate-400">
                  {template.message}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{template.usageCount} uses</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
