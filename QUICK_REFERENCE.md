# Campaign System - Quick Reference

## Import Paths

```typescript
// Business Logic
import {
  getFansBySegment,
  calculateEstimatedReach,
  calculateSegmentSize,
  predictCampaignPerformance,
  getCampaignAnalytics,
  getCampaignPerformanceSummary,
  getTopCampaigns,
  getRecentCampaigns,
} from '@/lib/campaigns';

// Data Access
import {
  CAMPAIGNS,
  getCampaignById,
  getCampaignsByCreator,
  getCampaignsByStatus,
} from '@/lib/mock-data';

// Types
import type {
  Campaign,
  FanSegment,
  CampaignVariant,
  CampaignPrediction,
  CampaignAnalytics,
} from '@/types';
```

---

## Campaign Status Flow

```
draft → scheduled → sending → completed
                         ↓
                      paused
```

---

## Campaign Types

| Type | Purpose | Price | Example |
|------|---------|-------|---------|
| `ppv` | Sell exclusive content | $20-$75 | Beach Photoshoot |
| `promotion` | Discount/sale campaigns | Varies | 50% Off Weekend |
| `reengagement` | Win back expired fans | Free | Come Back Message |
| `custom` | Announcements/relationship | Free/Varies | Good Morning |

---

## Fan Segment Filters

```typescript
filters: {
  tiers?: ('whale' | 'high' | 'medium' | 'low')[];
  minSpend?: number;
  maxSpend?: number;
  subscriptionStatus?: ('active' | 'expired' | 'cancelled')[];
  lastActiveWithin?: number; // days
  hasPurchasedPPV?: boolean;
  tags?: string[];
}
```

---

## Performance Benchmarks

| Tier | Open Rate | Response Rate | Avg Revenue |
|------|-----------|---------------|-------------|
| Whale | 65% | 30% | $115 |
| High | 45% | 20% | $45 |
| Medium | 30% | 12% | $18 |
| Low | 20% | 5% | $5 |

---

## Common Segments

### High-Value Active Buyers
```typescript
{
  tiers: ['whale', 'high'],
  subscriptionStatus: ['active'],
  hasPurchasedPPV: true,
  lastActiveWithin: 7
}
```

### Whales Only
```typescript
{
  tiers: ['whale'],
  subscriptionStatus: ['active']
}
```

### Re-engagement Targets
```typescript
{
  tiers: ['high', 'medium'],
  subscriptionStatus: ['expired'],
  lastActiveWithin: 30
}
```

### All Active Subscribers
```typescript
{
  subscriptionStatus: ['active']
}
```

---

## Quick Actions

### Get Campaign List
```typescript
const campaigns = CAMPAIGNS;
const active = getCampaignsByStatus('sending');
const completed = getCampaignsByStatus('completed');
```

### Calculate Reach
```typescript
const reach = calculateEstimatedReach(segment, creatorIds);
```

### Predict Performance
```typescript
const prediction = predictCampaignPerformance(
  segment,
  creatorIds,
  ppvPrice
);
// Returns: { estimatedOpens, estimatedResponses, estimatedRevenue, ... }
```

### Get Analytics
```typescript
const analytics = getCampaignAnalytics(campaignId);
// Returns: { totalSent, totalOpened, totalRevenue, byTier, ... }
```

### Get Summary
```typescript
const summary = getCampaignPerformanceSummary();
// Returns: { totalCampaigns, totalRevenue, avgOpenRate, ... }
```

---

## Example Campaign Objects

### Active Campaign
```typescript
{
  id: "campaign_active_1",
  name: "Holiday Weekend Special",
  type: "ppv",
  status: "sending",
  creatorIds: ["creator_1"],
  fanSegment: { name: "Active High Spenders", filters: {...}, fanCount: 74 },
  estimatedReach: 74,
  messageTemplate: "Hey babe! 🔥 Just finished...",
  ppvPrice: 35,
  sendRate: 120,
  sentCount: 52,      // Progress: 52/74
  deliveredCount: 52,
  openRate: 54,
  responseRate: 28,
  revenue: 504.0,
  createdAt: Date,
  createdBy: "chatter_1"
}
```

### Completed Campaign with A/B Test
```typescript
{
  id: "campaign_completed_1",
  name: "Beach Photoshoot Exclusive",
  type: "ppv",
  status: "completed",
  // ...
  variants: [
    {
      id: "variant_a",
      name: 'Variant A: "Hey babe! 🔥"',
      messageTemplate: "...",
      trafficSplit: 50,
      performance: { sent: 12, opened: 8, responded: 4, revenue: 200 }
    },
    {
      id: "variant_b",
      name: 'Variant B: "Exclusive for you 💕"',
      // ...
    }
  ]
}
```

---

## Data Summary

- **Total Campaigns**: 18
- **Total Revenue**: $7,152.80
- **Avg Open Rate**: 55%
- **Avg Response Rate**: 18%
- **Best Campaign**: Beach Photoshoot ($3,450)

---

## Documentation Files

1. **CAMPAIGN_SYSTEM.md** - Complete system overview
2. **CAMPAIGN_USAGE_EXAMPLES.md** - 11 code examples
3. **IMPLEMENTATION_SUMMARY.md** - What was built
4. **QUICK_REFERENCE.md** - This file

---

## Common Patterns

### Campaign Builder Flow
```typescript
// 1. Select segment
const fanCount = calculateSegmentSize(filters, creatorIds);

// 2. Predict performance
const prediction = predictCampaignPerformance(segment, creatorIds, price);

// 3. Create campaign
const campaign: Campaign = {
  // ... configure all fields
};
```

### Analytics Dashboard
```typescript
const summary = getCampaignPerformanceSummary();
const topCampaigns = getTopCampaigns(5);
const activeCampaigns = getCampaignsByStatus('sending');
```

### Campaign Detail View
```typescript
const campaign = getCampaignById(id);
const analytics = getCampaignAnalytics(id);

// Display: overall stats, tier breakdown, variant performance
```

---

## Status Badge Colors

```typescript
const statusColors = {
  draft: 'gray',
  scheduled: 'blue',
  sending: 'yellow',
  completed: 'green',
  paused: 'orange',
};
```

---

## Performance Rating

```typescript
const getRating = (openRate: number) => {
  if (openRate >= 60) return 'Excellent';
  if (openRate >= 45) return 'Good';
  if (openRate >= 30) return 'Average';
  return 'Below Average';
};
```

---

**VaultCRM Campaign System v1.0**
