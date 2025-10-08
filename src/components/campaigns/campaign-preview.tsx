"use client";

import { Smartphone, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CampaignPreviewProps {
  message: string;
  mediaUrls: string[];
  ppvPrice?: number;
  creatorName: string;
  creatorAvatar: string;
}

export function CampaignPreview({
  message,
  mediaUrls,
  ppvPrice,
  creatorName,
  creatorAvatar,
}: CampaignPreviewProps) {
  // Replace personalization tags with example values
  const previewMessage = message
    .replace(/{firstName}/g, "John")
    .replace(/{spentTotal}/g, "$1,234")
    .replace(/{lastPurchase}/g, "3 days ago");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Smartphone className="h-4 w-4" />
        <span>Preview (as seen by fans)</span>
      </div>

      {/* iPhone Mockup */}
      <div className="mx-auto max-w-[375px] rounded-[2.5rem] border-[8px] border-slate-800 bg-slate-900 p-4 shadow-2xl">
        {/* iPhone Notch */}
        <div className="mx-auto mb-4 h-6 w-32 rounded-b-3xl bg-slate-950" />

        {/* OnlyFans Message UI */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-500 overflow-hidden">
                <img
                  src={creatorAvatar || "/avatars/placeholder.jpg"}
                  alt={creatorName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {creatorName}
                </div>
                <div className="text-xs text-slate-400">Active now</div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            {/* Text Message */}
            <div className="rounded-2xl rounded-tl-sm bg-purple-600 p-3">
              <p className="text-sm text-white whitespace-pre-wrap">
                {previewMessage}
              </p>
            </div>

            {/* Media Preview */}
            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {mediaUrls.slice(0, 4).map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-slate-800"
                  >
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {ppvPrice && ppvPrice > 0 && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            ${ppvPrice}
                          </div>
                          <div className="text-xs text-slate-300">
                            Unlock to view
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* PPV Unlock Button */}
            {ppvPrice && ppvPrice > 0 && (
              <button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-sm font-semibold text-white shadow-lg">
                Unlock for ${ppvPrice}
              </button>
            )}
          </div>

          {/* Message Info */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>Just now</span>
            {ppvPrice && ppvPrice > 0 && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                PPV Message
              </Badge>
            )}
          </div>
        </div>

        {/* iPhone Home Indicator */}
        <div className="mx-auto mt-4 h-1 w-32 rounded-full bg-slate-700" />
      </div>

      {/* Preview Notes */}
      <div className="text-xs text-slate-400 text-center">
        Personalization tags will be replaced with actual fan data
      </div>
    </div>
  );
}
