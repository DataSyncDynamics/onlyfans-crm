"use client";

import { useState } from "react";
import { ContentItem, ContentCollection } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Image, Video, FolderOpen, DollarSign, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentFiltersState {
  search: string;
  type: ContentItem['type'] | 'all';
  isPPV: boolean | 'all';
  collection: string | 'all';
  sortBy: 'recent' | 'popular' | 'revenue';
}

interface ContentFiltersProps {
  filters: ContentFiltersState;
  onFiltersChange: (filters: ContentFiltersState) => void;
  collections?: ContentCollection[];
  className?: string;
}

export function ContentFilters({
  filters,
  onFiltersChange,
  collections = [],
  className,
}: ContentFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof ContentFiltersState>(
    key: K,
    value: ContentFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      type: 'all',
      isPPV: 'all',
      collection: 'all',
      sortBy: 'recent',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.type !== 'all' ||
    filters.isPPV !== 'all' ||
    filters.collection !== 'all' ||
    filters.sortBy !== 'recent';

  const activeFilterCount = [
    filters.search !== '',
    filters.type !== 'all',
    filters.isPPV !== 'all',
    filters.collection !== 'all',
    filters.sortBy !== 'recent',
  ].filter(Boolean).length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Filter Bar - Always Visible */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search content..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10 h-12 bg-slate-900/50 border-slate-800/50 text-white placeholder-slate-500 focus:border-purple-500"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Type Filter - Mobile Friendly Buttons */}
        <div className="flex gap-2 md:hidden">
          <Button
            variant={filters.type === 'all' ? 'default' : 'outline'}
            size="default"
            onClick={() => updateFilter('type', 'all')}
            className={cn(
              "flex-1 min-h-[44px]",
              filters.type === 'all'
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-slate-900/50 border-slate-800/50 text-slate-300"
            )}
          >
            All
          </Button>
          <Button
            variant={filters.type === 'photo' ? 'default' : 'outline'}
            size="default"
            onClick={() => updateFilter('type', 'photo')}
            className={cn(
              "flex-1 min-h-[44px]",
              filters.type === 'photo'
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-slate-900/50 border-slate-800/50 text-slate-300"
            )}
          >
            <Image className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Photos</span>
          </Button>
          <Button
            variant={filters.type === 'video' ? 'default' : 'outline'}
            size="default"
            onClick={() => updateFilter('type', 'video')}
            className={cn(
              "flex-1 min-h-[44px]",
              filters.type === 'video'
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-slate-900/50 border-slate-800/50 text-slate-300"
            )}
          >
            <Video className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Videos</span>
          </Button>
        </div>

        {/* Desktop Type Buttons */}
        <div className="hidden md:flex gap-2">
          <Button
            variant={filters.type === 'all' ? 'default' : 'outline'}
            size="default"
            onClick={() => updateFilter('type', 'all')}
            className={cn(
              "min-h-[44px]",
              filters.type === 'all'
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-slate-900/50 border-slate-800/50 text-slate-300"
            )}
          >
            All
          </Button>
          <Button
            variant={filters.type === 'photo' ? 'default' : 'outline'}
            size="default"
            onClick={() => updateFilter('type', 'photo')}
            className={cn(
              "min-h-[44px]",
              filters.type === 'photo'
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-slate-900/50 border-slate-800/50 text-slate-300"
            )}
          >
            <Image className="h-4 w-4 mr-2" />
            Photos
          </Button>
          <Button
            variant={filters.type === 'video' ? 'default' : 'outline'}
            size="default"
            onClick={() => updateFilter('type', 'video')}
            className={cn(
              "min-h-[44px]",
              filters.type === 'video'
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-slate-900/50 border-slate-800/50 text-slate-300"
            )}
          >
            <Video className="h-4 w-4 mr-2" />
            Videos
          </Button>
          <Button
            variant={filters.type === 'photoset' ? 'default' : 'outline'}
            size="default"
            onClick={() => updateFilter('type', 'photoset')}
            className={cn(
              "min-h-[44px]",
              filters.type === 'photoset'
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-slate-900/50 border-slate-800/50 text-slate-300"
            )}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Sets
          </Button>
        </div>

        {/* More Filters Toggle */}
        <Button
          variant="outline"
          size="default"
          onClick={() => setIsExpanded(!isExpanded)}
          className="min-h-[44px] bg-slate-900/50 border-slate-800/50 text-slate-300 hover:bg-slate-800"
        >
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-purple-500 text-white border-0 h-5 min-w-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/30 border border-slate-800/50 rounded-lg">
          {/* PPV Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              PPV Status
            </label>
            <Select
              value={String(filters.isPPV)}
              onValueChange={(value) =>
                updateFilter('isPPV', value === 'all' ? 'all' : value === 'true')
              }
            >
              <SelectTrigger className="h-12 bg-slate-900/50 border-slate-800/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="true">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    PPV Only
                  </div>
                </SelectItem>
                <SelectItem value="false">Free Content</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Collection Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Collection
            </label>
            <Select
              value={filters.collection}
              onValueChange={(value) => updateFilter('collection', value)}
            >
              <SelectTrigger className="h-12 bg-slate-900/50 border-slate-800/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name} ({collection.itemCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sort By
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                updateFilter('sortBy', value as ContentFiltersState['sortBy'])
              }
            >
              <SelectTrigger className="h-12 bg-slate-900/50 border-slate-800/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="revenue">Highest Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="md:col-span-3 flex justify-end">
              <Button
                variant="outline"
                size="default"
                onClick={clearFilters}
                className="min-h-[44px] bg-slate-900/50 border-slate-800/50 text-slate-300 hover:bg-slate-800"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
