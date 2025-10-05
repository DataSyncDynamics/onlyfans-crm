# OnlyFans Agency CRM - Design System

A Linear-inspired dark theme design system built with Next.js 14, TypeScript, and Tailwind CSS.

## Overview

This design system provides a complete set of components and styling utilities for building a modern, dark-themed OnlyFans Agency CRM dashboard.

## Color System

### Core Colors

```css
/* Dark Theme Palette */
--background: slate-950      /* #0F172A - Main background */
--card: slate-900           /* #1E293B - Card backgrounds */
--border: slate-800         /* #1E293B - Subtle borders */
--foreground: slate-50      /* #F8FAFC - Primary text */
--muted-foreground: slate-400 /* #94A3B8 - Secondary text */
```

### Accent Colors

```css
--primary: #3B82F6         /* Blue - Primary actions */
--success: #10B981         /* Emerald - Success states */
--warning: #F59E0B         /* Amber - Warning states */
--destructive: #EF4444     /* Red - Danger/error states */
```

## Typography

### Font Stack
- Primary: Inter (system fallback)
- Features: ligatures enabled, optimized rendering

### Headings
```tsx
h1: text-4xl font-semibold tracking-tight
h2: text-3xl font-semibold tracking-tight
h3: text-2xl font-semibold tracking-tight
h4: text-xl font-semibold tracking-tight
h5: text-lg font-semibold tracking-tight
h6: text-base font-semibold tracking-tight
```

## Custom Utilities

### Glass Morphism
```tsx
// Basic glass effect
className="glass"

// Glass with hover animation
className="glass-hover"
```

### Animations
```tsx
// Fade in (300ms)
className="fade-in"

// Slide up (400ms)
className="slide-up"

// Smooth transition (200ms)
className="transition-smooth"

// Slower transition (300ms)
className="transition-smooth-slow"
```

### Shadows
```tsx
// Subtle depth
className="shadow-subtle"

// Medium elevation
className="shadow-elevation"

// Large elevation
className="shadow-elevation-lg"

// Primary glow
className="glow-primary"
```

### Special Effects
```tsx
// Animated gradient shimmer
className="gradient-shimmer"

// Skeleton loading
className="skeleton"
```

## Components

### 1. MetricCard

Display key metrics with animated counters and sparklines.

**Location:** `/src/components/ui/metric-card.tsx`

**Props:**
- `title`: string - Metric label
- `value`: string | number - Metric value
- `change?`: number - Percentage change
- `trend?`: "up" | "down" - Trend direction
- `icon?`: LucideIcon - Icon component
- `sparklineData?`: number[] - Data for sparkline chart
- `loading?`: boolean - Loading state
- `prefix?`: string - Value prefix (e.g., "$")
- `suffix?`: string - Value suffix (e.g., "%")

**Example:**
```tsx
import { MetricCard } from "@/components/ui/metric-card"
import { DollarSign } from "lucide-react"

<MetricCard
  title="Total Revenue"
  value={45280}
  change={12.5}
  trend="up"
  icon={DollarSign}
  prefix="$"
  sparklineData={[20, 25, 30, 28, 35, 40, 45]}
/>
```

**Features:**
- Animated counter on mount
- Recharts sparkline visualization
- Glass morphism hover effect
- Loading skeleton state
- Trend indicators with color coding

---

### 2. DataTable

Advanced table with sorting, filtering, and pagination.

**Location:** `/src/components/ui/data-table.tsx`

**Props:**
- `columns`: ColumnDef[] - TanStack Table column definitions
- `data`: TData[] - Table data
- `searchKey?`: string - Column key for search
- `searchPlaceholder?`: string - Search input placeholder
- `loading?`: boolean - Loading state
- `emptyMessage?`: string - Empty state title
- `emptyDescription?`: string - Empty state description
- `showColumnVisibility?`: boolean - Show column toggle
- `showPagination?`: boolean - Show pagination controls
- `pageSize?`: number - Rows per page (default: 10)

**Example:**
```tsx
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]

<DataTable
  columns={columns}
  data={users}
  searchKey="name"
  searchPlaceholder="Search users..."
  pageSize={25}
/>
```

**Features:**
- Sticky header on scroll
- Built-in search functionality
- Column visibility toggle
- Row hover states
- Loading skeleton rows
- Pagination controls
- Sorting and filtering

---

### 3. CommandPalette

Keyboard-first navigation with ⌘K shortcut.

**Location:** `/src/components/ui/command-palette.tsx`

**Props:**
- `open`: boolean - Dialog open state
- `onOpenChange`: (open: boolean) => void - State setter
- `groups?`: CommandGroup[] - Command groups
- `recentItems?`: CommandItem[] - Recent commands
- `placeholder?`: string - Search placeholder

