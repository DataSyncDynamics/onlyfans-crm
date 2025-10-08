"use client";

import { useState } from "react";
import { Fan, Creator } from "@/types";
import { Crown, TrendingUp } from "lucide-react";
import { FanDetailsModal } from "@/components/dashboard/fan-details-modal";

interface TopFansTableProps {
  fans: Fan[];
  creators: Creator[];
}

const tierColors = {
  whale: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  high: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  medium: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  low: "text-slate-400 bg-slate-500/10 border-slate-500/30",
};

const tierLabels = {
  whale: "Whale",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function TopFansTable({ fans, creators }: TopFansTableProps) {
  const [selectedFan, setSelectedFan] = useState<Fan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCreatorName = (creatorId: string) => {
    const creator = creators.find((c) => c.id === creatorId);
    return creator?.displayName || "Unknown";
  };

  const handleFanClick = (fan: Fan) => {
    setSelectedFan(fan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing selected fan until after animation
    setTimeout(() => setSelectedFan(null), 300);
  };

  return (
    <>
      <div className="space-y-2">
        {fans.map((fan, index) => (
          <div
            key={fan.id}
            onClick={() => handleFanClick(fan)}
            className="group flex items-center gap-3 rounded-lg border border-slate-800/30 bg-slate-900/20 p-3 transition-all hover:border-slate-700/50 hover:bg-slate-800/30 hover:scale-[1.01] cursor-pointer"
          >
          {/* Rank */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800/50 text-sm font-bold text-slate-400">
            {index < 3 ? (
              <Crown className={`h-4 w-4 ${index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : "text-orange-400"}`} />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>

          {/* Fan Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-white">
                {fan.username}
              </p>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${tierColors[fan.tier]}`}>
                {tierLabels[fan.tier]}
              </span>
            </div>
            <p className="truncate text-xs text-slate-400">
              {getCreatorName(fan.creatorId)}
            </p>
          </div>

          {/* Stats */}
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-green-400">
              ${fan.totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">
              {fan.messageCount} msgs
            </p>
          </div>

          {/* Hover indicator */}
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ))}

        {fans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingUp className="mb-3 h-12 w-12 text-slate-600" />
            <p className="text-sm font-medium text-slate-400">No fans yet</p>
            <p className="text-xs text-slate-500">Top fans will appear here</p>
          </div>
        )}
      </div>

      <FanDetailsModal
        fan={selectedFan}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
