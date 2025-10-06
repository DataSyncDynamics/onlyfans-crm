"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, Mail, Sparkles } from "lucide-react";
import { RequestInviteModal } from "@/components/auth/request-invite-modal";
import { ForgotPasswordModal } from "@/components/auth/forgot-password-modal";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRequestInvite, setShowRequestInvite] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate form
      if (!email || !password) {
        setError("Please enter your email and password");
        setIsLoading(false);
        return;
      }

      // Try Supabase authentication
      const { error: authError } = await signIn(email, password);

      if (authError) {
        // If Supabase fails, check demo credentials as fallback
        if (email === "demo@vaultcrm.io" && password === "demo123") {
          // Demo mode - redirect to dashboard
          router.push("/");
        } else {
          setError("Invalid email or password");
        }
      } else {
        // Supabase auth successful
        router.push("/");
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">VaultCRM</h1>
          <p className="mt-2 text-sm text-slate-400">
            Powered by DataSync Dynamics
          </p>
        </div>

        {/* Login Form */}
        <div className="animate-slide-up rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-slate-700 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-slate-400 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold h-11"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="px-4 text-xs text-slate-500">OR</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          {/* Request Invite */}
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-3">
              Don&apos;t have access yet?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRequestInvite(true)}
              className="w-full border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Request Invite
            </Button>
          </div>

          {/* Demo Credentials Hint */}
          <div className="mt-6 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
            <p className="text-xs text-blue-400 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-slate-400">Email: demo@vaultcrm.io</p>
            <p className="text-xs text-slate-400">Password: demo123</p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          © 2025 DataSync Dynamics. All rights reserved.
        </p>
      </div>

      {/* Modals */}
      <RequestInviteModal
        open={showRequestInvite}
        onClose={() => setShowRequestInvite(false)}
      />
      <ForgotPasswordModal
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
