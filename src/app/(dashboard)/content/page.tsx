"use client";

import { useState } from "react";
import { useRole } from "@/contexts/role-context";
import { Card } from "@/components/ui/card";
import { UploadZone } from "@/components/content/upload-zone";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Image as ImageIcon,
  Video,
  Upload,
  TrendingUp,
  FolderOpen,
  HardDrive,
  Info
} from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

export default function ContentPage() {
  const { role } = useRole();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [category, setCategory] = useState("all");
  const [contentDescription, setContentDescription] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<string>("all");

  // Mock creators data (would come from CREATORS in real app)
  const creators = [
    { id: "1", name: "Bella Rose", username: "bella_rose" },
    { id: "2", name: "Luna Star", username: "luna_star" },
    { id: "3", name: "Mia Rivers", username: "mia_rivers" },
  ];

  // Mock stats per creator
  const creatorStats = {
    "1": { // Bella Rose
      uploadedThisWeek: 12,
      contentPoolCount: 25,
      sentToFans: 89,
      storageUsed: "1.2 GB",
    },
    "2": { // Luna Star
      uploadedThisWeek: 8,
      contentPoolCount: 15,
      sentToFans: 45,
      storageUsed: "800 MB",
    },
    "3": { // Mia Rivers
      uploadedThisWeek: 4,
      contentPoolCount: 8,
      sentToFans: 22,
      storageUsed: "450 MB",
    },
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  // Calculate stats based on selected creator
  const stats = role === "agency_owner" && selectedCreator !== "all"
    ? creatorStats[selectedCreator as keyof typeof creatorStats]
    : role === "agency_owner"
    ? {
        // Aggregate stats for all creators
        uploadedThisWeek: 24,
        contentPoolCount: 48,
        sentToFans: 156,
        storageUsed: "2.4 GB",
      }
    : {
        // Creator viewing their own stats (using Bella Rose as example)
        uploadedThisWeek: 12,
        contentPoolCount: 25,
        sentToFans: 89,
        storageUsed: "1.2 GB",
      };

  // Calculate content pool status
  const getPoolStatus = (count: number) => {
    if (count >= 20) {
      return {
        status: "Good",
        icon: "bg-emerald-500/10 ring-emerald-500/20",
        iconColor: "text-emerald-400",
      };
    } else if (count >= 10) {
      return {
        status: "Okay",
        icon: "bg-yellow-500/10 ring-yellow-500/20",
        iconColor: "text-yellow-400",
      };
    } else {
      return {
        status: "Running low",
        icon: "bg-red-500/10 ring-red-500/20",
        iconColor: "text-red-400",
      };
    }
  };

  const poolStatus = getPoolStatus(stats.contentPoolCount);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-white">
            {role === "agency_owner" ? "Content Management" : "Content Upload"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {role === "agency_owner"
              ? "Manage and overview content across all your creators"
              : "Upload photos and videos for your chatters to send to fans"}
          </p>
        </div>

        {/* Agency Owner: Creator Selector */}
        {role === "agency_owner" && (
          <Card className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-300">View Creator:</label>
              <select
                value={selectedCreator}
                onChange={(e) => setSelectedCreator(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="all">All Creators</option>
                {creators.map((creator) => (
                  <option key={creator.id} value={creator.id}>
                    {creator.name} (@{creator.username})
                  </option>
                ))}
              </select>
            </div>
          </Card>
        )}

        {/* Stats Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                <Upload className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  This Week
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Content pieces you've uploaded in the last 7 days</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl font-bold text-white">{stats.uploadedThisWeek}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ring-1 ${poolStatus.icon}`}>
                <FolderOpen className={`h-6 w-6 ${poolStatus.iconColor}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  Content Pool
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="mb-2">Available content for your chatters to send to fans</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">●</span>
                          <span>Green (20+): Well stocked</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">●</span>
                          <span>Yellow (10-19): Sufficient</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400">●</span>
                          <span>Red (&lt;10): Upload more soon</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl font-bold text-white">{stats.contentPoolCount}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  Sent to Fans
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total number of times your chatters have sent content to fans</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl font-bold text-white">{stats.sentToFans}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                <HardDrive className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  Storage Used
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current storage usage for uploaded content</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl font-bold text-white">{stats.storageUsed}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Upload Section - Creator Only */}
        {role === "creator" && (
          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-6">Upload Content</h2>

            <UploadZone onFilesUploaded={handleFilesUploaded} />

            {/* Upload Options (shown when files are selected) */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-4 border-t border-slate-800/50 pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Content Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      <option value="all">General Content</option>
                      <option value="photos">Photos</option>
                      <option value="videos">Videos</option>
                      <option value="stories">Stories</option>
                      <option value="ppv">PPV Content</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="ready">Ready for Chatters</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Caption / Description (Optional)
                  </label>
                  <textarea
                    value={contentDescription}
                    onChange={(e) => setContentDescription(e.target.value)}
                    placeholder="Add a caption or notes for your chatters..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Upload Button */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="px-6 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
                  >
                    Upload {uploadedFiles.length} {uploadedFiles.length === 1 ? 'File' : 'Files'}
                  </button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Content Library Placeholder */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Content Library</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all">
                All
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
                <ImageIcon className="h-4 w-4 inline mr-1" />
                Photos
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
                <Video className="h-4 w-4 inline mr-1" />
                Videos
              </button>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
                <FolderOpen className="h-8 w-8 text-slate-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No content yet</h3>
            <p className="text-sm text-slate-500">Upload your first photo or video to get started</p>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
}
