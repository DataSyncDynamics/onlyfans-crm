"use client";

import * as React from "react";
import { X, DollarSign, MessageSquare, Calendar, User } from "lucide-react";
import { Transaction, Fan, Chatter } from "@/types";
import { cn } from "@/lib/utils";

interface MessageDetailDrawerProps {
  transaction: Transaction | null;
  fan?: Fan;
  chatter?: Chatter;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageDetailDrawer({
  transaction,
  fan,
  chatter,
  isOpen,
  onClose,
}: MessageDetailDrawerProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const messageContent = transaction.messageContent || "No message content available";
  const formattedDate = transaction.createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed z-50 bg-gradient-to-br from-slate-900 to-slate-900/95 border-l border-slate-800/50 shadow-2xl transition-transform duration-300 ease-out rounded-l-2xl",
          // Desktop: slide from right
          "right-0 top-0 h-full w-full sm:w-[500px]",
          // Mobile: slide from bottom
          "sm:translate-y-0",
          isOpen
            ? "translate-x-0 sm:translate-x-0"
            : "translate-x-full sm:translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/50 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Message Details</h2>
                <p className="text-sm text-slate-400">Revenue-generating message</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-6">
              {/* Transaction Info Card */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/20 p-2">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-300">Revenue Generated</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        ${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-emerald-300">Message Unlock (PPV)</p>
                    <p className="text-xs text-emerald-400">✓ Payment Completed</p>
                  </div>
                </div>
              </div>

              {/* Conversation Thread */}
              {transaction.conversationThread && transaction.conversationThread.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-slate-800"></div>
                    <span className="text-xs font-medium text-slate-400">CONVERSATION</span>
                    <div className="h-px flex-1 bg-slate-800"></div>
                  </div>

                  {transaction.conversationThread.map((message, index) => {
                    const isFromFan = message.sentBy === "fan";
                    const isPaidMessage = index === transaction.conversationThread!.length - 1;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isFromFan ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] ${
                            isFromFan
                              ? "rounded-2xl rounded-tl-sm bg-slate-800/50 border border-slate-700/50"
                              : isPaidMessage
                              ? "rounded-2xl rounded-tr-sm bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 ring-2 ring-emerald-500/30"
                              : "rounded-2xl rounded-tr-sm bg-purple-500/10 border border-purple-500/30"
                          } p-3`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${isFromFan ? "text-blue-400" : "text-purple-400"}`}>
                              {isFromFan ? fan?.displayName || "Fan" : chatter?.name || "You"}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {message.sentAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className={`text-sm leading-relaxed ${isFromFan ? "text-slate-300" : "text-white"}`}>
                            {message.content}
                          </p>
                          {isPaidMessage && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="h-px flex-1 bg-emerald-500/30"></div>
                              <span className="text-xs font-semibold text-emerald-400">
                                💰 ${transaction.amount} unlocked
                              </span>
                              <div className="h-px flex-1 bg-emerald-500/30"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Fallback for transactions without conversation thread */
                <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                      Message Content
                    </span>
                  </div>
                  <p className="text-base leading-relaxed text-white sm:text-lg">
                    {messageContent}
                  </p>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Fan Info */}
                {fan && (
                  <div className="rounded-lg border border-slate-800/50 bg-slate-800/30 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-medium text-slate-400">Fan</span>
                    </div>
                    <p className="font-semibold text-white">{fan.displayName || fan.username}</p>
                    <p className="mt-1 text-xs text-slate-400 capitalize">{fan.tier} tier</p>
                  </div>
                )}

                {/* Chatter Info */}
                {chatter && (
                  <div className="rounded-lg border border-slate-800/50 bg-slate-800/30 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-400" />
                      <span className="text-xs font-medium text-slate-400">Chatter</span>
                    </div>
                    <p className="font-semibold text-white">{chatter.name}</p>
                    <p className="mt-1 text-xs text-slate-400 capitalize">{chatter.role} chatter</p>
                  </div>
                )}

                {/* Date */}
                <div className="rounded-lg border border-slate-800/50 bg-slate-800/30 p-4 sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-medium text-slate-400">Transaction Date</span>
                  </div>
                  <p className="font-semibold text-white">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800/50 p-4 sm:p-6">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-slate-800 px-4 py-3 font-medium text-white transition-colors hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
