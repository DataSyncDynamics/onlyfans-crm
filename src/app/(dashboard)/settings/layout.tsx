"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Building2, Bell, ChevronLeft } from "lucide-react";

const settingsNav = [
  {
    name: "Profile",
    href: "/settings/profile",
    icon: User,
    description: "Manage your personal account",
  },
  {
    name: "Agency",
    href: "/settings/agency",
    icon: Building2,
    description: "Business and team settings",
  },
  {
    name: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
    description: "Alert preferences and channels",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* Sidebar Navigation - Desktop */}
        <nav className="hidden space-y-1 lg:block">
          {settingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-start gap-3 rounded-lg border p-4 transition-all duration-200",
                  isActive
                    ? "border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                    : "border-slate-800/50 bg-slate-900/30 hover:border-slate-700/50 hover:bg-slate-800/50"
                )}
              >
                <Icon
                  className={cn(
                    "mt-0.5 h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                  )}
                />
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-white" : "text-slate-200"
                    )}
                  >
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <select
            value={pathname}
            onChange={(e) => window.location.href = e.target.value}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          >
            {settingsNav.map((item) => (
              <option key={item.href} value={item.href}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <main className="min-w-0">
          <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
