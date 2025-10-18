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
  TrendingUp,
  Upload,
  ChevronRight,
  Check,
  Send,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { UserMenu } from "@/components/ui/user-menu";
import { KeyboardShortcutsModal } from "@/components/ui/keyboard-shortcuts-modal";
import { useRole } from "@/contexts/role-context";
import { CREATORS } from "@/lib/mock-data";
import { haptics } from "@/lib/utils/haptics";

const allNavigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard, roles: ["agency_owner", "creator", "chatter"] },
  { name: "Creators", href: "/creators", icon: Users, roles: ["agency_owner"] },
  { name: "Fans", href: "/fans", icon: Heart, roles: ["agency_owner", "creator", "chatter"] },
  { name: "Campaigns", href: "/campaigns", icon: Send, roles: ["agency_owner", "creator", "chatter"] },
  { name: "AI Chat", href: "/chat", icon: MessageSquare, roles: ["agency_owner", "chatter"], badge: 12 },
  { name: "Revenue", href: "/revenue", icon: DollarSign, roles: ["agency_owner", "creator"] },
  { name: "Chatters", href: "/chatters", icon: MessageSquare, roles: ["agency_owner"] },
  { name: "Schedule", href: "/schedule", icon: Calendar, roles: ["agency_owner"] },
  { name: "My Performance", href: "/performance", icon: TrendingUp, roles: ["chatter"] },
  { name: "Content", href: "/content", icon: Upload, roles: ["agency_owner", "creator"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, setRole, selectedCreatorId, setSelectedCreatorId, userName, userHandle } = useRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [isCreatorSubmenuOpen, setIsCreatorSubmenuOpen] = useState(false);

  // Filter navigation based on role
  const navigation = allNavigation.filter(item => item.roles.includes(role));

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo/Brand Section */}
      <div className="flex h-16 items-center border-b border-slate-800/50 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-slate-50">VaultCRM</h1>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                haptics.tap();
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
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
              {item.badge && item.badge > 0 && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              {isActive && !item.badge && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section with Role Switcher - Pinned to Bottom */}
      <div className="mt-auto border-t border-slate-800/50 p-3">
        <button
          onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
          className={cn(
            "group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200",
            isRoleSwitcherOpen
              ? "bg-slate-800/80"
              : "hover:bg-slate-800/50"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ring-2 ring-slate-800 flex-shrink-0">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-1 flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate w-full">{userName}</span>
            <span className="text-xs text-slate-400 truncate w-full">
              {userHandle || <span className="capitalize">{role.replace('_', ' ')}</span>}
            </span>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0",
            isRoleSwitcherOpen && "rotate-180 text-slate-300"
          )} />
        </button>

        {/* Role Switcher Dropdown - For Testing */}
        {isRoleSwitcherOpen && (
          <div className="mt-2 space-y-1 rounded-lg bg-slate-900/90 p-2 border border-slate-800/80 shadow-lg">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Switch View
            </div>
            <button
              onClick={() => {
                setRole("agency_owner");
                setIsRoleSwitcherOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150",
                role === "agency_owner"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              Agency Owner
            </button>
            <div className="relative">
              <button
                onClick={() => setIsCreatorSubmenuOpen(!isCreatorSubmenuOpen)}
                className={cn(
                  "w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 flex items-center justify-between",
                  role === "creator"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <span>Creator</span>
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isCreatorSubmenuOpen && "rotate-90"
                )} />
              </button>

              {/* Creator Submenu */}
              {isCreatorSubmenuOpen && (
                <div className="mt-1 ml-2 space-y-1 rounded-lg bg-slate-800/50 p-1.5 border border-slate-700/50">
                  {CREATORS.map((creator) => (
                    <button
                      key={creator.id}
                      onClick={() => {
                        setRole("creator");
                        setSelectedCreatorId(creator.id);
                        setIsRoleSwitcherOpen(false);
                        setIsCreatorSubmenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-xs rounded-md transition-all duration-150 flex items-center justify-between gap-2",
                        selectedCreatorId === creator.id && role === "creator"
                          ? "bg-blue-500/20 text-blue-300"
                          : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                      )}
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium truncate">{creator.displayName}</span>
                        <span className="text-[10px] text-slate-500 truncate">{creator.ofUsername}</span>
                      </div>
                      {selectedCreatorId === creator.id && role === "creator" && (
                        <Check className="h-3 w-3 flex-shrink-0 text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setRole("chatter");
                setIsRoleSwitcherOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150",
                role === "chatter"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              Chatter
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button - Increased to 44x44px for touch */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 lg:hidden touch-action-manipulation"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Overlay - Prevent scroll-through */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden touch-action-none"
          onClick={() => setIsMobileMenuOpen(false)}
          onTouchStart={(e) => e.stopPropagation()}
        />
      )}

      {/* Sidebar - Desktop: Fixed, Mobile: Overlay */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[260px] border-r border-slate-800/50 bg-slate-950 backdrop-blur-xl transition-transform duration-200 touch-action-pan-y lg:fixed lg:h-screen lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>

      {/* User Menu */}
      <UserMenu
        open={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        onOpenKeyboardShortcuts={() => {
          setIsUserMenuOpen(false);
          setIsKeyboardShortcutsOpen(true);
        }}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={isKeyboardShortcutsOpen}
        onClose={() => setIsKeyboardShortcutsOpen(false)}
      />

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-lg pb-safe lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => haptics.tap()}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-h-[56px] min-w-[64px] justify-center transition-all active:scale-95 relative",
                  isActive
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-400 active:bg-slate-800/50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-blue-400" : "text-slate-400"
                )}>
                  {item.name}
                </span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute right-2 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-purple-500 px-1 text-[9px] font-bold text-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
