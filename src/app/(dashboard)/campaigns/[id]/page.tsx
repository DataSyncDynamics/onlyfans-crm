"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Eye,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Download,
  Copy,
  Edit,
  Pause,
  Play,
  Users,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock campaign data
const CAMPAIGN = {
  id: "campaign_completed_1",
  name: "Beach Photoshoot Exclusive",
  type: "ppv" as const,
  status: "completed" as const,
  creatorIds: ["creator_1"],
  creatorNames: ["Stella Rose"],
  targetCount: 23,
  sentCount: 23,
  openedCount: 15,
  respondedCount: 7,
  revenue: 350,
  ppvPrice: 50,
  message:
    "Just got back from the beach and WOW... these photos are incredible 🏖️ Wearing that bikini you asked about! Want exclusive access? Only $50 for the full set 📸",
  mediaUrls: ["/campaigns/beach-preview.jpg"],
  scheduledFor: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  completedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
  hasABTest: true,
  variants: [
    {
      id: "variant_a",
      name: 'Variant A: "Hey babe! 🔥"',
      message:
        "Hey babe! 🔥 Just got back from the beach and WOW... these photos are incredible 🏖️",
      trafficSplit: 50,
      sent: 12,
      opened: 8,
      responded: 4,
      revenue: 200,
    },
    {
      id: "variant_b",
      name: 'Variant B: "Exclusive for you 💕"',
      message:
        "Exclusive for you 💕 I just finished an amazing beach photoshoot in that bikini you mentioned...",
      trafficSplit: 50,
      sent: 11,
      opened: 7,
      responded: 3,
      revenue: 150,
    },
  ],
};

// Mock performance data (hourly opens)
const PERFORMANCE_DATA = [
  { hour: "0h", opens: 0 },
  { hour: "1h", opens: 2 },
  { hour: "2h", opens: 5 },
  { hour: "3h", opens: 8 },
  { hour: "4h", opens: 11 },
  { hour: "5h", opens: 14 },
  { hour: "6h", opens: 15 },
];

// Mock top purchasers
const TOP_PURCHASERS = [
  {
    id: "1",
    name: "@mike2847",
    tier: "whale",
    amount: 50,
    timeToPurchase: "2 min",
  },
  {
    id: "2",
    name: "@john4521",
    tier: "whale",
    amount: 50,
    timeToPurchase: "5 min",
  },
  {
    id: "3",
    name: "@kevin5432",
    tier: "high",
    amount: 50,
    timeToPurchase: "12 min",
  },
  {
    id: "4",
    name: "@sarah9876",
    tier: "high",
    amount: 50,
    timeToPurchase: "18 min",
  },
  {
    id: "5",
    name: "@chris4521",
    tier: "whale",
    amount: 50,
    timeToPurchase: "25 min",
  },
];

const STATUS_CONFIG = {
  sending: { label: "Sending", color: "bg-blue-500/20 text-blue-400" },
  scheduled: { label: "Scheduled", color: "bg-purple-500/20 text-purple-400" },
  completed: { label: "Completed", color: "bg-emerald-500/20 text-emerald-400" },
  paused: { label: "Paused", color: "bg-yellow-500/20 text-yellow-400" },
};

