"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Bell,
  HelpCircle,
  Keyboard,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface UserMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenKeyboardShortcuts?: () => void;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "danger";
}

const getMenuSections = (
  router: ReturnType<typeof useRouter>,
  onOpenKeyboardShortcuts?: () => void,
  onSignOut?: () => void
): { items: MenuItem[] }[] => [
  {
    items: [
      {
        icon: User,
        label: "Profile Settings",
        onClick: () => router.push("/settings/profile"),
      },
      {
        icon: Building2,
        label: "Agency Settings",
        onClick: () => router.push("/settings/agency"),
      },
      {
        icon: Bell,
        label: "Notification Preferences",
        onClick: () => router.push("/settings/notifications"),
      },
    ],
  },
  {
    items: [
      {
        icon: HelpCircle,
        label: "Help Center",
        onClick: () => router.push("/help"),
      },
      {
        icon: Keyboard,
        label: "Keyboard Shortcuts",
        onClick: onOpenKeyboardShortcuts || (() => console.log("Keyboard Shortcuts")),
      },
    ],
  },
  {
    items: [
      {
        icon: LogOut,
        label: "Sign Out",
        onClick: onSignOut || (() => console.log("Sign Out")),
        variant: "danger" as const,
      },
    ],
  },
];

export function UserMenu({ open, onClose, onOpenKeyboardShortcuts }: UserMenuProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  if (!open) return null;

  const handleSignOut = async () => {
    onClose(); // Close the menu first
    await signOut();
  };

  const menuSections = getMenuSections(router, onOpenKeyboardShortcuts, handleSignOut);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Dropdown */}
      <div className="fixed right-4 top-16 z-50 w-64 rounded-xl border border-slate-800/50 bg-slate-950 shadow-2xl animate-in slide-in-from-top-2 duration-200">
        {/* User Info Section */}
        <div className="border-b border-slate-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                Agency Manager
              </span>
              <span className="text-xs text-slate-400">
                manager@agency.com
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {menuSections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              {sectionIndex > 0 && (
                <div className="my-2 border-t border-slate-800/50" />
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isDanger = item.variant === "danger";

                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick();
                        onClose();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isDanger
                          ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
