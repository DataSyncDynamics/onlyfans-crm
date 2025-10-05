"use client";

import { useState, useMemo } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { CreatorCard } from "@/components/dashboard/creator-card";
import { CreatorDetailsModal } from "@/components/dashboard/creator-details-modal";
import { AddCreatorModal } from "@/components/dashboard/add-creator-modal";
import { ConnectOnlyFansModal } from "@/components/dashboard/connect-onlyfans-modal";
import { Button } from "@/components/ui/button";
import {
  CREATORS,
  FANS,
  TRANSACTIONS,
  addCreator,
  archiveCreator,
} from "@/lib/mock-data";
import {
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Crown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserCheck,
} from "lucide-react";
import { Creator } from "@/types";

type SortField = "displayName" | "totalRevenue" | "totalFans" | "activeFans" | "avgRevenuePerFan" | "subscriptionPrice";
type SortDirection = "asc" | "desc";

interface CreatorWithMetrics extends Creator {
  avgRevenuePerFan: number;
  revenueData: number[];
}

export default function CreatorsPage() {
  const [sortField, setSortField] = useState<SortField>("totalRevenue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedCreator, setSelectedCreator] = useState<CreatorWithMetrics | null>(null);
  const [addCreatorOpen, setAddCreatorOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectCreatorData, setConnectCreatorData] = useState<{ id: string; ofUsername: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Calculate enhanced creator data with metrics
  const creatorsWithMetrics = useMemo<CreatorWithMetrics[]>(() => {
    return CREATORS.map((creator) => {
      // Get fans for this creator
      const creatorFans = FANS.filter((f) => f.creatorId === creator.id);
      const activeFans = creatorFans.filter((f) => f.subscriptionStatus === "active");

      // Get transactions for this creator
      const creatorTransactions = TRANSACTIONS.filter(
        (t) => t.creatorId === creator.id && t.status === "completed"
      );

      // Calculate total revenue from actual transactions
      const totalRevenue = creatorTransactions.reduce((sum, t) => sum + t.amount, 0);

      // Calculate 7-day revenue sparkline
      const revenueData: number[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const dayRevenue = TRANSACTIONS.filter(
          (t) =>
            t.creatorId === creator.id &&
            t.createdAt >= dayStart &&
            t.createdAt <= dayEnd &&
            t.status === "completed"
        ).reduce((sum, t) => sum + t.amount, 0);

        revenueData.push(dayRevenue);
      }

      // Calculate average revenue per fan
      const avgRevenuePerFan = creatorFans.length > 0
        ? totalRevenue / creatorFans.length
        : 0;

      return {
        ...creator,
        totalFans: creatorFans.length,
        activeFans: activeFans.length,
        totalRevenue,
        avgRevenuePerFan,
        revenueData,
      };
    });
  }, [refreshKey]);

  // Agency-wide stats
  const agencyStats = useMemo(() => {
    const totalCreators = creatorsWithMetrics.length;
    const totalFans = creatorsWithMetrics.reduce((sum, c) => sum + c.totalFans, 0);
    const totalRevenue = creatorsWithMetrics.reduce((sum, c) => sum + c.totalRevenue, 0);
    const avgRevenuePerCreator = totalCreators > 0 ? totalRevenue / totalCreators : 0;

    return {
      totalCreators,
      totalFans,
      totalRevenue,
      avgRevenuePerCreator,
    };
  }, [creatorsWithMetrics]);

  // Sorted creators for table
  const sortedCreators = useMemo(() => {
    const sorted = [...creatorsWithMetrics];

    sorted.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case "displayName":
          aValue = a.displayName.toLowerCase();
          bValue = b.displayName.toLowerCase();
          break;
        case "totalRevenue":
          aValue = a.totalRevenue;
          bValue = b.totalRevenue;
          break;
        case "totalFans":
          aValue = a.totalFans;
          bValue = b.totalFans;
          break;
        case "activeFans":
          aValue = a.activeFans;
          bValue = b.activeFans;
          break;
        case "avgRevenuePerFan":
          aValue = a.avgRevenuePerFan;
          bValue = b.avgRevenuePerFan;
          break;
        case "subscriptionPrice":
          aValue = a.subscriptionPrice;
          bValue = b.subscriptionPrice;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [creatorsWithMetrics, sortField, sortDirection]);

  // Get top performer per category
  const topPerformers = useMemo(() => {
    const byRevenue = [...creatorsWithMetrics].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
    const byFans = [...creatorsWithMetrics].sort((a, b) => b.totalFans - a.totalFans)[0];
    const byAvgRevenue = [...creatorsWithMetrics].sort((a, b) => b.avgRevenuePerFan - a.avgRevenuePerFan)[0];

    return {
      revenue: byRevenue?.id,
      fans: byFans?.id,
      avgRevenue: byAvgRevenue?.id,
    };
  }, [creatorsWithMetrics]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-slate-500" />;
    }
    return sortDirection === "asc"
      ? <ArrowUp className="h-4 w-4 text-purple-400" />
      : <ArrowDown className="h-4 w-4 text-purple-400" />;
  };

  const handleAddCreator = async (creatorData: Omit<Creator, "id" | "totalRevenue" | "totalFans" | "activeFans" | "joinedAt">): Promise<string> => {
    const newCreator = addCreator(creatorData);
    setRefreshKey((prev) => prev + 1); // Trigger re-render
    return newCreator.id;
  };

  const handleConnectRequested = (creatorId: string, ofUsername: string) => {
    setConnectCreatorData({ id: creatorId, ofUsername });
    setConnectModalOpen(true);
  };

  const handleArchiveCreator = async (creatorId: string) => {
    const success = archiveCreator(creatorId);
    if (success) {
      setSelectedCreator(null); // Close the details modal
      setRefreshKey((prev) => prev + 1); // Refresh the creator list
    }
  };

  const getStatusBadge = (status: Creator["status"]) => {
    const styles = {
      active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      inactive: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      suspended: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const labels = {
      active: "Active",
      inactive: "Inactive",
      suspended: "Suspended",
    };

    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Creators</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage and monitor all creators in your agency
          </p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => setAddCreatorOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Creator
        </Button>
      </div>

      {/* Agency-Wide Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <MetricCard
          title="Total Creators"
          value={agencyStats.totalCreators}
          icon={Users}
          className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl"
        />
        <MetricCard
          title="Total Fans"
          value={agencyStats.totalFans.toLocaleString()}
          icon={UserCheck}
          className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${(agencyStats.totalRevenue / 1000).toFixed(1)}k`}
          icon={DollarSign}
          className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl"
        />
        <MetricCard
          title="Avg Revenue per Creator"
          value={`$${(agencyStats.avgRevenuePerCreator / 1000).toFixed(1)}k`}
          icon={TrendingUp}
          className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl"
        />
      </div>

      {/* Creator Cards Grid */}
      <div className="animate-fade-in">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Creator Overview</h2>
          <p className="text-sm text-slate-400">Click a card to view details</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creatorsWithMetrics.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              revenueData={creator.revenueData}
              onClick={() => setSelectedCreator(creator)}
            />
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="animate-slide-up rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Performance Comparison</h2>
            <p className="mt-1 text-sm text-slate-400">
              Compare key metrics across all creators
            </p>
          </div>
          <Crown className="h-5 w-5 text-purple-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="pb-3 pr-4 text-left">
                  <button
                    onClick={() => handleSort("displayName")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    Creator
                    {getSortIcon("displayName")}
                  </button>
                </th>
                <th className="pb-3 px-4 text-left">
                  <button
                    onClick={() => handleSort("subscriptionPrice")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    Sub Price
                    {getSortIcon("subscriptionPrice")}
                  </button>
                </th>
                <th className="pb-3 px-4 text-left">
                  <button
                    onClick={() => handleSort("totalFans")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    Total Fans
                    {getSortIcon("totalFans")}
                  </button>
                </th>
                <th className="pb-3 px-4 text-left">
                  <button
                    onClick={() => handleSort("activeFans")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    Active Fans
                    {getSortIcon("activeFans")}
                  </button>
                </th>
                <th className="pb-3 px-4 text-left">
                  <button
                    onClick={() => handleSort("totalRevenue")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    Total Revenue
                    {getSortIcon("totalRevenue")}
                  </button>
                </th>
                <th className="pb-3 px-4 text-left">
                  <button
                    onClick={() => handleSort("avgRevenuePerFan")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    Avg/Fan
                    {getSortIcon("avgRevenuePerFan")}
                  </button>
                </th>
                <th className="pb-3 pl-4 text-left">
                  <span className="text-sm font-medium text-slate-400">Status</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {sortedCreators.map((creator) => {
                const isTopRevenue = topPerformers.revenue === creator.id;
                const isTopFans = topPerformers.fans === creator.id;
                const isTopAvgRevenue = topPerformers.avgRevenue === creator.id;

                return (
                  <tr
                    key={creator.id}
                    className="group transition-colors hover:bg-slate-800/20"
                  >
                    {/* Creator Name */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                          <span className="text-sm font-bold text-white">
                            {creator.displayName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{creator.displayName}</p>
                          <p className="text-sm text-slate-400">{creator.ofUsername}</p>
                        </div>
                      </div>
                    </td>

                    {/* Subscription Price */}
                    <td className="px-4 py-4">
                      <span className="text-white font-medium">
                        ${creator.subscriptionPrice.toFixed(2)}
                      </span>
                    </td>

                    {/* Total Fans */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {creator.totalFans.toLocaleString()}
                        </span>
                        {isTopFans && (
                          <div className="relative group">
                            <Crown className="h-4 w-4 text-yellow-400" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Most Fans
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Active Fans */}
                    <td className="px-4 py-4">
                      <div>
                        <span className="text-white font-medium">
                          {creator.activeFans.toLocaleString()}
                        </span>
                        <span className="ml-2 text-sm text-slate-400">
                          ({((creator.activeFans / creator.totalFans) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </td>

                    {/* Total Revenue */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          ${(creator.totalRevenue / 1000).toFixed(1)}k
                        </span>
                        {isTopRevenue && (
                          <div className="relative group">
                            <Crown className="h-4 w-4 text-yellow-400" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Highest Revenue
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Avg Revenue per Fan */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          ${creator.avgRevenuePerFan.toFixed(0)}
                        </span>
                        {isTopAvgRevenue && (
                          <div className="relative group">
                            <Crown className="h-4 w-4 text-yellow-400" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Highest Avg Revenue
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="pl-4 py-4">
                      {getStatusBadge(creator.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Legend */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800/30 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Crown className="h-4 w-4 text-yellow-400" />
            <span>Crown indicates top performer in that category</span>
          </div>
          <div className="text-sm text-slate-400">
            {creatorsWithMetrics.length} creators total
          </div>
        </div>
      </div>

      {/* Creator Details Modal */}
      <CreatorDetailsModal
        creator={selectedCreator}
        open={!!selectedCreator}
        onClose={() => setSelectedCreator(null)}
        onArchive={handleArchiveCreator}
      />

      {/* Add Creator Modal */}
      <AddCreatorModal
        open={addCreatorOpen}
        onClose={() => setAddCreatorOpen(false)}
        onSubmit={handleAddCreator}
        onConnectRequested={handleConnectRequested}
      />

      {/* Connect OnlyFans Modal */}
      {connectCreatorData && (
        <ConnectOnlyFansModal
          open={connectModalOpen}
          onClose={() => {
            setConnectModalOpen(false);
            setConnectCreatorData(null);
          }}
          creatorId={connectCreatorData.id}
          ofUsername={connectCreatorData.ofUsername}
        />
      )}
    </div>
  );
}
