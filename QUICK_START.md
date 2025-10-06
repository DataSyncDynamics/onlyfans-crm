# Quick Start Guide - VaultCRM Design System

## Installation Complete ✓

All components are installed and ready to use. No additional setup required.

## View the Demo

```bash
npm run dev
```

Then visit: **http://localhost:3000/design-system-demo**

---

## Quick Reference

### Import Components

```tsx
// Analytics Card
import { MetricCard } from "@/components/ui/metric-card"

// Data Table
import { DataTable } from "@/components/ui/data-table"

// Command Palette
import { CommandPalette, useCommandPalette } from "@/components/ui/command-palette"

// Empty States
import { EmptyState, EmptyCreators } from "@/components/ui/empty-state"

// Base Components
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
```

---

## 5-Minute Examples

### 1. Dashboard Metrics (2 minutes)

```tsx
import { MetricCard } from "@/components/ui/metric-card"
import { DollarSign, Users } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value={88750}
        change={12.5}
        trend="up"
        icon={DollarSign}
        prefix="$"
        sparklineData={[65, 70, 75, 80, 85, 88]}
      />
      <MetricCard
        title="Active Creators"
        value={24}
        change={8.2}
        trend="up"
        icon={Users}
      />
    </div>
  )
}
```

### 2. Creators Table (3 minutes)

```tsx
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

type Creator = {
  name: string
  revenue: number
  status: "active" | "inactive"
}

const columns: ColumnDef<Creator>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => `$${row.getValue("revenue")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === "active" ? "success" : "outline"}>
        {row.getValue("status")}
      </Badge>
    ),
  },
]

export default function Creators() {
  const creators: Creator[] = [
    { name: "Sarah", revenue: 25420, status: "active" },
    { name: "Emily", revenue: 18900, status: "active" },
  ]

  return (
    <DataTable
      columns={columns}
      data={creators}
      searchKey="name"
      searchPlaceholder="Search creators..."
    />
  )
}
```

### 3. Command Palette (1 minute)

```tsx
"use client"

import { CommandPalette, useCommandPalette } from "@/components/ui/command-palette"
import { Button } from "@/components/ui/button"

export default function App() {
  const { open, setOpen } = useCommandPalette()

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Command Palette (⌘K)
      </Button>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  )
}
```

### 4. Empty State (1 minute)

```tsx
import { EmptyCreators } from "@/components/ui/empty-state"
import { useRouter } from "next/navigation"

export default function CreatorsList() {
  const router = useRouter()
  const creators = [] // Empty list

  if (creators.length === 0) {
    return (
      <EmptyCreators
        onAddCreator={() => router.push("/creators/new")}
      />
    )
  }

  return <div>Your creators list...</div>
}
```

---

## Utility Classes Cheat Sheet

```tsx
// Glass Morphism
className="glass"           // Static glass effect
className="glass-hover"     // Glass with hover animation

// Animations
className="fade-in"         // Fade in 300ms
className="slide-up"        // Slide up 400ms
className="skeleton"        // Loading pulse

// Transitions
className="transition-smooth"      // 200ms smooth
className="transition-smooth-slow" // 300ms smooth

// Shadows
className="shadow-subtle"      // Light shadow
className="shadow-elevation"   // Medium shadow
className="shadow-elevation-lg" // Large shadow
className="glow-primary"       // Blue glow

// Effects
className="gradient-shimmer"   // Animated gradient
```

---

## Color Reference

```tsx
// Text Colors
text-foreground          // Primary white text
text-muted-foreground    // Secondary gray text

// Background Colors
bg-background            // Main background (slate-950)
bg-card                  // Card background (slate-900)
bg-primary               // Blue accent
bg-success               // Green success
bg-warning               // Amber warning
bg-destructive           // Red danger

// Border Colors
border-border            // Subtle slate border
border-primary           // Blue border
```

---

## Badge Variants

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Danger</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## Loading States

```tsx
// Skeleton Loader
<Skeleton className="h-12 w-full" />
<Skeleton className="h-4 w-[250px]" />

// MetricCard Loading
<MetricCard
  title="Revenue"
  value={0}
  loading={true}
/>

// DataTable Loading
<DataTable
  columns={columns}
  data={[]}
  loading={true}
/>
```

---

## Keyboard Shortcuts

- **⌘K** (Mac) / **Ctrl+K** (Windows): Open command palette
- **Tab**: Navigate through interactive elements
- **Enter**: Activate focused element
- **Escape**: Close dialogs/dropdowns
- **Arrow Keys**: Navigate command palette, dropdown menus

---

## Common Patterns

### Dashboard Layout

```tsx
<div className="min-h-screen bg-background p-8">
  <div className="mb-8">
    <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
    <p className="text-muted-foreground mt-2">Welcome back!</p>
  </div>

  {/* Metrics */}
  <div className="grid gap-6 md:grid-cols-4 mb-8">
    {/* MetricCards here */}
  </div>

  {/* Table */}
  <DataTable columns={columns} data={data} />
</div>
```

### Card Container

```tsx
import { Card } from "@/components/ui/card"

<Card className="p-6 glass-hover">
  <h3 className="font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-muted-foreground">Card content...</p>
</Card>
```

### Grid Layout

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {/* Components */}
</div>
```

---

## Troubleshooting

### Component not rendering?
- Check imports are correct
- Ensure you're using `"use client"` if needed
- Verify TypeScript types match

### Styles not applying?
- Make sure globals.css is imported in layout
- Check Tailwind classes are spelled correctly
- Verify dark mode is active

### Build errors?
- Run `npm run build` to check for TypeScript errors
- Check ESLint output
- Ensure all dependencies are installed

---

## Need Help?

1. **View the demo:** `/design-system-demo`
2. **Read full docs:** `DESIGN_SYSTEM.md`
3. **Check summary:** `DESIGN_SYSTEM_SUMMARY.md`

---

## File Locations

```
Component Files:
/src/components/ui/metric-card.tsx
/src/components/ui/data-table.tsx
/src/components/ui/command-palette.tsx
/src/components/ui/empty-state.tsx

Theme:
/src/app/globals.css

Demo:
/src/app/design-system-demo/page.tsx
```

---

**You're all set! Start building your VaultCRM dashboard.** 🚀
