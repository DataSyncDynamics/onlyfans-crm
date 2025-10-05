"use client"

import * as React from "react"
import { type LucideIcon, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-8 text-center animate-in fade-in-50 slide-up",
        className
      )}
      {...props}
    >
      {/* Animated icon */}
      <div className="mb-4 rounded-full bg-primary/10 p-6 transition-smooth-slow hover:scale-110 hover:bg-primary/20">
        <Icon className="h-10 w-10 text-primary" />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>

      {/* Description */}
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {action && (
            <Button
              onClick={action.onClick}
              className="gap-2 glow-primary"
              size="lg"
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size="lg"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Preset variants for common use cases
export function EmptyCreators({
  onAddCreator,
}: {
  onAddCreator: () => void
}) {
  return (
    <EmptyState
      icon={Users}
      title="No creators yet"
      description="Get started by adding your first creator to manage their OnlyFans account."
      action={{
        label: "Add Creator",
        onClick: onAddCreator,
        icon: Users,
      }}
    />
  )
}

export function EmptyFans() {
  return (
    <EmptyState
      icon={UserCircle}
      title="No fans found"
      description="Fans will appear here once they start interacting with your creators."
    />
  )
}

export function EmptyChatters({
  onAddChatter,
}: {
  onAddChatter: () => void
}) {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No chatters assigned"
      description="Add chatters to help manage conversations with fans."
      action={{
        label: "Add Chatter",
        onClick: onAddChatter,
        icon: MessageSquare,
      }}
    />
  )
}

export function EmptySearch({
  query,
  onClear,
}: {
  query: string
  onClear: () => void
}) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search.`}
      action={{
        label: "Clear search",
        onClick: onClear,
      }}
    />
  )
}

// Import additional icons for presets
import { Users, UserCircle, MessageSquare, Search } from "lucide-react"
