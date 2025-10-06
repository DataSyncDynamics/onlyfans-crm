"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Users,
  UserCircle,
  MessageSquare,
  Settings,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  type LucideIcon,
} from "lucide-react"

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: LucideIcon
  shortcut?: string
  onSelect: () => void
}

export interface CommandGroup {
  heading: string
  items: CommandItem[]
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups?: CommandGroup[]
  recentItems?: CommandItem[]
  placeholder?: string
}

export function CommandPalette({
  open,
  onOpenChange,
  groups,
  recentItems,
  placeholder = "Type a command or search...",
}: CommandPaletteProps) {
  const router = useRouter()

  // Default command groups for VaultCRM
  const defaultGroups: CommandGroup[] = [
    {
      heading: "Navigation",
      items: [
        {
          id: "nav-dashboard",
          label: "Dashboard",
          description: "Go to dashboard",
          icon: BarChart3,
          shortcut: "⌘D",
          onSelect: () => {
            router.push("/dashboard")
            onOpenChange(false)
          },
        },
        {
          id: "nav-creators",
          label: "Creators",
          description: "View all creators",
          icon: Users,
          shortcut: "⌘C",
          onSelect: () => {
            router.push("/creators")
            onOpenChange(false)
          },
        },
        {
          id: "nav-fans",
          label: "Fans",
          description: "View all fans",
          icon: UserCircle,
          shortcut: "⌘F",
          onSelect: () => {
            router.push("/fans")
            onOpenChange(false)
          },
        },
        {
          id: "nav-chatters",
          label: "Chatters",
          description: "View all chatters",
          icon: MessageSquare,
          shortcut: "⌘H",
          onSelect: () => {
            router.push("/chatters")
            onOpenChange(false)
          },
        },
      ],
    },
    {
      heading: "Quick Actions",
      items: [
        {
          id: "action-revenue",
          label: "View Revenue",
          description: "Check earnings and analytics",
          icon: DollarSign,
          onSelect: () => {
            router.push("/analytics/revenue")
            onOpenChange(false)
          },
        },
        {
          id: "action-schedule",
          label: "Manage Schedule",
          description: "View content calendar",
          icon: Calendar,
          onSelect: () => {
            router.push("/schedule")
            onOpenChange(false)
          },
        },
        {
          id: "action-recent",
          label: "Recent Activity",
          description: "View recent interactions",
          icon: Clock,
          onSelect: () => {
            router.push("/activity")
            onOpenChange(false)
          },
        },
      ],
    },
    {
      heading: "Settings",
      items: [
        {
          id: "settings-general",
          label: "Settings",
          description: "Manage app settings",
          icon: Settings,
          shortcut: "⌘,",
          onSelect: () => {
            router.push("/settings")
            onOpenChange(false)
          },
        },
      ],
    },
  ]

  const commandGroups = groups || defaultGroups

  // Keyboard shortcuts
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm font-medium text-white">No results found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching for something else
            </p>
          </div>
        </CommandEmpty>

        {/* Recent items */}
        {recentItems && recentItems.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recentItems.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={item.onSelect}
                  className="flex items-center gap-2"
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4 text-slate-400" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-white">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-slate-400">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.shortcut && (
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                      {item.shortcut}
                    </kbd>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Command groups */}
        {commandGroups.map((group, index) => (
          <React.Fragment key={group.heading}>
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={item.onSelect}
                  className="flex items-center gap-2"
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4 text-slate-400" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-white">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-slate-400">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.shortcut && (
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                      {item.shortcut}
                    </kbd>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {index < commandGroups.length - 1 && <CommandSeparator />}
          </React.Fragment>
        ))}
      </CommandList>

      {/* Footer hint */}
      <div className="border-t border-slate-800 p-2">
        <p className="text-xs text-slate-400 text-center">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
            ⌘K
          </kbd>{" "}
          to toggle
        </p>
      </div>
    </CommandDialog>
  )
}

// Hook for using command palette
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  return {
    open,
    setOpen,
    toggle,
  }
}
