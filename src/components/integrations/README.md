# OnlyFans Integration Components

Production-quality, mobile-first UI components for the VaultCRM OnlyFans integration feature.

## Components Overview

### 1. ConnectionStatusCard
**Location:** `/src/components/integrations/connection-status-card.tsx`

Displays the connection status for a single OnlyFans creator account.

**Features:**
- Visual health indicator (0-100%)
- Status badges (Connected/Warning/Error)
- Last sync and next sync timestamps
- Auto-sync toggle switch
- Quick action buttons (Sync, Settings, Disconnect)
- Responsive design with 44px minimum touch targets

**Props:**
```typescript
interface ConnectionStatusCardProps {
  connection: {
    id: string;
    creatorName: string;
    ofUsername: string;
    status: "connected" | "warning" | "error";
    lastSync: Date;
    nextSync?: Date;
    autoSync: boolean;
    health: number; // 0-100
  };
  onSync?: () => void;
  onDisconnect?: () => void;
  onSettings?: () => void;
  onToggleAutoSync?: (enabled: boolean) => void;
}
```

**Usage:**
```tsx
<ConnectionStatusCard
  connection={connection}
  onSync={() => handleSync(connection.id)}
  onDisconnect={() => handleDisconnect(connection.id)}
  onSettings={() => handleSettings(connection.id)}
  onToggleAutoSync={(enabled) => handleToggleAutoSync(connection.id, enabled)}
/>
```

---

### 2. SyncActivityLog
**Location:** `/src/components/integrations/sync-activity-log.tsx`

Displays a filterable log of recent sync activities across all connections.

**Features:**
- Expandable activity items
- Status filtering (All/Success/Failed)
- Detailed sync metrics breakdown
- Error message display
- Duration tracking
- Responsive grid layout for metrics

**Props:**
```typescript
interface SyncActivityLogProps {
  activities: SyncActivity[];
  maxItems?: number; // Default: 10
  showFilter?: boolean; // Default: true
}

interface SyncActivity {
  id: string;
  timestamp: Date;
  type: "auto" | "manual";
  status: "success" | "failed" | "partial";
  creatorName: string;
  itemsSynced: {
    messages: number;
    subscribers: number;
    transactions: number;
    content: number;
  };
  error?: string;
  duration?: number; // in seconds
}
```

**Usage:**
```tsx
<SyncActivityLog
  activities={activities}
  maxItems={10}
  showFilter={true}
/>
```

---

### 3. SyncPreviewModal
**Location:** `/src/components/integrations/sync-preview-modal.tsx`

Modal that shows what will be synced before running a manual sync operation.

**Features:**
- Preview of new items to sync
- Estimated duration display
- Real-time progress bar during sync
- Success/completion state
- Mobile-responsive design

**Props:**
```typescript
interface SyncPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
  preview: {
    newMessages: number;
    newSubscribers: number;
    newTransactions: number;
    newContent: number;
    estimatedDuration: number; // in seconds
  };
  onConfirm: () => void;
}
```

**Usage:**
```tsx
<SyncPreviewModal
  open={syncPreviewOpen}
  onOpenChange={setSyncPreviewOpen}
  creatorName="Bella Rose"
  preview={syncPreview}
  onConfirm={handleConfirmSync}
/>
```

---

### 4. ConnectionHealthDashboard
**Location:** `/src/components/integrations/connection-health-dashboard.tsx`

Overview dashboard showing aggregate health metrics for all connections.

**Features:**
- Status breakdown cards (Connected/Warnings/Errors)
- Sync success rate with visual indicator
- Total items synced metric
- Last 24 hours activity summary
- Alert banner for errors
- Responsive grid layout

**Props:**
```typescript
interface ConnectionHealthDashboardProps {
  health: {
    totalConnections: number;
    connectedCount: number;
    warningCount: number;
    errorCount: number;
    syncSuccessRate: number; // 0-100
    totalItemsSynced: number;
    last24Hours: {
      syncs: number;
      items: number;
    };
  };
}
```

**Usage:**
```tsx
<ConnectionHealthDashboard health={healthMetrics} />
```

---

