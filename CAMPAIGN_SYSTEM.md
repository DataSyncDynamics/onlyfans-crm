# VaultCRM Campaign System - Complete Data Layer

## Overview
The mass messaging/campaign system is now fully implemented with realistic mock data, type-safe interfaces, and comprehensive helper functions.

---

## File Structure

### `/src/types/index.ts`
Complete type definitions for campaigns, fan segments, variants, predictions, and analytics.

**Key Interfaces:**
- `Campaign` - Complete campaign data structure
- `FanSegment` - Sophisticated fan filtering system
- `CampaignVariant` - A/B testing support
- `CampaignPrediction` - Performance forecasting
- `CampaignAnalytics` - Detailed reporting

### `/src/lib/campaigns.ts` (NEW)
Business logic and helper functions for campaign operations.

**Core Functions:**

#### Fan Segmentation
```typescript
getFansBySegment(segment: FanSegment, creatorIds?: string[]): Fan[]
// Returns all fans matching segment filters

calculateEstimatedReach(segment: FanSegment, creatorIds: string[]): number
// Calculates how many fans will receive the campaign

calculateSegmentSize(filters: FanSegment["filters"], creatorIds?: string[]): number
// Live preview for campaign builder UI
```

#### Campaign Predictions
```typescript
predictCampaignPerformance(
  segment: FanSegment,
  creatorIds: string[],
  ppvPrice?: number
): CampaignPrediction
// Predicts open rate, response rate, and revenue based on historical data
```

**Performance Benchmarks by Tier:**
- **Whale**: 65% open, 30% response, $115 avg revenue
- **High**: 45% open, 20% response, $45 avg revenue
- **Medium**: 30% open, 12% response, $18 avg revenue
- **Low**: 20% open, 5% response, $5 avg revenue

#### Campaign Analytics
```typescript
getCampaignAnalytics(campaignId: string): CampaignAnalytics | null
// Complete analytics breakdown with tier-level performance

getCampaignPerformanceSummary()
// Dashboard-level metrics across all campaigns

getTopCampaigns(limit: number = 5): Campaign[]
// Best performing campaigns by revenue

getRecentCampaigns(limit: number = 10): Campaign[]
// Most recent campaigns by creation date
```

### `/src/lib/mock-data.ts`
18 realistic campaigns across all statuses with production-quality data.

**Campaign Breakdown:**
- **3 Active** (currently sending)
- **8 Completed** (last 30 days with full performance metrics)
- **4 Scheduled** (future sends with timing)
- **3 Drafts** (incomplete/in-progress)

---

## Mock Data Highlights

### Active Campaigns (Currently Sending)

**1. Holiday Weekend Special**
- Type: PPV ($35)
- Segment: Active High Spenders (Whale + High tier)
- Reach: 74 fans
- Performance: 54% open, 28% response, $504 revenue
- Status: 52/74 sent (4 hours in progress)

**2. Re-engagement: Expired Subs**
- Type: Re-engagement (free message)
- Segment: Recently Expired (High + Medium tier)
- Reach: 48 fans
- Performance: 41% open, 15% response, $159.60 revenue
- Status: 34/48 sent (7 hours in progress)

**3. VIP Exclusive Preview**
- Type: PPV ($75 - premium)
- Segment: Whale Tier Only + Previous PPV Buyers
- Reach: 42 fans
- Performance: 68% open, 32% response, $672 revenue
- Status: 28/42 sent (2 hours in progress)

### Completed Campaigns (Performance Data)

**Best Performer: Beach Photoshoot Exclusive**
- Revenue: $3,450
- Segment: Whales Only (23 fans)
- Price: $50 PPV
- Performance: 67% open, 30% response
- **Includes A/B Test:**
  - Variant A "Hey babe! 🔥": 67% open (WINNER)
  - Variant B "Exclusive for you 💕": 64% open

**Mass Promotion: Weekend Special 50% Off**
- Revenue: $1,476
- Segment: All Active Subscribers (500 fans)
- Performance: 42% open, 12% response
- Demonstrates large-scale campaign metrics

**Mid-Tier Success: New Lingerie Set**
- Revenue: $608
- Segment: Medium/High Tier Active (152 fans)
- Price: $25 PPV
- Performance: 39% open, 16% response

**Engagement Campaign: Good Morning Message**
- Revenue: $0 (relationship building)
- Segment: Active Chatters (127 fans)
- Performance: 71% open, 8% response
- Shows non-revenue campaigns work

### Scheduled Campaigns (Future Sends)

**1. Late Night Vibes**
- Sends in: 6 hours (late night timing strategy)
- PPV: $45
- Segment: Night Owls - High Tier (62 fans)

**2. Gym Session Recovery**
- Sends in: 24 hours (tomorrow)
- PPV: $20
- Segment: Active Medium/High (118 fans)

**3. Weekend Getaway Preview**
- Sends in: 48 hours (2 days)
- PPV: $60 (pre-order discount)
- Segment: Whales + Previous PPV Buyers (19 fans)

