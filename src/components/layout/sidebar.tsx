"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Heart,
  DollarSign,
  MessageSquare,
  Menu,
  X,
  Sparkles,
  User,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Creators", href: "/creators", icon: Users },
  { name: "Fans", href: "/fans", icon: Heart },
  { name: "Revenue", href: "/revenue", icon: DollarSign },
  { name: "Chatters", href: "/chatters", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo/Brand Section */}
      <div className="flex h-16 items-center border-b border-slate-800/50 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-slate-50">OnlyFans CRM</h1>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-slate-800/50 p-3">
        <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/50 hover:text-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-sm font-medium text-slate-200">Agency Manager</span>
            <span className="text-xs text-slate-500">manager@agency.com</span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-hover:text-slate-300" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: Fixed, Mobile: Overlay */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-800/50 bg-slate-950 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
