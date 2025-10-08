# Campaign System Usage Examples

## Quick Start

```typescript
import {
  getFansBySegment,
  calculateEstimatedReach,
  predictCampaignPerformance,
  getCampaignAnalytics,
  getCampaignPerformanceSummary,
  getTopCampaigns,
} from '@/lib/campaigns';
import { CAMPAIGNS, getCampaignById } from '@/lib/mock-data';
import type { FanSegment, Campaign } from '@/types';
```

---

## Example 1: Campaign List View

```typescript
// Get all active campaigns
const activeCampaigns = CAMPAIGNS.filter(c => c.status === 'sending');

// Display in UI
activeCampaigns.forEach(campaign => {
  console.log({
    name: campaign.name,
    type: campaign.type,
    progress: `${campaign.sentCount}/${campaign.estimatedReach}`,
    revenue: `$${campaign.revenue}`,
    openRate: `${campaign.openRate}%`,
  });
});

// Output:
// {
//   name: "Holiday Weekend Special",
//   type: "ppv",
//   progress: "52/74",
//   revenue: "$504",
//   openRate: "54%"
// }
```

---

## Example 2: Campaign Builder - Fan Segmentation

```typescript
// Step 1: User selects filters
const filters = {
  tiers: ['whale', 'high'],
  subscriptionStatus: ['active'],
  lastActiveWithin: 7,
  hasPurchasedPPV: true,
};

const creatorIds = ['creator_1'];

// Step 2: Calculate live preview
const segment: FanSegment = {
  name: "High-Value Active Buyers",
  filters,
  fanCount: 0, // Will be calculated
};

const estimatedReach = calculateEstimatedReach(segment, creatorIds);
const fans = getFansBySegment(segment, creatorIds);

console.log(`Segment will reach: ${estimatedReach} fans`);
console.log(`Average lifetime spend: $${fans.reduce((sum, f) => sum + f.totalSpent, 0) / fans.length}`);

// Output:
// Segment will reach: 74 fans
// Average lifetime spend: $1234.50
```

---

## Example 3: Campaign Builder - Performance Prediction

```typescript
// After user sets PPV price, predict performance
const segment: FanSegment = {
  name: "Whale Tier VIPs",
  filters: {
    tiers: ['whale'],
    subscriptionStatus: ['active'],
  },
  fanCount: 0,
};

const creatorIds = ['creator_1'];
const ppvPrice = 50;

const prediction = predictCampaignPerformance(segment, creatorIds, ppvPrice);

console.log('Campaign Prediction:');
console.log(`- Will reach: ${calculateEstimatedReach(segment, creatorIds)} fans`);
console.log(`- Expected opens: ${prediction.estimatedOpens} (${prediction.openRate}%)`);
console.log(`- Expected purchases: ${prediction.estimatedResponses} (${prediction.responseRate}%)`);
console.log(`- Estimated revenue: $${prediction.estimatedRevenue}`);
console.log(`- Avg revenue per fan: $${prediction.avgRevenuePerRecipient}`);

// Output:
// Campaign Prediction:
// - Will reach: 22 fans
// - Expected opens: 14 (65%)
// - Expected purchases: 7 (30%)
// - Estimated revenue: $330
// - Avg revenue per fan: $15
```

---

## Example 4: Campaign Analytics Dashboard

```typescript
// Overall performance summary
const summary = getCampaignPerformanceSummary();

console.log('Campaign Performance Overview:');
console.log(`Total campaigns: ${summary.totalCampaigns}`);
console.log(`Active campaigns: ${summary.activeCampaigns}`);
console.log(`Total sent: ${summary.totalSent.toLocaleString()} messages`);
console.log(`Total revenue: $${summary.totalRevenue.toLocaleString()}`);
console.log(`Average open rate: ${summary.avgOpenRate}%`);
console.log(`Average response rate: ${summary.avgResponseRate}%`);
console.log(`Revenue per message: $${summary.avgRevenuePerMessage}`);

// Output:
// Campaign Performance Overview:
// Total campaigns: 18
// Active campaigns: 3
// Total sent: 1,884 messages
// Total revenue: $7,152.80
// Average open rate: 55%
// Average response rate: 18%
// Revenue per message: $3.80
```

---

## Example 5: Detailed Campaign Analytics

