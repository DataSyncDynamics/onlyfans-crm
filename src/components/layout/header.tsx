"use client";

import { Bell, ChevronRight, Command, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CommandPalette } from "@/components/ui/command-palette";

// Map routes to breadcrumb labels
const routeLabels: Record<string, string> = {
  "/": "Overview",
  "/creators": "Creators",
  "/fans": "Fans",
  "/revenue": "Revenue",
  "/chatters": "Chatters",
  "/marketing": "Marketing",
  "/alerts": "Alerts",
};

export function Header() {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Generate breadcrumbs from pathname
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => {
      const path = "/" + arr.slice(0, index + 1).join("/");
      return {
        label: routeLabels[path] || segment.charAt(0).toUpperCase() + segment.slice(1),
        path,
      };
    });

  // Add home if not on home page
  if (pathname !== "/") {
    breadcrumbs.unshift({ label: "Overview", path: "/" });
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-slate-800/50 bg-slate-950 px-4 lg:px-6">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {pathname === "/" ? (
            <h2 className="text-lg font-semibold text-slate-50">Overview</h2>
          ) : (
            <nav className="flex items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      index === breadcrumbs.length - 1
                        ? "text-slate-50"
                        : "text-slate-500"
                    )}
                  >
                    {crumb.label}
                  </span>
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="group hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-sm text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800/50 hover:text-slate-200 lg:flex"
          >
            <Command className="h-4 w-4" />
            <span className="text-xs">Search</span>
            <kbd className="ml-2 inline-flex h-5 items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Command Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800/50 hover:text-slate-200 lg:hidden"
          >
            <Command className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800/50 hover:text-slate-200">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
          </button>

          {/* User Avatar - Hidden on mobile to save space */}
          <button className="hidden h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 transition-all hover:opacity-90 lg:flex">
            <User className="h-4 w-4 text-white" />
          </button>
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  );
}
