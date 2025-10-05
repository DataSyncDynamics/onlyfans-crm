"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Creator } from "@/types";
import { User, DollarSign, Tag, CheckCircle2, Loader2 } from "lucide-react";

interface AddCreatorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (creator: Omit<Creator, "id" | "totalRevenue" | "totalFans" | "activeFans" | "joinedAt">) => Promise<string>; // Returns creator ID
  onConnectRequested?: (creatorId: string, ofUsername: string) => void;
}

const AVAILABLE_TAGS = [
  "luxury",
  "top-performer",
  "exclusive",
  "artistic",
  "daily-posts",
  "engaging",
  "gaming",
  "interactive",
  "rising-star",
  "fitness",
  "lifestyle",
  "cosplay",
];

export function AddCreatorModal({ open, onClose, onSubmit, onConnectRequested }: AddCreatorModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdCreatorId, setCreatedCreatorId] = useState<string | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [ofUsername, setOfUsername] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "suspended">("active");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!displayName.trim()) {
      newErrors.displayName = "Display name is required";
    } else if (displayName.length < 2 || displayName.length > 50) {
      newErrors.displayName = "Display name must be between 2 and 50 characters";
    }

    if (!ofUsername.trim()) {
      newErrors.ofUsername = "OnlyFans username is required";
    } else if (!ofUsername.startsWith("@")) {
      newErrors.ofUsername = "Username must start with @";
    } else if (ofUsername.length < 3 || ofUsername.length > 30) {
      newErrors.ofUsername = "Username must be between 3 and 30 characters";
    } else if (!/^@[a-zA-Z0-9_]+$/.test(ofUsername)) {
      newErrors.ofUsername = "Username can only contain letters, numbers, and underscores";
    }

    if (!subscriptionPrice.trim()) {
      newErrors.subscriptionPrice = "Subscription price is required";
    } else {
      const price = parseFloat(subscriptionPrice);
      if (isNaN(price) || price <= 0) {
        newErrors.subscriptionPrice = "Price must be greater than 0";
      } else if (!/^\d+(\.\d{1,2})?$/.test(subscriptionPrice)) {
        newErrors.subscriptionPrice = "Price can have maximum 2 decimal places";
      }
    }

    if (bio.length > 200) {
      newErrors.bio = "Bio must be 200 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Generate username from display name if not provided
    const username = displayName.toLowerCase().replace(/\s+/g, "");

    const newCreator: Omit<Creator, "id" | "totalRevenue" | "totalFans" | "activeFans" | "joinedAt"> = {
      username,
      displayName: displayName.trim(),
      ofUsername: ofUsername.trim(),
      subscriptionPrice: parseFloat(subscriptionPrice),
      bio: bio.trim() || undefined,
      status,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const creatorId = await onSubmit(newCreator);
    setCreatedCreatorId(creatorId);
    setSuccess(true);
    setLoading(false);
  };

  const handleClose = () => {
    // Reset form
    setStep(1);
    setDisplayName("");
    setOfUsername("");
    setSubscriptionPrice("");
    setBio("");
    setStatus("active");
    setSelectedTags([]);
    setCustomTag("");
    setErrors({});
    setSuccess(false);
    setLoading(false);
    setCreatedCreatorId(null);
    onClose();
  };

  const handleConnectNow = () => {
    if (createdCreatorId && onConnectRequested) {
      onConnectRequested(createdCreatorId, ofUsername);
      handleClose();
    }
  };

  const handleSkipConnection = () => {
    handleClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const tag = customTag.trim().toLowerCase();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setCustomTag("");
    }
  };

  const handleOfUsernameChange = (value: string) => {
    // Auto-add @ if not present
    if (value && !value.startsWith("@")) {
      setOfUsername("@" + value);
    } else {
      setOfUsername(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="h-6 w-6 text-purple-400" />
            Add New Creator
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {step === 1 ? "Enter the creator's basic information" : "Configure additional settings"}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-6">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white">Creator Added Successfully!</h3>
              <p className="text-slate-400 mt-2">Would you like to connect their OnlyFans account now?</p>
            </div>

            <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 w-full">
              <p className="text-sm text-purple-300 text-center">
                Connecting now will sync revenue data, fans, and transactions automatically
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={handleSkipConnection}
                className="flex-1"
              >
                Skip for Now
              </Button>
              <Button
                onClick={handleConnectNow}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Connect OnlyFans
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-purple-500" : "bg-slate-800"}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-purple-500" : "bg-slate-800"}`} />
            </div>

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">
                    Display Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="displayName"
                    placeholder="e.g., Stella Rose"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={errors.displayName ? "border-red-500" : ""}
                  />
                  {errors.displayName && (
                    <p className="text-sm text-red-500">{errors.displayName}</p>
                  )}
                  <p className="text-xs text-slate-500">The name that will be displayed in the CRM</p>
                </div>

                {/* OnlyFans Username */}
                <div className="space-y-2">
                  <Label htmlFor="ofUsername">
                    OnlyFans Username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ofUsername"
                    placeholder="@StellaRose"
                    value={ofUsername}
                    onChange={(e) => handleOfUsernameChange(e.target.value)}
                    className={errors.ofUsername ? "border-red-500" : ""}
                  />
                  {errors.ofUsername && (
                    <p className="text-sm text-red-500">{errors.ofUsername}</p>
                  )}
                  <p className="text-xs text-slate-500">Their username on OnlyFans (starts with @)</p>
                </div>

                {/* Subscription Price */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionPrice">
                    Subscription Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="subscriptionPrice"
                      type="number"
                      step="0.01"
                      placeholder="9.99"
                      value={subscriptionPrice}
                      onChange={(e) => setSubscriptionPrice(e.target.value)}
                      className={`pl-9 ${errors.subscriptionPrice ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.subscriptionPrice && (
                    <p className="text-sm text-red-500">{errors.subscriptionPrice}</p>
                  )}
                  <p className="text-xs text-slate-500">Monthly subscription price</p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Bio (Optional)
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="e.g., Top performer. Luxury lifestyle & exclusive content."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className={errors.bio ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio}</p>
                  )}
                  <p className="text-xs text-slate-500">{bio.length}/200 characters</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Configuration */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">Current creator status</p>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags (Optional)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`
                          rounded-full px-3 py-1 text-xs font-medium transition-all
                          ${
                            selectedTags.includes(tag)
                              ? "bg-purple-500 text-white ring-2 ring-purple-400"
                              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                          }
                        `}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Custom Tag Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCustomTag}
                      disabled={!customTag.trim()}
                    >
                      Add
                    </Button>
                  </div>

                  {/* Selected Tags */}
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400 ring-1 ring-purple-500/20"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className="ml-1 hover:text-purple-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding Creator...
                        </>
                      ) : (
                        "Add Creator"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
