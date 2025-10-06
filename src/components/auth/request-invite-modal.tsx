"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

interface RequestInviteModalProps {
  open: boolean;
  onClose: () => void;
}

export function RequestInviteModal({ open, onClose }: RequestInviteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with actual Supabase insert to invite_requests table
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Invite request:", formData);

      // Show success state
      setIsSubmitted(true);

      // Reset form after delay
      setTimeout(() => {
        setFormData({ name: "", email: "", company: "", message: "" });
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit invite request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: "", email: "", company: "", message: "" });
      setIsSubmitted(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-900 to-slate-900/95 border-slate-800">
        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Request Submitted!
            </h3>
            <p className="text-slate-400">
              We&apos;ll review your request and get back to you soon.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">
                Request Invite
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Fill out this form and we&apos;ll get back to you about access to the
                platform.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-email" className="text-slate-300">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-slate-300">
                  Company/Agency Name
                </Label>
                <Input
                  id="company"
                  placeholder="My OF Agency"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-300">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your agency and why you'd like access..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
