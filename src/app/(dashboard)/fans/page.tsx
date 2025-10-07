"use client";

import { useState, useMemo } from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FanDetailsModal } from "@/components/dashboard/fan-details-modal";
import { FANS, getCreatorById } from "@/lib/mock-data";
import { Fan, Creator } from "@/types";
import { useRole } from "@/contexts/role-context";
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Eye,
  Plus,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// Tier Badge Component
function TierBadge({ tier }: { tier: Fan["tier"] }) {
  const variants = {
    whale: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    low: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  const labels = {
    whale: "Whale",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-smooth",
        variants[tier]
      )}
    >
      {labels[tier]}
    </span>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: Fan["subscriptionStatus"] }) {
  const variants = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    expired: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-smooth capitalize",
        variants[status]
      )}
    >
      {status}
    </span>
  );
}

// Creator Badge Component
function CreatorBadge({ creator }: { creator: Creator }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
      {creator.displayName}
    </span>
  );
}

export default function FansPage() {
  const { role } = useRole();
  const [selectedTier, setSelectedTier] = useState<Fan["tier"] | "all">("all");
  const [selectedCreator, setSelectedCreator] = useState<string | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<
    Fan["subscriptionStatus"] | "all"
  >("all");
  const [selectedFan, setSelectedFan] = useState<Fan | null>(null);

  // Define table columns - conditionally based on role
  const columns: ColumnDef<Fan>[] = [
    {
      accessorKey: "username",
      header: "Fan",
      cell: ({ row }) => {
        const fan = row.original;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{fan.username}</span>
              <TierBadge tier={fan.tier} />
            </div>
            {fan.displayName && (
              <span className="text-xs text-slate-400">{fan.displayName}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "creatorId",
      header: () => <div className="text-center">Creator</div>,
      cell: ({ row }) => {
        const creator = getCreatorById(row.original.creatorId);
        return creator ? (
          <div className="flex justify-center">
            <CreatorBadge creator={creator} />
          </div>
        ) : null;
      },
    },
    // Conditional column: Show $ for agency_owner/creator, engagement score for chatter
    ...(role !== "chatter"
      ? [
          {
            accessorKey: "totalSpent",
            header: () => <div className="text-center">Total Spent</div>,
            cell: ({ row }: { row: Row<Fan> }) => (
              <div className="text-center">
                <span className="font-semibold text-emerald-400">
                  ${row.original.totalSpent.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            ),
          } as ColumnDef<Fan>,
        ]
      : [
          {
            accessorKey: "messageCount",
            header: () => <div className="text-center">Engagement</div>,
            cell: ({ row }: { row: Row<Fan> }) => {
              // Calculate engagement score (0-100) based on message count and tier
              const score = Math.min(100, (row.original.messageCount / 10) * 50 + (
                row.original.tier === "whale" ? 50 :
                row.original.tier === "high" ? 30 :
                row.original.tier === "medium" ? 15 : 5
              ));
              return (
                <div className="text-center">
                  <span className={cn(
                    "font-semibold",
                    score >= 75 ? "text-emerald-400" :
                    score >= 50 ? "text-blue-400" :
                    score >= 25 ? "text-amber-400" : "text-slate-400"
                  )}>
                    {score.toFixed(0)}
                  </span>
                </div>
              );
            },
          } as ColumnDef<Fan>,
        ]),
    {
      accessorKey: "messageCount",
      header: () => <div className="text-center">Messages</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span className="text-slate-300">{row.original.messageCount}</span>
        </div>
      ),
    },
    {
      accessorKey: "subscriptionStatus",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <StatusBadge status={row.original.subscriptionStatus} />
        </div>
      ),
    },
    {
      accessorKey: "lastActiveAt",
      header: "Last Active",
      cell: ({ row }) => (
        <span className="text-xs text-slate-400">
          {formatDistanceToNow(row.original.lastActiveAt, { addSuffix: true })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
          onClick={() => setSelectedFan(row.original)}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      ),
    },
  ];

  // Filter fans based on selected filters
  const filteredFans = useMemo(() => {
    return FANS.filter((fan) => {
      if (selectedTier !== "all" && fan.tier !== selectedTier) return false;
      if (selectedCreator !== "all" && fan.creatorId !== selectedCreator)
        return false;
      if (selectedStatus !== "all" && fan.subscriptionStatus !== selectedStatus)
        return false;
      return true;
    });
  }, [selectedTier, selectedCreator, selectedStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalFans = filteredFans.length;
    const activeFans = filteredFans.filter(
      (f) => f.subscriptionStatus === "active"
    ).length;
    const totalRevenue = filteredFans.reduce(
      (sum, fan) => sum + fan.totalSpent,
      0
    );
    const avgSpend = totalFans > 0 ? totalRevenue / totalFans : 0;

    return {
      totalFans,
      activeFans,
      totalRevenue,
      avgSpend,
    };
  }, [filteredFans]);

  // Get unique creators
  const uniqueCreators = useMemo(() => {
    const creatorIds = Array.from(new Set(FANS.map((f) => f.creatorId)));
    return creatorIds
      .map((id) => getCreatorById(id))
      .filter((c): c is Creator => c !== undefined);
  }, []);

  // Tier filter chips
  const tierFilters: Array<{ value: Fan["tier"] | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "whale", label: "Whales" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Fans Database</h1>
          <p className="mt-1 text-sm text-slate-400">
            {stats.totalFans} total fans
            {selectedTier !== "all" || selectedCreator !== "all" || selectedStatus !== "all"
              ? " (filtered)"
              : ""}
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500">
          <Plus className="h-4 w-4" />
          Add Fan
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <div className="group relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-900/80 p-6 transition-colors duration-200 hover:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Fans</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {stats.totalFans.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-violet-500/10 p-3 ring-1 ring-violet-500/20">
              <Users className="h-6 w-6 text-violet-400" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-900/80 p-6 transition-colors duration-200 hover:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Active Subscriptions
              </p>
              <p className="mt-2 text-3xl font-bold text-white">
                {stats.activeFans.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
              <UserCheck className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-900/80 p-6 transition-colors duration-200 hover:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold text-white">
                $
                {stats.totalRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="rounded-lg bg-amber-500/10 p-3 ring-1 ring-amber-500/20">
              <DollarSign className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-900/80 p-6 transition-colors duration-200 hover:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Avg Spend Per Fan
              </p>
              <p className="mt-2 text-3xl font-bold text-white">
                $
                {stats.avgSpend.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-3 ring-1 ring-blue-500/20">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="animate-fade-in space-y-4 rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <Filter className="h-4 w-4" />
          Filters
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Tier Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-slate-400 flex items-center">
              Tier:
            </span>
            {tierFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedTier(filter.value)}
                className={cn(
                  "rounded-lg px-4 py-2.5 min-h-[44px] flex items-center text-xs font-medium transition-all duration-200",
                  selectedTier === filter.value
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Creator Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Creator:</span>
            <select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Creators</option>
              {uniqueCreators.map((creator) => (
                <option key={creator.id} value={creator.id}>
                  {creator.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value as Fan["subscriptionStatus"] | "all"
                )
              }
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedTier !== "all" ||
            selectedCreator !== "all" ||
            selectedStatus !== "all") && (
            <button
              onClick={() => {
                setSelectedTier("all");
                setSelectedCreator("all");
                setSelectedStatus("all");
              }}
              className="ml-auto rounded-lg bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="animate-slide-up rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <DataTable
          columns={columns}
          data={filteredFans}
          searchKey="username"
          searchPlaceholder="Search fans by username..."
          pageSize={20}
          emptyMessage="No fans found"
          emptyDescription="Try adjusting your filters or search query"
        />
      </div>

      {/* Fan Details Modal */}
      <FanDetailsModal
        fan={selectedFan}
        open={!!selectedFan}
        onClose={() => setSelectedFan(null)}
      />
    </div>
  );
}