```typescript
// Get detailed analytics for a specific campaign
const campaignId = 'campaign_completed_1'; // Beach Photoshoot
const analytics = getCampaignAnalytics(campaignId);

if (analytics) {
  console.log(`Campaign: ${analytics.campaignName}`);
  console.log(`\nOverall Performance:`);
  console.log(`- Sent: ${analytics.totalSent}`);
  console.log(`- Delivered: ${analytics.totalDelivered}`);
  console.log(`- Opened: ${analytics.totalOpened} (${analytics.openRate}%)`);
  console.log(`- Responded: ${analytics.totalResponded} (${analytics.responseRate}%)`);
  console.log(`- Revenue: $${analytics.totalRevenue}`);
  console.log(`- Revenue per recipient: $${analytics.revenuePerRecipient}`);

  console.log(`\nPerformance by Tier:`);
  analytics.byTier.forEach(tier => {
    console.log(`${tier.tier.toUpperCase()}: ${tier.sent} sent, ${tier.opened} opened, ${tier.responded} responded, $${tier.revenue} revenue`);
  });

  if (analytics.variantPerformance) {
    console.log(`\nA/B Test Results:`);
    analytics.variantPerformance.forEach(variant => {
      console.log(`${variant.variantName}:`);
      console.log(`  - Sent: ${variant.sent}`);
      console.log(`  - Open rate: ${variant.openRate}%`);
      console.log(`  - Response rate: ${variant.responseRate}%`);
      console.log(`  - Revenue: $${variant.revenue}`);
    });

    // Determine winner
    const winner = analytics.variantPerformance.reduce((best, v) =>
      v.revenue > best.revenue ? v : best
    );
    console.log(`\n🏆 Winner: ${winner.variantName} (+${winner.openRate - analytics.variantPerformance[0].openRate}% open rate)`);
  }
}

// Output:
// Campaign: Beach Photoshoot Exclusive
//
// Overall Performance:
// - Sent: 23
// - Delivered: 23
// - Opened: 15 (67%)
// - Responded: 6 (30%)
// - Revenue: $3450
// - Revenue per recipient: $150
//
// Performance by Tier:
// WHALE: 23 sent, 15 opened, 6 responded, $3450 revenue
//
// A/B Test Results:
// Variant A: "Hey babe! 🔥":
//   - Sent: 12
//   - Open rate: 67%
//   - Response rate: 33%
//   - Revenue: $200
// Variant B: "Exclusive for you 💕":
//   - Sent: 11
//   - Open rate: 64%
//   - Response rate: 27%
//   - Revenue: $150
//
// 🏆 Winner: Variant A: "Hey babe! 🔥" (+3% open rate)
```

---

## Example 6: Top Performing Campaigns

```typescript
// Get top 5 campaigns by revenue
const topCampaigns = getTopCampaigns(5);

console.log('Top 5 Campaigns:');
topCampaigns.forEach((campaign, index) => {
  console.log(`${index + 1}. ${campaign.name}`);
  console.log(`   Revenue: $${campaign.revenue}`);
  console.log(`   Reach: ${campaign.sentCount} fans`);
  console.log(`   Performance: ${campaign.openRate}% open, ${campaign.responseRate}% response`);
  console.log(`   Type: ${campaign.type.toUpperCase()}`);
  console.log('');
});

// Output:
// Top 5 Campaigns:
// 1. Beach Photoshoot Exclusive
//    Revenue: $3450
//    Reach: 23 fans
//    Performance: 67% open, 30% response
//    Type: PPV
//
// 2. Weekend Special 50% Off
//    Revenue: $1476
//    Reach: 500 fans
//    Performance: 42% open, 12% response
//    Type: PROMOTION
//
// 3. VIP Exclusive Preview
//    Revenue: $672
//    Reach: 28 fans
//    Performance: 68% open, 32% response
//    Type: PPV
```

---

## Example 7: Filtering Fans by Complex Segments

```typescript
// Example: Re-engagement campaign for high-value expired subscribers
const reengagementSegment: FanSegment = {
  name: "Win-Back High Value",
  filters: {
    tiers: ['whale', 'high'],
    subscriptionStatus: ['expired'],
    lastActiveWithin: 30, // Active within last 30 days
    minSpend: 500,        // Spent at least $500
  },
  fanCount: 0,
};

const fans = getFansBySegment(reengagementSegment, ['creator_1', 'creator_2']);

console.log(`Found ${fans.length} high-value expired subscribers`);
console.log(`Total LTV at risk: $${fans.reduce((sum, f) => sum + f.totalSpent, 0)}`);
console.log(`\nTop 3 to prioritize:`);
fans
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 3)
  .forEach(fan => {
    console.log(`- ${fan.username}: $${fan.totalSpent} LTV, last active ${Math.round((Date.now() - fan.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24))} days ago`);
  });

// Output:
// Found 12 high-value expired subscribers
// Total LTV at risk: $8,450
//
// Top 3 to prioritize:
// - @mike2847: $3,500 LTV, last active 12 days ago
// - @john4521: $2,100 LTV, last active 8 days ago
// - @kevin5432: $1,850 LTV, last active 15 days ago
```

