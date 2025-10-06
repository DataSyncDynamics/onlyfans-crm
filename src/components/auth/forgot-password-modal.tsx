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
import { Mail, CheckCircle2 } from "lucide-react";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with actual Supabase auth.resetPasswordForEmail
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Password reset requested for:", email);

      // Show success state
      setIsSubmitted(true);

      // Reset form after delay
      setTimeout(() => {
        setEmail("");
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail("");
      setIsSubmitted(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] bg-gradient-to-br from-slate-900 to-slate-900/95 border-slate-800">
        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Check Your Email</h3>
            <p className="text-slate-400">
              We&apos;ve sent password reset instructions to{" "}
              <span className="text-white">{email}</span>
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">
                Reset Password
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Enter your email address and we&apos;ll send you instructions to reset
                your password.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
                    required
                  />
                </div>
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
                      Sending...
                    </div>
                  ) : (
                    "Send Reset Link"
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
