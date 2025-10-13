"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AISuggestionPanel } from "@/components/chat/ai-suggestion-panel";
import { KeywordDetector } from "@/components/chat/keyword-detector";
import { Conversation, Fan } from "@/types";
import {
  getConversationsByChatter,
  getFanById,
  CONVERSATIONS,
} from "@/lib/mock-data";
import {
  Search,
  Send,
  ChevronLeft,
  MessageSquare,
  Sparkles,
  Clock,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<Conversation['status'] | 'all'>('all');
  const [filterPriority] = useState<Conversation['priority'] | 'all'>('all');
  const [messageInput, setMessageInput] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get conversations for the current chatter (using chatter_1 for demo)
  const allConversations = getConversationsByChatter("chatter_1");

  // Filter conversations
  const filteredConversations = allConversations.filter((conv) => {
    const fan = getFanById(conv.fanId);
    if (!fan) return false;

    const matchesSearch =
      searchQuery === "" ||
      fan.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fan.displayName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || conv.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const currentConversation = selectedConversation
    ? CONVERSATIONS.find((c) => c.id === selectedConversation)
    : null;

  const currentFan = currentConversation
    ? getFanById(currentConversation.fanId)
    : null;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    // In a real app, this would send the message via API
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const handleUseSuggestion = (message: string) => {
    setMessageInput(message);
  };

  const getPriorityColor = (priority: Conversation['priority']) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "normal":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "low":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: Conversation['status']) => {
    switch (status) {
      case "waiting":
        return "bg-orange-500/20 text-orange-400";
      case "active":
        return "bg-green-500/20 text-green-400";
      case "archived":
        return "bg-gray-500/20 text-gray-400";
    }
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

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-screen overflow-hidden bg-slate-950">
      {/* Conversation List - Left Panel */}
      <div className={cn(
        "flex w-full flex-col border-r border-slate-800/50 bg-slate-950 transition-all lg:w-80",
        selectedConversation && "hidden lg:flex"
      )}>
        {/* Search & Filters */}
        <div className="border-b border-slate-800/50 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-10 bg-slate-900/50 border-slate-800 focus:border-purple-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFilterStatus('all')}
              className={cn(
                "whitespace-nowrap min-h-[44px] transition-all",
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent hover:from-purple-600 hover:to-pink-600'
                  : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFilterStatus('waiting')}
              className={cn(
                "whitespace-nowrap min-h-[44px] transition-all",
                filterStatus === 'waiting'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent hover:from-purple-600 hover:to-pink-600'
                  : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              Waiting
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFilterStatus('active')}
              className={cn(
                "whitespace-nowrap min-h-[44px] transition-all",
                filterStatus === 'active'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent hover:from-purple-600 hover:to-pink-600'
                  : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              Active
            </Button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="mb-3 h-12 w-12 text-slate-600" />
              <p className="text-sm text-slate-500">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/30">
              {filteredConversations.map((conversation) => {
                const fan = getFanById(conversation.fanId);
                if (!fan) return null;

                const isSelected = selectedConversation === conversation.id;
                const lastMessage = conversation.messages[conversation.messages.length - 1];

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={cn(
                      "w-full p-4 text-left transition-all hover:bg-slate-900/50",
                      isSelected && "bg-slate-900/80 border-l-2 border-purple-500"
                    )}
                  >
                    <div className="space-y-2">
                      {/* Fan Info */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white truncate">
                              {fan.displayName || fan.username}
                            </p>
                            <Badge variant={getTierBadgeVariant(fan.tier)} className="text-xs">
                              {fan.tier}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">@{fan.username}</p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-500 px-1.5 text-xs font-bold text-white">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Last Message Preview */}
                      <p className="line-clamp-2 text-sm text-slate-400">
                        {lastMessage?.content || "No messages yet"}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn("text-xs border", getPriorityColor(conversation.priority))}>
                          {conversation.priority}
                        </Badge>
                        <Badge variant="outline" className={cn("text-xs", getStatusColor(conversation.status))}>
                          {conversation.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area - Middle Panel */}
      <div className={cn(
        "flex flex-1 flex-col bg-slate-950",
        !selectedConversation && "hidden lg:flex"
      )}>
        {!currentConversation ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="mb-4 h-16 w-16 text-slate-700" />
            <h3 className="text-lg font-semibold text-white">Select a conversation</h3>
            <p className="mt-2 text-sm text-slate-500">
              Choose a conversation from the list to start chatting
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-slate-800/50 p-4">
              {/* Mobile Back Button */}
              <button
                onClick={() => setSelectedConversation(null)}
                className="lg:hidden -ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {currentFan && (
                <>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-white">
                        {currentFan.displayName || currentFan.username}
                      </h2>
                      <Badge variant={getTierBadgeVariant(currentFan.tier)}>
                        {currentFan.tier}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-slate-400">@{currentFan.username}</p>
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <DollarSign className="h-3 w-3" />
                        ${currentFan.totalSpent.toLocaleString()} LTV
                      </div>
                    </div>
                  </div>

                  {/* Toggle AI Panel Button (Mobile) */}
                  <button
                    onClick={() => setShowAIPanel(!showAIPanel)}
                    className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                  >
                    <Sparkles className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sentBy === "chatter" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      message.sentBy === "chatter"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-slate-800/50 text-slate-100"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>

                    {/* Keyword Badges */}
                    {message.detectedKeywords && message.detectedKeywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.detectedKeywords.map((keyword, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs bg-slate-900/50 border-purple-500/30 text-purple-300"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p
                      className={cn(
                        "mt-1 text-xs",
                        message.sentBy === "chatter"
                          ? "text-purple-100/70"
                          : "text-slate-500"
                      )}
                    >
                      {format(message.sentAt, "h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Keyword Alerts */}
            <div className="border-t border-slate-800/50 p-4">
              <KeywordDetector
                conversationId={currentConversation.id}
                onUseSuggestion={handleUseSuggestion}
              />
            </div>

            {/* Message Input */}
            <div className="border-t border-slate-800/50 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="h-11 flex-1 bg-slate-900/50 border-slate-800 focus:border-purple-500"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="h-11 w-11 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* AI Suggestion Panel - Right Panel */}
      {selectedConversation && (
        <div className={cn(
          "w-full border-l border-slate-800/50 bg-slate-950 lg:w-96",
          showAIPanel ? "block" : "hidden lg:block"
        )}>
          <AISuggestionPanel
            conversationId={selectedConversation}
            onUseSuggestion={handleUseSuggestion}
          />
        </div>
      )}
    </div>
  );
}