### 5. ConnectOnlyFansWizard
**Location:** `/src/components/integrations/connect-onlyfans-wizard.tsx`

5-step wizard for connecting a new OnlyFans account.

**Features:**
- Multi-step form with progress indicator
- Input validation on each step
- Connection testing before completion
- API key security (password input)
- Sync settings configuration
- Mobile-optimized navigation

**Steps:**
1. Enter OnlyFans username
2. Enter API key (with help link)
3. Configure sync settings (checkboxes)
4. Set sync interval (dropdown)
5. Test connection and confirm

**Props:**
```typescript
interface ConnectOnlyFansWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (config: ConnectionConfig) => void;
}

interface ConnectionConfig {
  username: string;
  apiKey: string;
  syncSettings: {
    messages: boolean;
    subscribers: boolean;
    revenue: boolean;
    content: boolean;
  };
  syncInterval: "6h" | "12h" | "24h";
}
```

**Usage:**
```tsx
<ConnectOnlyFansWizard
  open={wizardOpen}
  onOpenChange={setWizardOpen}
  onComplete={handleWizardComplete}
/>
```

---

## Integration Page
**Location:** `/src/app/(dashboard)/settings/integrations/page.tsx`

Main page that combines all components into a complete integration management interface.

**Features:**
- Connection health dashboard at top
- Grid of connection status cards
- Sync activity log
- "Connect New Account" button
- Empty state for no connections
- All modals integrated

**Layout:**
```
Header (Title + Connect Button)
├── ConnectionHealthDashboard
├── Connected Accounts Section
│   └── Grid of ConnectionStatusCards
└── SyncActivityLog
```

---

## Design System

### Colors
- **Connected/Success:** `emerald-500` (#10B981)
- **Warning:** `amber-500` (#F59E0B)
- **Error/Danger:** `red-500` (#EF4444)
- **Primary:** `purple-600` to `pink-600` gradient
- **Background:** `slate-900/50` with `slate-800` borders
- **Text:** `white` for primary, `slate-400` for secondary

### Mobile-First Features
- **Touch Targets:** Minimum 44px height for all buttons
- **Responsive Grid:** 1 column mobile, 2-3 columns desktop
- **Large Inputs:** 44-48px height for form fields
- **Swipe-friendly:** Cards and modals optimized for touch
- **Portrait Mode:** All layouts work perfectly on iPhone 12 Pro (390x844px)

### Accessibility
- Proper ARIA labels on all interactive elements
- Keyboard navigation support
- Focus states with purple ring
- Screen reader text where appropriate
- Color contrast ratios meet WCAG AA standards

---

## Dependencies

All components use:
- `@/components/ui/*` - Shadcn UI primitives
- `lucide-react` - Icons
- `@/lib/utils` - cn() utility for class merging
- `react` - Hooks and client components

---

## Future Enhancements

1. **Real-time Updates:** WebSocket integration for live sync status
2. **Advanced Filtering:** Date range, creator name search in activity log
3. **Bulk Actions:** Multi-select connections for bulk sync/disconnect
4. **Analytics Charts:** Visual charts for sync trends over time
5. **Notification Integration:** Push notifications for failed syncs
6. **Settings Modal:** Detailed connection settings editor
7. **Sync Scheduling:** Custom cron-like scheduling options

---

## Testing Checklist

- [ ] All components render without errors
- [ ] Mobile responsiveness (390px width)
- [ ] Touch targets are 44px minimum
- [ ] Auto-sync toggle works
- [ ] Wizard completes all 5 steps
- [ ] Sync preview modal shows progress
- [ ] Activity log filters work
- [ ] Health dashboard calculates correctly
- [ ] Empty states display properly
- [ ] Error states are visible and helpful

---

## File Structure

```
src/components/integrations/
├── connection-status-card.tsx
├── sync-activity-log.tsx
├── sync-preview-modal.tsx
├── connection-health-dashboard.tsx
├── connect-onlyfans-wizard.tsx
├── index.ts
└── README.md

src/app/(dashboard)/settings/integrations/
└── page.tsx
```

---

Built with mobile-first design principles for VaultCRM.