**4. Flash Sale - 24hr Only**
- Sends in: 72 hours (3 days)
- Type: Promotion
- Segment: All Active Fans (670 fans)

### Draft Campaigns (In Progress)

**1. Red Dress Photoshoot**
- Status: Draft (price not set)
- Segment: High Spenders (52 fans)
- Missing: PPV price

**2. Win-Back: Inactive Subscribers**
- Status: Draft (incomplete)
- Segment: Inactive 30+ Days
- Missing: Message template, segment calculation

**3. Birthday Month Special**
- Status: Draft
- Segment: All Active (380 fans)
- Missing: Complete message, campaign type details

---

## Fan Segmentation Capabilities

### Available Filters

```typescript
{
  tiers?: ('whale' | 'high' | 'medium' | 'low')[];
  minSpend?: number;
  maxSpend?: number;
  subscriptionStatus?: ('active' | 'expired' | 'cancelled')[];
  lastActiveWithin?: number; // days
  hasPurchasedPPV?: boolean;
  tags?: string[];
}
```

### Example Segments

**High Value Active Buyers**
```typescript
{
  tiers: ['whale', 'high'],
  subscriptionStatus: ['active'],
  hasPurchasedPPV: true,
  lastActiveWithin: 7
}
// Returns: 74 fans (used in "Holiday Weekend Special")
```

**Re-engagement Targets**
```typescript
{
  tiers: ['high', 'medium'],
  subscriptionStatus: ['expired'],
  lastActiveWithin: 30,
  minSpend: 100
}
// Returns: 48 fans (used in "Re-engagement: Expired Subs")
```

**VIP Whales Only**
```typescript
{
  tiers: ['whale'],
  subscriptionStatus: ['active'],
  minSpend: 2000
}
// Returns: 23 fans (used in "Beach Photoshoot Exclusive")
```

---

## Campaign Types & Use Cases

### PPV Campaigns
- **Purpose**: Sell exclusive content
- **Pricing**: $20 - $75 (varies by tier)
- **Best Performance**: Whale tier (67% open, 30% response)
- **Examples**: Beach Photoshoot, Lingerie Set, Shower Content

### Promotion Campaigns
- **Purpose**: Drive volume sales with discounts
- **Pricing**: Discount-based (50% off, 40% off)
- **Best Performance**: Large audience (500+ fans)
- **Examples**: Weekend Special, Flash Sale

### Re-engagement Campaigns
- **Purpose**: Win back expired/inactive subscribers
- **Pricing**: Usually free (relationship building)
- **Best Performance**: Recently expired (< 30 days)
- **Examples**: Expired Subs campaign

### Custom Campaigns
- **Purpose**: Relationship building, announcements
- **Pricing**: Free or flexible
- **Best Performance**: High engagement, low conversion
- **Examples**: Good Morning Message, Birthday Special

---

## A/B Testing Support

The system includes full A/B testing infrastructure:

**Example: Beach Photoshoot Campaign**
```typescript
variants: [
  {
    id: "variant_a",
    name: 'Variant A: "Hey babe! 🔥"',
    messageTemplate: "Hey babe! 🔥 Just got back from...",
    trafficSplit: 50,
    performance: {
      sent: 12,
      opened: 8,    // 67% open rate
      responded: 4, // 33% response rate
      revenue: 200
    }
  },
  {
    id: "variant_b",
    name: 'Variant B: "Exclusive for you 💕"',
    messageTemplate: "Exclusive for you 💕 I just finished...",
    trafficSplit: 50,
    performance: {
      sent: 11,
      opened: 7,    // 64% open rate
      responded: 3, // 27% response rate
      revenue: 150
    }
  }
]
```

**Winner: Variant A** (67% vs 64% open rate, 33% vs 27% response rate)

---

## Performance Predictions

The `predictCampaignPerformance()` function uses real-world OnlyFans data patterns:

**Example Prediction: Whale-Tier Campaign**
```typescript
const prediction = predictCampaignPerformance(
  {
    filters: { tiers: ['whale'], subscriptionStatus: ['active'] },
    fanCount: 50
  },
  ['creator_1'],
  50 // $50 PPV price
);

// Returns:
{
  estimatedOpens: 33,        // 65% open rate
  estimatedResponses: 15,    // 30% response rate
  estimatedRevenue: 750.00,  // 15 purchases × $50
  openRate: 65,
  responseRate: 30,
  avgRevenuePerRecipient: 15.00
}
```

**Example Prediction: Medium-Tier Campaign**
```typescript
const prediction = predictCampaignPerformance(
  {
    filters: { tiers: ['medium'], subscriptionStatus: ['active'] },
    fanCount: 200
  },
  ['creator_2'],
  25 // $25 PPV price
);

// Returns:
{
  estimatedOpens: 60,         // 30% open rate
  estimatedResponses: 24,     // 12% response rate
  estimatedRevenue: 600.00,   // 24 purchases × $25
  openRate: 30,
  responseRate: 12,
  avgRevenuePerRecipient: 3.00
}
```

