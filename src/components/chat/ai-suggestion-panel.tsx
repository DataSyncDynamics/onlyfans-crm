"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AISuggestion, Fan, AIGenerationResponse } from "@/types";
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
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { haptics } from "@/lib/utils/haptics";

interface AISuggestionPanelProps {
  conversationId: string;
  onUseSuggestion?: (message: string) => void;
}

export function AISuggestionPanel({ conversationId, onUseSuggestion }: AISuggestionPanelProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIGenerationResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showMockSuggestions, setShowMockSuggestions] = useState(true);

  const suggestions = getSuggestionsByConversation(conversationId);
  const templates = getTemplatesByCategory("ppv_pitch").slice(0, 3);

  // Get conversation details to extract fan info
  const conversation = getConversationById(conversationId);
  const fan = conversation ? getFanById(conversation.fanId) : null;

  // Auto-generate AI response on conversation change
  useEffect(() => {
    if (conversation && fan) {
      generateAIResponse();
    }
  }, [conversationId]);

  const generateAIResponse = async (category?: string, ppvPrice?: number) => {
    if (!conversation || !fan) return;

    setAiGenerating(true);
    setAiError(null);

    try {
      // Get last message from fan (incoming message)
      const lastFanMessage = conversation.messages
        .filter(msg => msg.sentBy === 'fan')
        .slice(-1)[0];

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fanId: fan.id,
          creatorId: 'creator_1', // TODO: Get from auth context
          incomingMessage: lastFanMessage?.content,
          templateCategory: category,
          ppvPrice,
          forceTemplate: false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResponse(data.data);
        setShowMockSuggestions(false);
      } else {
        setAiError(data.error || 'Failed to generate AI response');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setAiError('Failed to connect to AI service');
    } finally {
      setAiGenerating(false);
    }
  };

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
    haptics.success();
    onUseSuggestion?.(message);
    setSelectedSuggestion(null);
  };

  const handleCopySuggestion = async (message: string) => {
    haptics.tap();
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

        {/* Generate AI Response Button */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateAIResponse()}
              disabled={aiGenerating}
              className="border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
            >
              {aiGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">{aiGenerating ? 'Generating...' : 'Regenerate'}</span>
            </Button>
          </div>

          {/* AI Error */}
          {aiError && (
            <Card className="border-red-500/50 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-400">AI Generation Failed</p>
                  <p className="text-xs text-red-300 mt-1">{aiError}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateAIResponse()}
                    className="mt-3 border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* AI Loading State */}
          {aiGenerating && !aiError && (
            <Card className="border-slate-800/50 bg-slate-900/50 p-6 text-center">
              <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-purple-400" />
              <p className="text-sm text-slate-400">AI is crafting the perfect response...</p>
              <p className="text-xs text-slate-500 mt-1">Analyzing conversation context</p>
            </Card>
          )}

          {/* AI Generated Response */}
          {aiResponse && !aiGenerating && (
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4">
              <div className="space-y-3">
                {/* Response Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-purple-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-purple-400">
                        AI Generated
                      </p>
                      {aiResponse.detectedIntent && (
                        <p className="text-xs text-slate-400">
                          {aiResponse.detectedIntent.replace('_', ' ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={getConfidenceBadgeVariant(Math.round(aiResponse.confidence * 100))}>
                    {Math.round(aiResponse.confidence * 100)}%
                  </Badge>
                </div>

                {/* Generated Message */}
                <div className="rounded-lg bg-slate-900/50 p-3 border border-purple-500/20">
                  <p className="text-sm leading-relaxed text-slate-100">
                    {aiResponse.messageText}
                  </p>
                </div>

                {/* PPV Price if suggested */}
                {aiResponse.suggestedPpvPrice && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-semibold">
                      Suggested Price: ${aiResponse.suggestedPpvPrice}
                    </span>
                  </div>
                )}

                {/* Approval Status */}
                {aiResponse.requiresApproval ? (
                  <div className="flex items-start gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 p-3">
                    <AlertCircle className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-orange-400">Requires Approval</p>
                      <p className="text-xs text-orange-300 mt-0.5">
                        This message needs manager review before sending
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-green-400">Auto-Send Eligible</p>
                      <p className="text-xs text-green-300 mt-0.5">
                        This message can be sent automatically
                      </p>
                    </div>
                  </div>
                )}

                {/* Reasoning */}
                {aiResponse.reasoning && (
                  <div className="rounded-lg bg-slate-800/50 p-3 border border-slate-700/50">
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-purple-400">AI Reasoning: </span>
                      {aiResponse.reasoning}
                    </p>
                  </div>
                )}

                {/* Template Used */}
                {aiResponse.templateId && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MessageSquare className="h-3 w-3" />
                    <span>Template: {aiResponse.templateId}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleUseSuggestion(aiResponse.messageText)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Use This Response
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopySuggestion(aiResponse.messageText)}
                    className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Category Quick Actions */}
          {!aiGenerating && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400">Quick Generate</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    haptics.button();
                    generateAIResponse('greeting');
                  }}
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white min-h-[44px]"
                >
                  <Heart className="mr-2 h-3 w-3" />
                  Greeting
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    haptics.button();
                    generateAIResponse('ppv_offer', 25);
                  }}
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white min-h-[44px]"
                >
                  <DollarSign className="mr-2 h-3 w-3" />
                  PPV $25
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    haptics.button();
                    generateAIResponse('response');
                  }}
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white min-h-[44px]"
                >
                  <MessageSquare className="mr-2 h-3 w-3" />
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    haptics.button();
                    generateAIResponse('upsell', 50);
                  }}
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white min-h-[44px]"
                >
                  <TrendingUp className="mr-2 h-3 w-3" />
                  Upsell
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mock Suggestions (Optional Fallback) */}
        {showMockSuggestions && suggestions.length > 0 && !aiResponse && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Fallback Suggestions</h3>
            {suggestions.slice(0, 2).map((suggestion) => (
              <Card
                key={suggestion.id}
                className="group cursor-pointer border-slate-800/50 bg-slate-900/30 p-3 transition-all hover:border-blue-500/30 hover:bg-slate-900/50"
                onClick={() => handleUseSuggestion(suggestion.message)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      {suggestion.type}
                    </p>
                    <Badge variant={getConfidenceBadgeVariant(suggestion.confidence)} className="text-xs">
                      {suggestion.confidence}%
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {suggestion.message}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

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