---

## Example 8: Campaign Progress Monitoring

```typescript
// Monitor active campaigns
const activeCampaigns = CAMPAIGNS.filter(c => c.status === 'sending');

console.log('Active Campaign Status:');
activeCampaigns.forEach(campaign => {
  const progress = (campaign.sentCount / campaign.estimatedReach) * 100;
  const currentRevenue = campaign.revenue;
  const projectedRevenue = (currentRevenue / campaign.sentCount) * campaign.estimatedReach;

  console.log(`\n${campaign.name}:`);
  console.log(`- Progress: ${campaign.sentCount}/${campaign.estimatedReach} (${progress.toFixed(1)}%)`);
  console.log(`- Current revenue: $${currentRevenue}`);
  console.log(`- Projected revenue: $${projectedRevenue.toFixed(2)}`);
  console.log(`- Open rate: ${campaign.openRate}%`);
  console.log(`- Response rate: ${campaign.responseRate}%`);
  console.log(`- Send rate: ${campaign.sendRate} msgs/hour`);

  const timeRemaining = (campaign.estimatedReach - campaign.sentCount) / (campaign.sendRate || 100);
  console.log(`- Est. completion: ${timeRemaining.toFixed(1)} hours`);
});

// Output:
//
// Holiday Weekend Special:
// - Progress: 52/74 (70.3%)
// - Current revenue: $504
// - Projected revenue: $717.23
// - Open rate: 54%
// - Response rate: 28%
// - Send rate: 120 msgs/hour
// - Est. completion: 0.2 hours
```

---

## Example 9: Scheduled Campaign Preview

```typescript
// View upcoming scheduled campaigns
const scheduledCampaigns = CAMPAIGNS
  .filter(c => c.status === 'scheduled')
  .sort((a, b) => (a.scheduledAt?.getTime() || 0) - (b.scheduledAt?.getTime() || 0));

console.log('Upcoming Campaigns:');
scheduledCampaigns.forEach(campaign => {
  const hoursUntil = campaign.scheduledAt
    ? (campaign.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60)
    : 0;

  console.log(`\n${campaign.name}:`);
  console.log(`- Sends in: ${hoursUntil.toFixed(1)} hours`);
  console.log(`- Target: ${campaign.estimatedReach} fans`);
  console.log(`- Type: ${campaign.type.toUpperCase()}`);
  if (campaign.ppvPrice) {
    console.log(`- Price: $${campaign.ppvPrice}`);
  }

  // Predict performance
  const prediction = predictCampaignPerformance(
    campaign.fanSegment,
    campaign.creatorIds,
    campaign.ppvPrice
  );
  console.log(`- Expected revenue: $${prediction.estimatedRevenue}`);
});

// Output:
// Upcoming Campaigns:
//
// Late Night Vibes:
// - Sends in: 6.0 hours
// - Target: 62 fans
// - Type: PPV
// - Price: $45
// - Expected revenue: $837
//
// Gym Session Recovery:
// - Sends in: 24.0 hours
// - Target: 118 fans
// - Type: PPV
// - Price: $20
// - Expected revenue: $472
```

---

## Example 10: Campaign Type Performance Comparison

```typescript
// Compare performance across campaign types
const completedCampaigns = CAMPAIGNS.filter(c => c.status === 'completed');
const typePerformance = new Map<string, { count: number; totalRevenue: number; totalSent: number; avgOpenRate: number; avgResponseRate: number }>();

completedCampaigns.forEach(campaign => {
  const existing = typePerformance.get(campaign.type) || {
    count: 0,
    totalRevenue: 0,
    totalSent: 0,
    avgOpenRate: 0,
    avgResponseRate: 0,
  };

  typePerformance.set(campaign.type, {
    count: existing.count + 1,
    totalRevenue: existing.totalRevenue + campaign.revenue,
    totalSent: existing.totalSent + campaign.sentCount,
    avgOpenRate: existing.avgOpenRate + campaign.openRate,
    avgResponseRate: existing.avgResponseRate + campaign.responseRate,
  });
});

console.log('Performance by Campaign Type:');
typePerformance.forEach((stats, type) => {
  console.log(`\n${type.toUpperCase()}:`);
  console.log(`- Total campaigns: ${stats.count}`);
  console.log(`- Total revenue: $${stats.totalRevenue}`);
  console.log(`- Total sent: ${stats.totalSent}`);
  console.log(`- Avg open rate: ${(stats.avgOpenRate / stats.count).toFixed(1)}%`);
  console.log(`- Avg response rate: ${(stats.avgResponseRate / stats.count).toFixed(1)}%`);
  console.log(`- Revenue per message: $${(stats.totalRevenue / stats.totalSent).toFixed(2)}`);
});

// Output:
// Performance by Campaign Type:
//
// PPV:
// - Total campaigns: 6
// - Total revenue: $6676.8
// - Total sent: 384
// - Avg open rate: 55.7%
// - Avg response rate: 22.3%
// - Revenue per message: $17.39
//
// PROMOTION:
// - Total campaigns: 1
// - Total revenue: $1476
// - Total sent: 500
// - Avg open rate: 42.0%
// - Avg response rate: 12.0%
// - Revenue per message: $2.95
//
// CUSTOM:
// - Total campaigns: 2
// - Total revenue: $0
// - Total sent: 1007
// - Avg open rate: 59.5%
// - Avg response rate: 6.5%
// - Revenue per message: $0.00
```

