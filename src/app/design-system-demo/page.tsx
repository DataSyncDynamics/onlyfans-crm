"use client"

import * as React from "react"
import { MetricCard } from "@/components/ui/metric-card"
import { DataTable } from "@/components/ui/data-table"
import { CommandPalette, useCommandPalette } from "@/components/ui/command-palette"
import { EmptyState, EmptyCreators } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DollarSign,
  Users,
  TrendingUp,
  MessageSquare,
  Search,
} from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

// Sample data types
type Creator = {
  id: string
  name: string
  revenue: number
  fans: number
  status: "active" | "inactive"
}

// Sample data
const creators: Creator[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    revenue: 25420,
    fans: 1245,
    status: "active",
  },
  {
    id: "2",
    name: "Emily Davis",
    revenue: 18900,
    fans: 892,
    status: "active",
  },
  {
    id: "3",
    name: "Jessica Smith",
    revenue: 32100,
    fans: 1678,
    status: "active",
  },
  {
    id: "4",
    name: "Amanda Wilson",
    revenue: 12300,
    fans: 534,
    status: "inactive",
  },
]

// Table columns
const columns: ColumnDef<Creator>[] = [
  {
    accessorKey: "name",
    header: "Creator Name",
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("revenue"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "fans",
    header: "Fans",
    cell: ({ row }) => {
      const fans = row.getValue("fans") as number
      return <div>{fans.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "success" : "outline"}>
          {status}
        </Badge>
      )
    },
  },
]

export default function DesignSystemDemo() {
  const { open, setOpen } = useCommandPalette()
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(65)

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Command Palette */}
      <CommandPalette open={open} onOpenChange={setOpen} />

      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Design System Demo
            </h1>
            <p className="text-muted-foreground mt-2">
              Linear-inspired VaultCRM Components
            </p>
          </div>
          <Button onClick={() => setOpen(true)} variant="outline">
            Open Command Palette
            <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Metric Cards */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Metric Cards
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Animated metrics with sparklines and trend indicators
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Revenue"
              value={88750}
              change={12.5}
              trend="up"
              icon={DollarSign}
              prefix="$"
              sparklineData={[65, 70, 68, 75, 80, 85, 88]}
              loading={loading}
            />
            <MetricCard
              title="Active Creators"
              value={24}
              change={8.2}
              trend="up"
              icon={Users}
              sparklineData={[18, 19, 21, 22, 23, 23, 24]}
              loading={loading}
            />
            <MetricCard
              title="Total Fans"
              value={12450}
              change={-3.1}
              trend="down"
              icon={TrendingUp}
              sparklineData={[13000, 12900, 12800, 12700, 12600, 12500, 12450]}
              loading={loading}
            />
            <MetricCard
              title="Messages"
              value={3289}
              change={15.8}
              trend="up"
              icon={MessageSquare}
              sparklineData={[2500, 2700, 2800, 2900, 3000, 3100, 3289]}
              loading={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setLoading(!loading)}
              variant="outline"
              size="sm"
            >
              Toggle Loading
            </Button>
          </div>
        </section>

        {/* Section 2: Badges */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Badges</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Status indicators with multiple variants
            </p>
          </div>

          <Card className="p-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Card>
        </section>

        {/* Section 3: Progress */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Progress Bar
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Smooth animated progress indicator
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Upload Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setProgress(Math.max(0, progress - 10))}
                variant="outline"
                size="sm"
              >
                -10%
              </Button>
              <Button
                onClick={() => setProgress(Math.min(100, progress + 10))}
                variant="outline"
                size="sm"
              >
                +10%
              </Button>
            </div>
          </Card>
        </section>

        {/* Section 4: Data Table */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Data Table
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced table with search, sorting, and pagination
            </p>
          </div>

          <DataTable
            columns={columns}
            data={creators}
            searchKey="name"
            searchPlaceholder="Search creators..."
            pageSize={5}
          />
        </section>

        {/* Section 5: Empty States */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Empty States
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Beautiful placeholders with call-to-action
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <EmptyCreators onAddCreator={() => alert("Add creator")} />
            <EmptyState
              icon={Search}
              title="No results found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={{
                label: "Clear filters",
                onClick: () => alert("Clear"),
              }}
            />
          </div>
        </section>

        {/* Section 6: Loading States */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Skeleton Loaders
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Loading placeholders with pulse animation
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </Card>
        </section>

        {/* Section 7: Utility Classes */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Utility Classes
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Custom Tailwind utilities for glass morphism and effects
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="glass-hover p-6">
              <h3 className="font-semibold mb-2">Glass Hover</h3>
              <p className="text-sm text-muted-foreground">
                Hover me for glass morphism effect
              </p>
            </Card>

            <Card className="p-6 glow-primary">
              <h3 className="font-semibold mb-2">Primary Glow</h3>
              <p className="text-sm text-muted-foreground">
                Blue glow effect for emphasis
              </p>
            </Card>

            <Card className="p-6 gradient-shimmer">
              <h3 className="font-semibold mb-2">Gradient Shimmer</h3>
              <p className="text-sm text-muted-foreground">
                Animated gradient background
              </p>
            </Card>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          Built with Next.js 14, TypeScript, Tailwind CSS, and Radix UI
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Press <kbd className="px-1.5 py-0.5 text-[10px] border border-border rounded bg-muted">⌘K</kbd> to open command palette
        </p>
      </div>
    </div>
  )
}
