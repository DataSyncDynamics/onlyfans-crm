"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Send, Clock, CheckCircle2, FileEdit, TrendingUp, DollarSign, Eye, MessageSquare, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data - in real app, import from @/lib/mock-data
const CAMPAIGNS = [
  {
    id: "camp_1",
    name: "Holiday Weekend Special",
    type: "ppv" as const,
    status: "sending" as const,
    creatorIds: ["creator_1"],
    targetCount: 74,
    sentCount: 52,
    openRate: 54,
    revenue: 504,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "camp_2",
    name: "Re-engagement: Expired Subs",
    type: "reengagement" as const,
    status: "sending" as const,
    creatorIds: ["creator_2"],
    targetCount: 48,
    sentCount: 34,
    openRate: 41,
    revenue: 159.6,
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
  },
  {
    id: "camp_3",
    name: "VIP Exclusive Preview",
    type: "ppv" as const,
    status: "sending" as const,
    creatorIds: ["creator_1", "creator_2"],
    targetCount: 42,
    sentCount: 28,
    openRate: 68,
    revenue: 672,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  // Completed
  {
    id: "camp_4",
    name: "Beach Photoshoot Exclusive",
    type: "ppv" as const,
    status: "completed" as const,
    creatorIds: ["creator_1"],
    targetCount: 23,
    sentCount: 23,
    openRate: 67,
    revenue: 3450,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  // Scheduled
  {
    id: "camp_5",
    name: "Late Night Vibes",
    type: "ppv" as const,
    status: "scheduled" as const,
    creatorIds: ["creator_1"],
    targetCount: 62,
    scheduledFor: new Date(Date.now() + 6 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  // Drafts
  {
    id: "camp_6",
    name: "Red Dress Photoshoot",
    type: "ppv" as const,
    status: "draft" as const,
    creatorIds: ["creator_1"],
    targetCount: 52,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

const TABS = [
  { id: "active", label: "Active", count: 3, icon: Send },
  { id: "scheduled", label: "Scheduled", count: 4, icon: Clock },
  { id: "completed", label: "Completed", count: 8, icon: CheckCircle2 },
  { id: "drafts", label: "Drafts", count: 3, icon: FileEdit },
];

const CAMPAIGN_TYPES = {
  ppv: { label: "PPV", color: "bg-purple-500/20 text-purple-400" },
  promo: { label: "Promo", color: "bg-blue-500/20 text-blue-400" },
  reengagement: { label: "Re-engage", color: "bg-yellow-500/20 text-yellow-400" },
  welcome: { label: "Welcome", color: "bg-emerald-500/20 text-emerald-400" },
};

const STATUS_CONFIG = {
  sending: {
    label: "Sending",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Send,
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  draft: {
    label: "Draft",
    color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    icon: FileEdit,
  },
};

export default function CampaignsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filteredCampaigns = useMemo(() => {
    return CAMPAIGNS.filter((campaign) => {
      // Tab filter
      if (activeTab === "active" && campaign.status !== "sending") return false;
      if (activeTab === "scheduled" && campaign.status !== "scheduled") return false;
      if (activeTab === "completed" && campaign.status !== "completed") return false;
      if (activeTab === "drafts" && campaign.status !== "draft") return false;

      // Search filter
      if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter
      if (typeFilter && campaign.type !== typeFilter) return false;

      return true;
    });
  }, [activeTab, searchQuery, typeFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaigns</h1>
          <p className="text-sm text-slate-400 mt-1">
            Create and manage mass messaging campaigns
          </p>
        </div>
        <Link href="/campaigns/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800">
        <div className="flex gap-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 pb-3 border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-purple-500 text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
                <Badge
                  variant="secondary"
                  className={`
                    ${activeTab === tab.id ? "bg-purple-500/20 text-purple-400" : "bg-slate-700/50 text-slate-400"}
                  `}
                >
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={typeFilter || ""}
            onChange={(e) => setTypeFilter(e.target.value || null)}
            className="h-11 px-4 rounded-lg border border-slate-700 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Types</option>
            <option value="ppv">PPV</option>
            <option value="promo">Promotion</option>
            <option value="reengagement">Re-engagement</option>
            <option value="welcome">Welcome</option>
          </select>
        </div>
      </div>

      {/* Campaign Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-slate-800/50 bg-slate-900/30">
          <MessageSquare className="h-12 w-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No campaigns found</h3>
          <p className="text-sm text-slate-400 mb-4">
            {searchQuery || typeFilter
              ? "Try adjusting your filters"
              : "Create your first campaign to get started"}
          </p>
          {!searchQuery && !typeFilter && (
            <Link href="/campaigns/new">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign) => {
            const statusConfig = STATUS_CONFIG[campaign.status];
            const StatusIcon = statusConfig.icon;
            const typeConfig = CAMPAIGN_TYPES[campaign.type];

            return (
              <div
                key={campaign.id}
                className="group relative rounded-lg border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-5 hover:border-slate-700 transition-all cursor-pointer"
                onClick={() => router.push(`/campaigns/${campaign.id}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                      <Badge className={`border ${statusConfig.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (for active campaigns) */}
                {campaign.status === "sending" && campaign.sentCount && campaign.targetCount && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>Progress</span>
                      <span>
                        {campaign.sentCount} / {campaign.targetCount} sent
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                        style={{
                          width: `${(campaign.sentCount / campaign.targetCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Countdown (for scheduled campaigns) */}
                {campaign.status === "scheduled" && campaign.scheduledFor && (
                  <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-400 font-medium">
                        Sends {campaign.scheduledFor.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Metrics (for completed/active campaigns) */}
                {(campaign.status === "completed" || campaign.status === "sending") && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {campaign.openRate !== undefined && (
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">Opens</div>
                        <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4" />
                          {campaign.openRate}%
                        </div>
                      </div>
                    )}
                    {campaign.revenue !== undefined && (
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">Revenue</div>
                        <div className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${campaign.revenue.toLocaleString()}
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">Target</div>
                      <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {campaign.targetCount}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                  <div className="text-xs text-slate-400">
                    {campaign.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Duplicate campaign logic
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {campaign.status === "draft" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Delete campaign logic
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