export default function CampaignAnalyticsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState("all");

  const openRate = ((CAMPAIGN.openedCount / CAMPAIGN.sentCount) * 100).toFixed(1);
  const responseRate = ((CAMPAIGN.respondedCount / CAMPAIGN.sentCount) * 100).toFixed(1);
  const conversionRate = ((TOP_PURCHASERS.length / CAMPAIGN.sentCount) * 100).toFixed(1);

  const winningVariant =
    CAMPAIGN.variants[0].revenue > CAMPAIGN.variants[1].revenue
      ? CAMPAIGN.variants[0]
      : CAMPAIGN.variants[1];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{CAMPAIGN.name}</h1>
              <Badge className={STATUS_CONFIG[CAMPAIGN.status].color}>
                {STATUS_CONFIG[CAMPAIGN.status].label}
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                PPV
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {CAMPAIGN.creatorNames.join(", ")}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {CAMPAIGN.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-slate-800/50 border-slate-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="bg-slate-800/50 border-slate-700">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            {CAMPAIGN.status === "sending" && (
              <Button variant="outline" className="bg-slate-800/50 border-slate-700">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="Messages Sent"
          value={CAMPAIGN.sentCount}
          icon={Send}
          suffix={` / ${CAMPAIGN.targetCount}`}
        />
        <MetricCard
          title="Opened"
          value={`${openRate}%`}
          change={+12}
          trend="up"
          icon={Eye}
          suffix={` (${CAMPAIGN.openedCount})`}
        />
        <MetricCard
          title="Responded"
          value={`${responseRate}%`}
          icon={MessageSquare}
          suffix={` (${CAMPAIGN.respondedCount})`}
        />
        <MetricCard
          title="Revenue"
          value={`$${CAMPAIGN.revenue.toLocaleString()}`}
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* Performance Chart */}
      <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Performance Over Time</h2>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={PERFORMANCE_DATA}>
            <XAxis
              dataKey="hour"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              itemStyle={{ color: "#a78bfa" }}
            />
            <Line
              type="monotone"
              dataKey="opens"
              stroke="#a78bfa"
              strokeWidth={3}
              dot={{ fill: "#a78bfa", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 p-3 rounded-lg bg-slate-800/30 text-xs text-slate-400">
          Shows when fans opened messages. Peak activity occurred 5-6 hours after send.
        </div>
      </div>

      {/* A/B Test Results */}
      {CAMPAIGN.hasABTest && CAMPAIGN.variants && (
        <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">A/B Test Results</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {CAMPAIGN.variants.map((variant) => {
              const isWinner = variant.id === winningVariant.id;
              const variantOpenRate = (
                (variant.opened / variant.sent) *
                100
              ).toFixed(1);

              return (
                <div
                  key={variant.id}
                  className={`
                    p-5 rounded-lg border-2 transition-all
                    ${
                      isWinner
                        ? "border-yellow-500/50 bg-yellow-500/5"
                        : "border-slate-700 bg-slate-800/30"
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">
                          {variant.name}
                        </span>
                        {isWinner && (
                          <Badge className="bg-yellow-500/20 text-yellow-400">
                            <Award className="h-3 w-3 mr-1" />
                            Winner
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {variant.trafficSplit}% traffic split
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Sent</span>
                      <span className="text-sm font-medium text-white">
                        {variant.sent}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Open Rate</span>
                      <span className="text-sm font-medium text-white">
                        {variantOpenRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Revenue</span>
                      <span className="text-sm font-semibold text-emerald-400">
                        ${variant.revenue}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/50 text-xs text-slate-300 italic">
                    "{variant.message}"
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
            <strong>Insight:</strong> Variant A performed {((winningVariant.revenue / (CAMPAIGN.variants[0].revenue + CAMPAIGN.variants[1].revenue)) * 100).toFixed(0)}% better than Variant B. Consider using similar messaging in future campaigns.
          </div>
        </div>
      )}

      {/* Two Column Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Purchasers */}
        <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Top Purchasers
          </h2>
          <div className="space-y-3">
            {TOP_PURCHASERS.map((fan, index) => (
              <div
                key={fan.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {fan.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          fan.tier === "whale"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {fan.tier}
                      </Badge>
                      <span>• {fan.timeToPurchase}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-400">
                    ${fan.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Message Sent
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50">
              <p className="text-sm text-slate-300 whitespace-pre-wrap">
                {CAMPAIGN.message}
              </p>
            </div>

            {CAMPAIGN.mediaUrls && CAMPAIGN.mediaUrls.length > 0 && (
              <div>
                <div className="text-xs text-slate-400 mb-2">
                  Media ({CAMPAIGN.mediaUrls.length})
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {CAMPAIGN.mediaUrls.map((url, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg bg-slate-800 overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {CAMPAIGN.ppvPrice && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <span className="text-sm text-purple-400">PPV Price</span>
                <span className="text-lg font-bold text-purple-400">
                  ${CAMPAIGN.ppvPrice}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
