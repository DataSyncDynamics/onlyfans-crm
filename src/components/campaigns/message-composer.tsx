"use client";

import { useState } from "react";
import { Smile, Hash, Image, Video, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onMediaAdd: (files: string[]) => void;
  mediaUrls: string[];
  onMediaRemove: (url: string) => void;
}

const PERSONALIZATION_TAGS = [
  { tag: "{firstName}", label: "First Name", example: "John" },
  { tag: "{spentTotal}", label: "Total Spent", example: "$1,234" },
  { tag: "{lastPurchase}", label: "Last Purchase", example: "3 days ago" },
];

const TEMPLATE_MESSAGES = [
  {
    id: "ppv-exclusive",
    name: "PPV - Exclusive Content",
    message:
      "Hey {firstName}! 🔥 Just shot something EXCLUSIVE for my VIPs... You've been so supportive ($spent total!), I think you'll love this 😘",
  },
  {
    id: "ppv-beach",
    name: "PPV - Beach Photoshoot",
    message:
      "Hiiii {firstName} 💕 Just finished my beach photoshoot and the photos came out AMAZING 🌊 Want to see? 👀",
  },
  {
    id: "reengagement",
    name: "Re-engagement",
    message:
      "Hey {firstName}! I noticed you haven't been around lately... I miss you! 🥺 I have some new content I think you'd really enjoy 😊",
  },
  {
    id: "welcome",
    name: "Welcome Message",
    message:
      "Welcome {firstName}! 🎉 I'm so excited to have you here! Feel free to message me anytime, I love chatting with my fans 💕",
  },
];

export function MessageComposer({
  value,
  onChange,
  onMediaAdd,
  mediaUrls,
  onMediaRemove,
}: MessageComposerProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleInsertTag = (tag: string) => {
    const cursorPosition = value.length;
    const newValue = value + tag;
    onChange(newValue);
  };

  const handleTemplateSelect = (template: string) => {
    onChange(template);
    setShowTemplates(false);
  };

  const characterCount = value.length;
  const maxCharacters = 1000;

  return (
    <div className="space-y-4">
      {/* Template Selector */}
      <div>
        <Label className="text-sm font-medium text-white mb-2 block">
          Message Template (Optional)
        </Label>
        <div className="relative">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full text-left px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {showTemplates ? "Hide templates" : "Choose a template..."}
          </button>

          {showTemplates && (
            <div className="absolute z-10 w-full mt-2 p-2 rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
              {TEMPLATE_MESSAGES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.message)}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition-colors group"
                >
                  <div className="text-sm font-medium text-white mb-1">
                    {template.name}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-2">
                    {template.message}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div>
        <Label className="text-sm font-medium text-white mb-2 block">
          Message
        </Label>
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your message... Use personalization tags to make it more engaging!"
            className="w-full min-h-[150px] p-4 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            maxLength={maxCharacters}
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400">
            {characterCount}/{maxCharacters}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Personalization Tags */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPersonalization(!showPersonalization)}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-800"
          >
            <Hash className="h-4 w-4 mr-1" />
            Personalize
          </Button>

          {showPersonalization && (
            <div className="absolute z-10 mt-2 p-2 rounded-lg border border-slate-700 bg-slate-900 shadow-xl min-w-[200px]">
              {PERSONALIZATION_TAGS.map((item) => (
                <button
                  key={item.tag}
                  onClick={() => {
                    handleInsertTag(item.tag);
                    setShowPersonalization(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="text-sm font-medium text-white">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-400">
                    {item.tag} → {item.example}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Emoji Picker Placeholder */}
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800/50 border-slate-700 hover:bg-slate-800"
        >
          <Smile className="h-4 w-4 mr-1" />
          Emoji
        </Button>

        {/* Media Upload */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              const urls = files.map((f) => URL.createObjectURL(f));
              onMediaAdd(urls);
            }}
          />
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-800"
          >
            <span>
              <Image className="h-4 w-4 mr-1" />
              Add Media
            </span>
          </Button>
        </label>
      </div>

      {/* Media Preview */}
      {mediaUrls.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-white mb-2 block">
            Attached Media ({mediaUrls.length})
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mediaUrls.map((url, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border border-slate-700"
              >
                <img
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onMediaRemove(url)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Info */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-2">
          <div className="text-xs text-blue-400">
            <strong>Tip:</strong> Messages with personalization tags have 35%
            higher open rates. Media attachments increase engagement by 60%.
          </div>
        </div>
      </div>
    </div>
  );
}
