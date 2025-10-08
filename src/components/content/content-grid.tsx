"use client";

import { useState } from "react";
import { ContentItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, Video, FolderOpen, DollarSign, Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentGridProps {
  items: ContentItem[];
  onItemClick?: (item: ContentItem) => void;
  className?: string;
}

export function ContentGrid({ items, onItemClick, className }: ContentGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'photo':
        return <Image className="h-3.5 w-3.5" />;
      case 'video':
        return <Video className="h-3.5 w-3.5" />;
      case 'photoset':
        return <FolderOpen className="h-3.5 w-3.5" />;
    }
  };

  const getTypeBadgeColor = (type: ContentItem['type']) => {
    switch (type) {
      case 'photo':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'video':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'photoset':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 mb-4">
          <FolderOpen className="h-8 w-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-400 mb-2">No content found</h3>
        <p className="text-sm text-slate-500">Try adjusting your filters or upload new content</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {items.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "group relative overflow-hidden bg-slate-900/50 border-slate-800/50 cursor-pointer transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10",
            "active:scale-95" // Mobile tap feedback
          )}
          onClick={() => onItemClick?.(item)}
        >
          {/* Thumbnail */}
          <div className="relative aspect-[3/4] bg-slate-800/50 overflow-hidden">
            {/* Skeleton loader */}
            {!loadedImages.has(item.id) && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 animate-pulse" />
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
                !loadedImages.has(item.id) && "opacity-0"
              )}
              onLoad={() => handleImageLoad(item.id)}
              loading="lazy"
            />

            {/* Video duration overlay */}
            {item.type === 'video' && item.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium">
                {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
              </div>
            )}

            {/* Photoset count overlay */}
            {item.type === 'photoset' && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-1">
                <FolderOpen className="h-3 w-3" />
                <span>{Math.floor(Math.random() * 10) + 5}</span>
              </div>
            )}

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Content Info */}
          <div className="p-3 space-y-2">
            {/* Title */}
            <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight">
              {item.title}
            </h3>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs flex items-center gap-1 min-h-[24px]",
                  getTypeBadgeColor(item.type)
                )}
              >
                {getTypeIcon(item.type)}
                <span className="capitalize">{item.type}</span>
              </Badge>

              {item.isPPV && item.ppvPrice && (
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 min-h-[24px]"
                >
                  <DollarSign className="h-3 w-3" />
                  <span>{item.ppvPrice.toFixed(0)}</span>
                </Badge>
              )}
            </div>

            {/* Stats */}
            {(item.isPPV || item.isPublic) && (
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                {item.isPPV && item.ppvPurchases !== undefined && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{item.ppvPurchases}</span>
                  </div>
                )}
                {item.isPublic && (
                  <>
                    {item.publicViews !== undefined && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.publicViews}</span>
                      </div>
                    )}
                    {item.likes !== undefined && (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{item.likes}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