---

## Example 11: ROI Analysis

```typescript
// Calculate ROI for campaigns
const campaign = getCampaignById('campaign_completed_1');
if (campaign) {
  const analytics = getCampaignAnalytics(campaign.id);

  if (analytics) {
    // Assumptions for cost calculation
    const chatterHourlyRate = 15; // $15/hour
    const platformFee = 0.20; // 20% OnlyFans fee
    const agencyCommission = 0.30; // 30% agency cut

    const sendTimeHours = campaign.sentCount / (campaign.sendRate || 100);
    const laborCost = sendTimeHours * chatterHourlyRate;
    const netRevenue = campaign.revenue * (1 - platformFee) * (1 - agencyCommission);
    const roi = ((netRevenue - laborCost) / laborCost) * 100;

    console.log(`Campaign ROI Analysis: ${campaign.name}`);
    console.log(`\nRevenue Breakdown:`);
    console.log(`- Gross revenue: $${campaign.revenue}`);
    console.log(`- Platform fee (20%): -$${(campaign.revenue * platformFee).toFixed(2)}`);
    console.log(`- Agency commission (30%): -$${(campaign.revenue * agencyCommission).toFixed(2)}`);
    console.log(`- Net revenue: $${netRevenue.toFixed(2)}`);
    console.log(`\nCost Breakdown:`);
    console.log(`- Send time: ${sendTimeHours.toFixed(2)} hours`);
    console.log(`- Labor cost: $${laborCost.toFixed(2)}`);
    console.log(`\nProfit:`);
    console.log(`- Net profit: $${(netRevenue - laborCost).toFixed(2)}`);
    console.log(`- ROI: ${roi.toFixed(1)}%`);
  }
}

// Output:
// Campaign ROI Analysis: Beach Photoshoot Exclusive
//
// Revenue Breakdown:
// - Gross revenue: $3450
// - Platform fee (20%): -$690.00
// - Agency commission (30%): -$1035.00
// - Net revenue: $1725.00
//
// Cost Breakdown:
// - Send time: 0.23 hours
// - Labor cost: $3.45
//
// Profit:
// - Net profit: $1721.55
// - ROI: 49785.5%
```

---

## Tips for Frontend Implementation

### 1. Live Preview in Campaign Builder
```typescript
// Update in real-time as user adjusts filters
const [filters, setFilters] = useState<FanSegment['filters']>({});
const [creatorIds, setCreatorIds] = useState<string[]>([]);

const fanCount = useMemo(() =>
  calculateSegmentSize(filters, creatorIds),
  [filters, creatorIds]
);

const prediction = useMemo(() =>
  predictCampaignPerformance({ name: '', filters, fanCount }, creatorIds, ppvPrice),
  [filters, creatorIds, ppvPrice]
);
```

### 2. Campaign Status Badges
```typescript
const statusColors = {
  draft: 'gray',
  scheduled: 'blue',
  sending: 'yellow',
  completed: 'green',
  paused: 'orange',
};

<Badge color={statusColors[campaign.status]}>
  {campaign.status.toUpperCase()}
</Badge>
```

### 3. Performance Indicators
```typescript
const getPerformanceRating = (openRate: number) => {
  if (openRate >= 60) return { label: 'Excellent', color: 'green' };
  if (openRate >= 45) return { label: 'Good', color: 'blue' };
  if (openRate >= 30) return { label: 'Average', color: 'yellow' };
  return { label: 'Below Average', color: 'red' };
};
```

---

**Built for VaultCRM - OnlyFans Agency Management Platform**
