"use client";

import { useState, useMemo } from "react";
import { useRole } from "@/contexts/role-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentGrid } from "@/components/content/content-grid";
import { ContentFilters, ContentFiltersState } from "@/components/content/content-filters";
import { ContentDetailModal } from "@/components/content/content-detail-modal";
import { PPVAnalyticsDashboard } from "@/components/content/ppv-analytics-dashboard";
import { UploadZone } from "@/components/content/upload-zone";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  TrendingUp,
  FolderOpen,
  HardDrive,
  Info,
  Plus,
  Grid3x3,
  BarChart3,
} from "lucide-react";
import { ContentItem, ContentCollection, ContentAnalytics } from "@/types";

// Mock data - will be replaced with real data from mock-data.ts
const MOCK_CONTENT_ITEMS: ContentItem[] = [
  {
    id: "1",
    creatorId: "creator1",
    type: "photo",
    title: "Sunset Beach Photoshoot",
    description: "Beautiful sunset photos from my beach vacation",
    fileUrl: "/content/photo1.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    fileSize: 2500000,
    uploadedAt: new Date("2025-10-01"),
    tags: ["beach", "sunset", "vacation"],
    collections: ["col1"],
    isPPV: true,
    ppvPrice: 15,
    ppvPurchases: 45,
    ppvRevenue: 675,
    isPublic: false,
    status: "active",
  },
  {
    id: "2",
    creatorId: "creator1",
    type: "video",
    title: "Workout Routine Video",
    description: "My daily morning workout routine",
    fileUrl: "/content/video1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    fileSize: 15000000,
    duration: 180,
    uploadedAt: new Date("2025-09-28"),
    tags: ["workout", "fitness", "morning"],
    collections: [],
    isPPV: true,
    ppvPrice: 25,
    ppvPurchases: 32,
    ppvRevenue: 800,
    isPublic: false,
    status: "active",
  },
  {
    id: "3",
    creatorId: "creator1",
    type: "photoset",
    title: "Fashion Week Behind the Scenes",
    description: "Exclusive BTS from fashion week",
    fileUrl: "/content/photoset1.zip",
    thumbnailUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop",
    fileSize: 8500000,
    uploadedAt: new Date("2025-09-25"),
    tags: ["fashion", "bts", "exclusive"],
    collections: ["col1", "col2"],
    isPPV: true,
    ppvPrice: 30,
    ppvPurchases: 28,
    ppvRevenue: 840,
    isPublic: false,
    status: "active",
  },
  {
    id: "4",
    creatorId: "creator1",
    type: "photo",
    title: "Morning Coffee",
    description: "Casual morning vibes",
    fileUrl: "/content/photo2.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
    fileSize: 1800000,
    uploadedAt: new Date("2025-10-05"),
    tags: ["casual", "morning", "lifestyle"],
    collections: [],
    isPPV: false,
    isPublic: true,
    publicViews: 1250,
    likes: 342,
    status: "active",
  },
  {
    id: "5",
    creatorId: "creator1",
    type: "video",
    title: "Day in My Life Vlog",
    description: "Follow me through a typical day",
    fileUrl: "/content/video2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop",
    fileSize: 22000000,
    duration: 420,
    uploadedAt: new Date("2025-10-03"),
    tags: ["vlog", "lifestyle", "daily"],
    collections: ["col2"],
    isPPV: false,
    isPublic: true,
    publicViews: 2100,
    likes: 567,
    status: "active",
  },
  {
    id: "6",
    creatorId: "creator1",
    type: "photo",
    title: "Studio Portraits",
    description: "Professional studio session",
    fileUrl: "/content/photo3.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop",
    fileSize: 3200000,
    uploadedAt: new Date("2025-09-20"),
    tags: ["studio", "portrait", "professional"],
    collections: ["col1"],
    isPPV: true,
    ppvPrice: 20,
    ppvPurchases: 38,
    ppvRevenue: 760,
    isPublic: false,
    status: "active",
  },
];

const MOCK_COLLECTIONS: ContentCollection[] = [
  {
    id: "col1",
    creatorId: "creator1",
    name: "Premium Content",
    description: "High-quality exclusive content",
    coverImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    itemCount: 12,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-10-01"),
  },
  {
    id: "col2",
    creatorId: "creator1",
    name: "Behind the Scenes",
    description: "Exclusive BTS content",
    coverImageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
    itemCount: 8,
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-10-03"),
  },
];

// Mock analytics calculator
const getContentAnalytics = (items: ContentItem[]): ContentAnalytics => {
  const ppvItems = items.filter((i) => i.isPPV);
  return {
    totalItems: items.length,
    totalSize: items.reduce((sum, i) => sum + i.fileSize, 0),
    ppvItems: ppvItems.length,
    ppvRevenue: ppvItems.reduce((sum, i) => sum + (i.ppvRevenue || 0), 0),
    publicItems: items.filter((i) => i.isPublic).length,
    totalViews: items.reduce((sum, i) => sum + (i.publicViews || 0), 0),
    totalLikes: items.reduce((sum, i) => sum + (i.likes || 0), 0),
    topPerformingItems: [...items]
      .filter((i) => i.isPPV)
      .sort((a, b) => (b.ppvRevenue || 0) - (a.ppvRevenue || 0)),
    revenueByMonth: [
      { month: "May", revenue: 2100 },
      { month: "Jun", revenue: 2850 },
      { month: "Jul", revenue: 3200 },
      { month: "Aug", revenue: 2950 },
      { month: "Sep", revenue: 3575 },
      { month: "Oct", revenue: 3075 },
    ],
  };
};

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

