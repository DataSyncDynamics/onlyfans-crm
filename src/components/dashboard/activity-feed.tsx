"use client";

import { Transaction } from "@/types";
import { DollarSign, Zap, Image, MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  transactions: Transaction[];
  limit?: number;
}

const typeIcons = {
  subscription: Clock,
  tip: DollarSign,
  ppv: Image,
  message: MessageSquare,
};

const typeColors = {
  subscription: "text-blue-400 bg-blue-500/10",
  tip: "text-green-400 bg-green-500/10",
  ppv: "text-purple-400 bg-purple-500/10",
  message: "text-pink-400 bg-pink-500/10",
};

const typeLabels = {
  subscription: "Subscription",
  tip: "Tip",
  ppv: "PPV Purchase",
  message: "Message Unlock",
};

export function ActivityFeed({ transactions, limit = 20 }: ActivityFeedProps) {
  const displayTransactions = transactions.slice(0, limit);

  return (
    <div className="space-y-1">
      <div className="max-h-[500px] space-y-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-800/30 scrollbar-thumb-slate-700/50">
        {displayTransactions.map((transaction) => {
          const Icon = typeIcons[transaction.type];
          const colorClass = typeColors[transaction.type];
          const label = typeLabels[transaction.type];

          return (
            <div
              key={transaction.id}
              className="group flex items-center gap-3 rounded-lg border border-slate-800/30 bg-slate-900/20 p-3 transition-all hover:border-slate-700/50 hover:bg-slate-800/30"
            >
              {/* Icon */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {label}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {transaction.description || `Transaction ${transaction.id.slice(0, 8)}`}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-green-400">
                      +${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          );
        })}
      </div>

      {transactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Zap className="mb-3 h-12 w-12 text-slate-600" />
          <p className="text-sm font-medium text-slate-400">No recent activity</p>
          <p className="text-xs text-slate-500">Transactions will appear here</p>
        </div>
      )}
    </div>
  );
}
