"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MetricCard } from "@/components/ui/metric-card";
import { Fan, Transaction } from "@/types";
import { TRANSACTIONS, CHATTERS, getCreatorById } from "@/lib/mock-data";
import {
  DollarSign,
  MessageSquare,
  Image as ImageIcon,
  TrendingUp,
  Edit,
  MessageCircle,
  Ban,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface FanDetailsModalProps {
  fan: Fan | null;
  open: boolean;
  onClose: () => void;
}

export function FanDetailsModal({
  fan,
  open,
  onClose,
}: FanDetailsModalProps) {

  // Calculate fan metrics
  const metrics = useMemo(() => {
    if (!fan) return null;

    // Get transactions for this fan
    const fanTransactions = TRANSACTIONS.filter(
      (t) => t.fanId === fan.id && t.status === "completed"
    );

    // Calculate spending by type
    const spendingByType = {
      subscription: 0,
      tip: 0,
      message: 0,
      ppv: 0,
    };

    fanTransactions.forEach((t) => {
      spendingByType[t.type] += t.amount;
    });

    // Calculate monthly average
    const daysSinceJoined = Math.max(
      1,
      Math.floor(
        (new Date().getTime() - fan.joinedAt.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const monthsSinceJoined = Math.max(1, daysSinceJoined / 30);
    const avgSpendPerMonth = fan.totalSpent / monthsSinceJoined;

    // Get recent transactions
    const recentTransactions = fanTransactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 15);

    return {
      spendingByType,
      avgSpendPerMonth,
      recentTransactions,
      totalTransactions: fanTransactions.length,
    };
  }, [fan]);

  if (!fan || !metrics) return null;

  const getTierBadge = (tier: Fan["tier"]) => {
    const variants = {
      whale: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      high: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      low: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    };

    const labels = {
      whale: "Whale",
      high: "High Tier",
      medium: "Medium Tier",
      low: "Low Tier",
    };

    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold",
          variants[tier]
        )}
      >
        {labels[tier]}
      </span>
    );
  };

  const getStatusBadge = (status: Fan["subscriptionStatus"]) => {
    const styles = {
      active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      expired: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium capitalize",
          styles[status]
        )}
      >
        {status}
      </span>
    );
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "subscription":
        return <Award className="h-4 w-4 text-purple-400" />;
      case "tip":
        return <DollarSign className="h-4 w-4 text-emerald-400" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case "ppv":
        return <ImageIcon className="h-4 w-4 text-pink-400" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-400" />;
    }
  };

  const creator = getCreatorById(fan.creatorId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                <span className="text-2xl font-bold text-white">
                  {fan.username.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Fan Info */}
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {fan.username}
                </DialogTitle>
                {fan.displayName && (
                  <p className="text-sm text-slate-400">{fan.displayName}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  {getTierBadge(fan.tier)}
                  {getStatusBadge(fan.subscriptionStatus)}
                </div>
              </div>
            </div>

            {/* Quick Actions - Positioned below X button */}
            <div className="flex gap-2 mt-10">
              <Button variant="outline" size="sm" className="gap-2 bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-blue-600/10 hover:bg-blue-600/20 border-blue-600/30 text-blue-400">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-red-600/10 hover:bg-red-600/20 border-red-600/30 text-red-400 hover:text-red-300">
                <Ban className="h-4 w-4" />
                Block
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Spent"
              value={`$${fan.totalSpent.toFixed(2)}`}
              icon={DollarSign}
              className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent"
            />
            <MetricCard
              title="Messages Sent"
              value={fan.messageCount.toLocaleString()}
              icon={MessageSquare}
              className="border-slate-800/50"
            />
            <MetricCard
              title="PPV Purchases"
              value={fan.ppvPurchases}
              icon={ImageIcon}
              className="border-slate-800/50"
            />
            <MetricCard
              title="Avg Spend/Month"
              value={`$${metrics.avgSpendPerMonth.toFixed(0)}`}
              icon={TrendingUp}
              className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent"
            />
          </div>

          {/* Fan Info Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Spending Breakdown */}
            <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Spending Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/10 p-2 ring-1 ring-purple-500/20">
                      <Award className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Subscriptions</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${metrics.spendingByType.subscription.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {((metrics.spendingByType.subscription / fan.totalSpent) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2 ring-1 ring-emerald-500/20">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Tips</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${metrics.spendingByType.tip.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {((metrics.spendingByType.tip / fan.totalSpent) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2 ring-1 ring-blue-500/20">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Messages</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${metrics.spendingByType.message.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {((metrics.spendingByType.message / fan.totalSpent) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-pink-500/10 p-2 ring-1 ring-pink-500/20">
                      <ImageIcon className="h-4 w-4 text-pink-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">PPV Content</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${metrics.spendingByType.ppv.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {((metrics.spendingByType.ppv / fan.totalSpent) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fan Details */}
            <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Subscribed To</p>
                  <p className="text-sm font-medium text-white">{creator?.displayName || "Unknown"}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Joined</p>
                  <p className="text-sm font-medium text-white">
                    {fan.joinedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Last Active</p>
                  <p className="text-sm font-medium text-white">
                    {formatDistanceToNow(fan.lastActiveAt, { addSuffix: true })}
                  </p>
                </div>

                {fan.subscriptionRenewsAt && fan.subscriptionStatus === "active" && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Subscription Renews</p>
                    <p className="text-sm font-medium text-white">
                      {fan.subscriptionRenewsAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {fan.riskScore !== undefined && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Churn Risk</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-800/50 overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            fan.riskScore < 30
                              ? "bg-emerald-500"
                              : fan.riskScore < 70
                              ? "bg-amber-500"
                              : "bg-red-500"
                          )}
                          style={{ width: `${fan.riskScore}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          fan.riskScore < 30
                            ? "text-emerald-400"
                            : fan.riskScore < 70
                            ? "text-amber-400"
                            : "text-red-400"
                        )}
                      >
                        {fan.riskScore}%
                      </span>
                    </div>
                  </div>
                )}

                {fan.email && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Email</p>
                    <p className="text-sm font-medium text-white break-all">{fan.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Type</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Description</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Date</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Chatter</th>
                    <th className="pb-3 text-right text-sm font-medium text-slate-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {metrics.recentTransactions.length > 0 ? (
                    metrics.recentTransactions.map((transaction) => {
                      const chatter = transaction.chatterId
                        ? CHATTERS.find((c) => c.id === transaction.chatterId)
                        : null;

                      return (
                        <tr key={transaction.id} className="group hover:bg-slate-800/20">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.type)}
                              <span className="text-sm capitalize text-slate-300">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="text-sm text-slate-400">
                              {transaction.description || "-"}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-sm text-slate-400">
                              {transaction.createdAt.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </td>
                          <td className="py-3">
                            {chatter ? (
                              <span className="text-sm text-slate-400">{chatter.name}</span>
                            ) : (
                              <span className="text-sm text-slate-600">-</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <span className="font-semibold text-emerald-400">
                              ${transaction.amount.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