export default function ContentPage() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<ContentFiltersState>({
    search: '',
    type: 'all',
    isPPV: 'all',
    collection: 'all',
    sortBy: 'recent',
  });

  // Mock creators data
  const creators = [
    { id: "1", name: "Bella Rose", username: "bella_rose" },
    { id: "2", name: "Luna Star", username: "luna_star" },
    { id: "3", name: "Mia Rivers", username: "mia_rivers" },
  ];

  // Mock stats per creator
  const creatorStats = {
    "1": {
      uploadedThisWeek: 12,
      contentPoolCount: 25,
      sentToFans: 89,
      storageUsed: "1.2 GB",
    },
    "2": {
      uploadedThisWeek: 8,
      contentPoolCount: 15,
      sentToFans: 45,
      storageUsed: "800 MB",
    },
    "3": {
      uploadedThisWeek: 4,
      contentPoolCount: 8,
      sentToFans: 22,
      storageUsed: "450 MB",
    },
  };

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let filtered = [...MOCK_CONTENT_ITEMS];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter((item) => item.type === filters.type);
    }

    // PPV filter
    if (filters.isPPV !== 'all') {
      filtered = filtered.filter((item) => item.isPPV === filters.isPPV);
    }

    // Collection filter
    if (filters.collection !== 'all') {
      filtered = filtered.filter((item) => item.collections.includes(filters.collection));
    }

    // Sort
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => {
          const aPopularity = (a.publicViews || 0) + (a.ppvPurchases || 0);
          const bPopularity = (b.publicViews || 0) + (b.ppvPurchases || 0);
          return bPopularity - aPopularity;
        });
        break;
      case 'revenue':
        filtered.sort((a, b) => (b.ppvRevenue || 0) - (a.ppvRevenue || 0));
        break;
    }

    return filtered;
  }, [filters]);

  // Calculate stats based on selected creator
  const stats = role === "agency_owner" && selectedCreator !== "all"
    ? creatorStats[selectedCreator as keyof typeof creatorStats]
    : role === "agency_owner"
    ? {
        uploadedThisWeek: 24,
        contentPoolCount: 48,
        sentToFans: 156,
        storageUsed: "2.4 GB",
      }
    : {
        uploadedThisWeek: 12,
        contentPoolCount: 25,
        sentToFans: 89,
        storageUsed: "1.2 GB",
      };

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
  const analytics = getContentAnalytics(MOCK_CONTENT_ITEMS);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Content Vault
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your content library and track PPV performance
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
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none min-h-[44px]"
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
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 animate-slide-up">
          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                <Upload className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400">
                  This Week
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Content pieces uploaded in the last 7 days</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{stats.uploadedThisWeek}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg ring-1 ${poolStatus.icon}`}>
                <FolderOpen className={`h-5 w-5 md:h-6 md:w-6 ${poolStatus.iconColor}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400">
                  Content Pool
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{stats.contentPoolCount}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400">
                  Sent to Fans
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{stats.sentToFans}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/30 border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                <HardDrive className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400">
                  Storage
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{stats.storageUsed}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all" className="flex-1 md:flex-none">
                <Grid3x3 className="h-4 w-4 mr-2" />
                All Content
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex-1 md:flex-none">
                <FolderOpen className="h-4 w-4 mr-2" />
                Collections
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1 md:flex-none">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <Button
              size="lg"
              onClick={() => setShowUploadModal(true)}
              className="min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Content
            </Button>
          </div>

          {/* All Content Tab */}
          <TabsContent value="all">
            <div className="space-y-6">
              <ContentFilters
                filters={filters}
                onFiltersChange={setFilters}
                collections={MOCK_COLLECTIONS}
              />
              <ContentGrid
                items={filteredContent}
                onItemClick={setSelectedItem}
              />
            </div>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_COLLECTIONS.map((collection) => (
                <Card
                  key={collection.id}
                  className="group relative overflow-hidden bg-slate-900/50 border-slate-800/50 cursor-pointer transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="relative aspect-video bg-slate-800/50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={collection.coverImageUrl}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white mb-1">{collection.name}</h3>
                      <p className="text-sm text-slate-300">{collection.itemCount} items</p>
                    </div>
                  </div>
                  {collection.description && (
                    <div className="p-4">
                      <p className="text-sm text-slate-400">{collection.description}</p>
                    </div>
                  )}
                </Card>
              ))}

              {/* Add Collection Card */}
              <Card className="group relative overflow-hidden bg-slate-900/50 border-slate-800/50 border-dashed cursor-pointer transition-all hover:border-purple-500/50 hover:bg-slate-800/50 flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 ring-1 ring-purple-500/20">
                      <Plus className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300 group-hover:text-white transition-colors">
                    Create Collection
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Organize your content</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <PPVAnalyticsDashboard analytics={analytics} />
          </TabsContent>
        </Tabs>

        {/* Upload Modal (placeholder) */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-6 bg-slate-900 border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Upload Content</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 text-slate-400 rotate-45" />
                </button>
              </div>
              <UploadZone onFilesUploaded={() => {}} />
            </Card>
          </div>
        )}

        {/* Content Detail Modal */}
        <ContentDetailModal
          item={selectedItem}
          isOpen={selectedItem !== null}
          onClose={() => setSelectedItem(null)}
          collections={MOCK_COLLECTIONS}
        />
      </div>
    </TooltipProvider>
  );
}
