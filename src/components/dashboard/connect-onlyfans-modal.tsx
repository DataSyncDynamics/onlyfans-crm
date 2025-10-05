"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Shield, Zap, Lock } from "lucide-react";

interface ConnectOnlyFansModalProps {
  open: boolean;
  onClose: () => void;
  creatorId: string;
  ofUsername: string;
}

export function ConnectOnlyFansModal({
  open,
  onClose,
  creatorId,
  ofUsername,
}: ConnectOnlyFansModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      // Get OAuth authorization URL
      const response = await fetch(`/api/creators/${creatorId}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ofUsername }),
      });

      const data = await response.json();

      if (data.authUrl) {
        // Redirect to OnlyFans OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error("Failed to get authorization URL");
      }
    } catch (error) {
      console.error("Connection failed:", error);
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-400" />
            Connect to OnlyFans
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Connect {ofUsername} to sync revenue data and metrics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Benefits Section */}
          <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              What you'll get:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Real-time Revenue Data</p>
                  <p className="text-sm text-slate-400">
                    Automatically sync subscriptions, tips, PPV sales, and messages
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Subscriber Analytics</p>
                  <p className="text-sm text-slate-400">
                    Track fan engagement, spending tiers, and churn risk
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Performance Metrics</p>
                  <p className="text-sm text-slate-400">
                    Revenue trends, conversion rates, and chatter performance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Automatic Updates</p>
                  <p className="text-sm text-slate-400">
                    Data syncs every 15 minutes - always up to date
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-300">
                  Secure & Private
                </p>
                <p className="text-xs text-purple-400/80 mt-1">
                  Your OnlyFans credentials are encrypted and stored securely. We only access data you authorize and never share it with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">How it works:</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-xs font-bold text-purple-400">
                    1
                  </div>
                  <h5 className="text-sm font-medium text-white">Authorize</h5>
                </div>
                <p className="text-xs text-slate-400">
                  Log in to OnlyFans and grant read-only access
                </p>
              </div>

              <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-xs font-bold text-purple-400">
                    2
                  </div>
                  <h5 className="text-sm font-medium text-white">Initial Sync</h5>
                </div>
                <p className="text-xs text-slate-400">
                  We'll pull your last 90 days of data
                </p>
              </div>

              <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-xs font-bold text-purple-400">
                    3
                  </div>
                  <h5 className="text-sm font-medium text-white">Auto-Update</h5>
                </div>
                <p className="text-xs text-slate-400">
                  Your CRM stays synced automatically
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isConnecting}
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isConnecting ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-pulse" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect OnlyFans Account
                </>
              )}
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-slate-500 text-center">
            You can disconnect at any time from creator settings
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