**Example:**
```tsx
import { CommandPalette, useCommandPalette } from "@/components/ui/command-palette"

function App() {
  const { open, setOpen } = useCommandPalette()

  return (
    <CommandPalette
      open={open}
      onOpenChange={setOpen}
    />
  )
}
```

**Features:**
- ⌘K global shortcut
- Keyboard navigation
- Fuzzy search
- Command groups
- Recent items section
- Custom keyboard shortcuts per command
- Next.js router integration

---

### 4. EmptyState

Beautiful empty states with call-to-action.

**Location:** `/src/components/ui/empty-state.tsx`

**Props:**
- `icon?`: LucideIcon - Icon component
- `title`: string - Empty state title
- `description?`: string - Descriptive text
- `action?`: object - Primary action button
  - `label`: string
  - `onClick`: () => void
  - `icon?`: LucideIcon
- `secondaryAction?`: object - Secondary action

**Example:**
```tsx
import { EmptyState } from "@/components/ui/empty-state"
import { Users } from "lucide-react"

<EmptyState
  icon={Users}
  title="No creators yet"
  description="Get started by adding your first creator."
  action={{
    label: "Add Creator",
    onClick: () => console.log("Add"),
    icon: Users,
  }}
/>
```

**Preset Variants:**
```tsx
import { EmptyCreators, EmptyFans, EmptyChatters, EmptySearch } from "@/components/ui/empty-state"

// Usage
<EmptyCreators onAddCreator={() => {}} />
<EmptyFans />
<EmptyChatters onAddChatter={() => {}} />
<EmptySearch query="test" onClear={() => {}} />
```

---

### 5. Base Components

Additional shadcn/ui components available:

**Table Components** (`/src/components/ui/table.tsx`)
- Table, TableHeader, TableBody, TableRow, TableHead, TableCell

**Badge** (`/src/components/ui/badge.tsx`)
- Variants: default, secondary, destructive, outline, success, warning, info

**Skeleton** (`/src/components/ui/skeleton.tsx`)
- Loading placeholder with pulse animation

**Command** (`/src/components/ui/command.tsx`)
- Command, CommandDialog, CommandInput, CommandList, CommandItem, etc.

**Dialog** (`/src/components/ui/dialog.tsx`)
- Dialog, DialogContent, DialogHeader, DialogTitle, etc.

**Dropdown Menu** (`/src/components/ui/dropdown-menu.tsx`)
- DropdownMenu, DropdownMenuItem, DropdownMenuCheckboxItem, etc.

**Progress** (`/src/components/ui/progress.tsx`)
- Animated progress bar

## Design Principles

### 1. Dark-First Design
All components are optimized for dark mode with subtle contrasts and proper color accessibility.

### 2. Glass Morphism
Cards and surfaces use semi-transparent backgrounds with blur effects for depth.

### 3. Smooth Animations
- 200ms for micro-interactions
- 300ms for transitions
- 400ms+ for enter/exit animations
- Cubic bezier easing for natural feel

### 4. Consistent Spacing
Following Tailwind's 4px scale:
- Small gaps: 2-4 (8-16px)
- Medium gaps: 4-6 (16-24px)
- Large gaps: 6-8 (24-32px)

### 5. Accessibility
- Proper ARIA labels
- Keyboard navigation
- Focus rings with blue glow
- High contrast text (WCAG AA compliant)

## Mobile Responsiveness

While desktop-first, all components work on mobile:
- Responsive padding and sizing
- Touch-friendly targets (44px minimum)
- Stacked layouts on small screens
- Horizontal scroll for tables

## Performance

### Optimizations
- CSS variables for instant theme switching
- CSS-only animations (no JS)
- Lazy loading for heavy components
- Optimized bundle with tree-shaking

### Best Practices
- Use `loading` props for async states
- Implement virtual scrolling for long lists
- Debounce search inputs
- Optimize images with Next.js Image

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Mobile Chrome: Android 10+

## Development

### Adding New Components

1. Create component in `/src/components/ui/`
2. Use TypeScript with proper types
3. Include dark theme support
4. Add loading states
5. Document in this file

### Styling Guidelines

1. Use Tailwind utilities first
2. Custom utilities in globals.css
3. Component-specific styles inline
4. Follow BEM for complex components

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Radix UI Primitives](https://radix-ui.com)
- [TanStack Table](https://tanstack.com/table)
- [Recharts](https://recharts.org)
- [Lucide Icons](https://lucide.dev)

---

Built with love for the OnlyFans Agency ecosystem.
