"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeywordAlert } from "@/types";
import {
  getConversationById,
  getKeywordAlert
} from "@/lib/mock-data";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Copy,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KeywordDetectorProps {
  conversationId: string;
  onUseSuggestion?: (message: string) => void;
}

export function KeywordDetector({ conversationId, onUseSuggestion }: KeywordDetectorProps) {
  const conversation = getConversationById(conversationId);

  if (!conversation) {
    return null;
  }

  // Detect keywords from recent messages
  const detectedKeywords = new Set<string>();
  conversation.messages.forEach((message) => {
    if (message.detectedKeywords) {
      message.detectedKeywords.forEach((keyword) => {
        detectedKeywords.add(keyword);
      });
    }
  });

  // Get alerts for detected keywords
  const activeAlerts = Array.from(detectedKeywords)
    .map((keyword) => getKeywordAlert(keyword))
    .filter((alert): alert is KeywordAlert => alert !== undefined)
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

  if (activeAlerts.length === 0) {
    return null;
  }

  const getSeverityIcon = (severity: KeywordAlert['severity']) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "high":
        return <AlertCircle className="h-4 w-4" />;
      case "medium":
        return <Info className="h-4 w-4" />;
      case "low":
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getSeverityStyles = (severity: KeywordAlert['severity']) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          badge: "bg-red-500/20 text-red-400 border-red-500/30",
        };
      case "high":
        return {
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          text: "text-orange-400",
          badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        };
      case "medium":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          text: "text-yellow-400",
          badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        };
      case "low":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-400",
          badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        };
    }
  };

  const getActionLabel = (action: KeywordAlert['action']) => {
    switch (action) {
      case "flag":
        return "Review Required";
      case "auto_reply":
        return "Auto-Reply Available";
      case "notify_manager":
        return "Manager Notified";
    }
  };

  const handleUseSuggestion = (message: string) => {
    onUseSuggestion?.(message);
  };

  const handleCopySuggestion = async (message: string) => {
    await navigator.clipboard.writeText(message);
  };

  return (
    <div className="space-y-3">
      {activeAlerts.map((alert) => {
        const styles = getSeverityStyles(alert.severity);
        const icon = getSeverityIcon(alert.severity);

        return (
          <Card
            key={alert.id}
            className={cn(
              "border p-4 transition-all",
              styles.bg,
              styles.border
            )}
          >
            <div className="space-y-3">
              {/* Alert Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", styles.text)}>
                    {icon}
                  </div>
                  <div>
                    <p className={cn("text-sm font-semibold uppercase", styles.text)}>
                      Keyword Detected
                    </p>
                    <p className="text-xs text-slate-400">
                      {getActionLabel(alert.action)}
                    </p>
                  </div>
                </div>
                <Badge className={cn("border", styles.badge)}>
                  {alert.severity}
                </Badge>
              </div>

              {/* Keyword Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Keyword:</span>
                <Badge
                  className="font-mono"
                  style={{
                    backgroundColor: alert.color + "20",
                    borderColor: alert.color + "50",
                    color: alert.color,
                  }}
                >
                  &quot;{alert.keyword}&quot;
                </Badge>
              </div>

              {/* Suggested Response */}
              {alert.responseTemplate && (
                <>
                  <div className="rounded-lg bg-slate-900/50 p-3">
                    <p className="text-xs font-semibold text-slate-400 mb-2">
                      Suggested Response:
                    </p>
                    <p className="text-sm leading-relaxed text-slate-200">
                      {alert.responseTemplate}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUseSuggestion(alert.responseTemplate!)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Use Response
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopySuggestion(alert.responseTemplate!)}
                      className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
