"use client";

import { useState } from "react";
import { ContentItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Image,
  Video,
  FolderOpen,
  DollarSign,
  Eye,
  Heart,
  Calendar,
  Tag,
  Edit2,
  Trash2,
} from "lucide-react";

interface ContentDetailModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (itemId: string) => void;
  collections?: Array<{ id: string; name: string }>;
}

export function ContentDetailModal({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  collections = [],
}: ContentDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  if (!item) return null;

  const handleEdit = () => {
    setEditedTitle(item.title);
    setEditedDescription(item.description || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit({
        ...item,
        title: editedTitle,
        description: editedDescription,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this content?")) {
      onDelete(item.id);
      onClose();
    }
  };

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'photo':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'photoset':
        return <FolderOpen className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {getTypeIcon(item.type)}
            Content Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview */}
          <div className="relative aspect-video bg-slate-800/50 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-contain"
            />
            {item.type === 'video' && item.duration && (
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 text-white text-sm font-medium">
                {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title
                  </label>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                {item.description && (
                  <p className="text-slate-300">{item.description}</p>
                )}
              </>
            )}
          </div>

          {/* Badges & Info */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-sm flex items-center gap-1.5",
                item.type === 'photo' && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                item.type === 'video' && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                item.type === 'photoset' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              )}
            >
              {getTypeIcon(item.type)}
              <span className="capitalize">{item.type}</span>
            </Badge>

            {item.isPPV && (
              <Badge
                variant="outline"
                className="text-sm flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              >
                <DollarSign className="h-4 w-4" />
                PPV - ${item.ppvPrice?.toFixed(2)}
              </Badge>
            )}

            <Badge
              variant="outline"
              className={cn(
                "text-sm",
                item.status === 'active' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                item.status === 'draft' && "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                item.status === 'archived' && "bg-slate-500/10 text-slate-400 border-slate-500/20"
              )}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* File Size */}
            <div className="p-4 bg-slate-800/30 border border-slate-800/50 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">File Size</div>
              <div className="text-lg font-semibold text-white">
                {formatFileSize(item.fileSize)}
              </div>
            </div>

            {/* Upload Date */}
            <div className="p-4 bg-slate-800/30 border border-slate-800/50 rounded-lg">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Uploaded
              </div>
              <div className="text-lg font-semibold text-white">
                {formatDate(item.uploadedAt)}
              </div>
            </div>

            {/* PPV Analytics */}
            {item.isPPV && (
              <>
                <div className="p-4 bg-slate-800/30 border border-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Purchases
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {item.ppvPurchases || 0}
                  </div>
                </div>
                <div className="p-4 bg-slate-800/30 border border-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Revenue
                  </div>
                  <div className="text-lg font-semibold text-emerald-400">
                    ${item.ppvRevenue?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </>
            )}

            {/* Public Stats */}
            {item.isPublic && (
              <>
                <div className="p-4 bg-slate-800/30 border border-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Views
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {item.publicViews?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="p-4 bg-slate-800/30 border border-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    Likes
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {item.likes?.toLocaleString() || 0}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-slate-800/50 text-slate-300 border-slate-700"
                >
                  {tag}
                </Badge>
              ))}
              {item.tags.length === 0 && (
                <span className="text-sm text-slate-500">No tags added</span>
              )}
            </div>
          </div>

          {/* Collections */}
          {item.collections.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Collections
              </label>
              <div className="flex flex-wrap gap-2">
                {item.collections.map((collectionId) => {
                  const collection = collections.find((c) => c.id === collectionId);
                  return (
                    <Badge
                      key={collectionId}
                      variant="outline"
                      className="bg-purple-500/10 text-purple-400 border-purple-500/20"
                    >
                      {collection?.name || collectionId}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 min-h-[44px] bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  onClick={handleSave}
                  className="flex-1 min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleDelete}
                  className="min-h-[44px] bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleEdit}
                  className="flex-1 min-h-[44px] bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="lg"
                  onClick={onClose}
                  className="flex-1 min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                >
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