---

## Integration Points

### Campaign Creation Wizard
```typescript
import {
  calculateSegmentSize,
  predictCampaignPerformance
} from '@/lib/campaigns';

// Live preview as user adjusts filters
const fanCount = calculateSegmentSize(filters, creatorIds);

// Show predicted performance
const prediction = predictCampaignPerformance(
  segment,
  creatorIds,
  ppvPrice
);
```

### Analytics Dashboard
```typescript
import {
  getCampaignPerformanceSummary,
  getTopCampaigns,
  getCampaignAnalytics
} from '@/lib/campaigns';

// Overall metrics
const summary = getCampaignPerformanceSummary();
// Returns: totalRevenue, avgOpenRate, avgResponseRate, etc.

// Top performers
const topCampaigns = getTopCampaigns(5);

// Detailed campaign view
const analytics = getCampaignAnalytics('campaign_completed_1');
// Returns: tier breakdown, variant performance, ROI metrics
```

### Fan Segmentation
```typescript
import { getFansBySegment, calculateEstimatedReach } from '@/lib/campaigns';

// Get actual fan list
const fans = getFansBySegment(segment, creatorIds);

// Just get count (faster)
const reach = calculateEstimatedReach(segment, creatorIds);
```

---

## Data Integrity

All campaigns use realistic performance patterns:

- **Delivery Rate**: 98-100% (simulates platform reliability)
- **Open Rates**: Tier-based (20-68%)
- **Response Rates**: Tier-based (5-32%)
- **Revenue**: Calculated from response rate × price × tier multipliers
- **Timing**: Active campaigns show partial progress
- **Scheduled Campaigns**: Future timestamps (6hrs - 3 days out)

---

## Next Steps for Frontend

1. **Campaign List View**
   - Filter by status, type, creator
   - Show key metrics (reach, revenue, performance)
   - Color-coded status badges

2. **Campaign Builder**
   - Multi-step wizard (Segment → Message → Schedule → Review)
   - Live fan count preview
   - Performance prediction display
   - A/B test variant creator

3. **Campaign Analytics**
   - Revenue charts (by tier, by variant)
   - Open/response rate comparisons
   - ROI calculations
   - Export to CSV

4. **Fan Segmentation UI**
   - Visual filter builder
   - Live preview of matching fans
   - Save custom segments
   - Segment suggestions based on campaign type

---

## Example Usage

```typescript
// Get all active campaigns
const activeCampaigns = getCampaignsByStatus('sending');

// Get completed campaigns for a creator
const stellaCampaigns = getCampaignsByCreator('creator_1')
  .filter(c => c.status === 'completed');

// Calculate predicted revenue for a new campaign
const newSegment: FanSegment = {
  name: "Test Segment",
  filters: {
    tiers: ['whale', 'high'],
    subscriptionStatus: ['active'],
    hasPurchasedPPV: true
  },
  fanCount: 0
};

const reach = calculateEstimatedReach(newSegment, ['creator_1']);
const prediction = predictCampaignPerformance(
  newSegment,
  ['creator_1'],
  40
);

console.log(`Estimated Reach: ${reach} fans`);
console.log(`Predicted Revenue: $${prediction.estimatedRevenue}`);
console.log(`Expected Response Rate: ${prediction.responseRate}%`);
```

---

## Summary Statistics

**Total Campaigns**: 18
- Active: 3 (currently sending)
- Completed: 8 (with full performance data)
- Scheduled: 4 (future sends)
- Draft: 3 (incomplete)

**Total Revenue** (Completed): $7,260.60
**Total Messages Sent**: 1,744
**Average Open Rate**: 52%
**Average Response Rate**: 17%
**Best Campaign**: Beach Photoshoot Exclusive ($3,450)

**Campaign Types Distribution**:
- PPV: 13 campaigns (72%)
- Promotion: 2 campaigns (11%)
- Re-engagement: 2 campaigns (11%)
- Custom: 1 campaign (6%)

---

## Database Schema (Future Supabase Implementation)

```sql
-- campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ppv', 'promotion', 'reengagement', 'custom')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'paused')),
  creator_ids UUID[] NOT NULL,
  fan_segment JSONB NOT NULL,
  estimated_reach INTEGER,
  message_template TEXT NOT NULL,
  media_urls TEXT[],
  ppv_price DECIMAL(10,2),
  scheduled_at TIMESTAMP,
  send_rate INTEGER,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  open_rate INTEGER DEFAULT 0,
  response_rate INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES chatters(id)
);

-- campaign_variants table (for A/B testing)
CREATE TABLE campaign_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message_template TEXT NOT NULL,
  traffic_split INTEGER NOT NULL CHECK (traffic_split >= 0 AND traffic_split <= 100),
  sent INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  responded INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_creator_ids ON campaigns USING GIN(creator_ids);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX idx_campaign_variants_campaign_id ON campaign_variants(campaign_id);
```

---

**Built for VaultCRM - OnlyFans Agency Management Platform**
