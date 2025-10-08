import {
  Fan,
  FanSegment,
  Campaign,
  CampaignPrediction,
  CampaignAnalytics,
} from "@/types";
import { FANS, CAMPAIGNS } from "./mock-data";

// ============================================================================
// FAN SEGMENTATION
// ============================================================================

/**
 * Get all fans matching a specific segment criteria
 */
export function getFansBySegment(
  segment: FanSegment,
  creatorIds?: string[]
): Fan[] {
  let fans = [...FANS];

  // Filter by creator if specified
  if (creatorIds && creatorIds.length > 0) {
    fans = fans.filter((f) => creatorIds.includes(f.creatorId));
  }

  const { filters } = segment;

  // Apply tier filter
  if (filters.tiers && filters.tiers.length > 0) {
    fans = fans.filter((f) => filters.tiers?.includes(f.tier));
  }

  // Apply spend range filter
  if (filters.minSpend !== undefined) {
    fans = fans.filter((f) => f.totalSpent >= filters.minSpend!);
  }
  if (filters.maxSpend !== undefined) {
    fans = fans.filter((f) => f.totalSpent <= filters.maxSpend!);
  }

  // Apply subscription status filter
  if (filters.subscriptionStatus && filters.subscriptionStatus.length > 0) {
    fans = fans.filter((f) =>
      filters.subscriptionStatus?.includes(f.subscriptionStatus)
    );
  }

  // Apply last active filter
  if (filters.lastActiveWithin !== undefined) {
    const cutoffDate = new Date(
      Date.now() - filters.lastActiveWithin * 24 * 60 * 60 * 1000
    );
    fans = fans.filter((f) => f.lastActiveAt >= cutoffDate);
  }

  // Apply PPV purchase filter
  if (filters.hasPurchasedPPV !== undefined) {
    if (filters.hasPurchasedPPV) {
      fans = fans.filter((f) => f.ppvPurchases > 0);
    } else {
      fans = fans.filter((f) => f.ppvPurchases === 0);
    }
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    fans = fans.filter((f) =>
      filters.tags?.some((tag) => f.tags?.includes(tag))
    );
  }

  return fans;
}

/**
 * Calculate estimated reach for a segment
 */
export function calculateEstimatedReach(
  segment: FanSegment,
  creatorIds: string[]
): number {
  const fans = getFansBySegment(segment, creatorIds);
  return fans.length;
}

/**
 * Calculate real-time segment size (for live preview in UI)
 */
export function calculateSegmentSize(
  filters: FanSegment["filters"],
  creatorIds?: string[]
): number {
  const segment: FanSegment = {
    name: "Preview",
    filters,
    fanCount: 0,
  };

  return calculateEstimatedReach(segment, creatorIds || []);
}

// ============================================================================
// CAMPAIGN PREDICTIONS
// ============================================================================

/**
 * Predict campaign performance based on segment and historical data
 */
export function predictCampaignPerformance(
  segment: FanSegment,
  creatorIds: string[],
  ppvPrice?: number
): CampaignPrediction {
  const fans = getFansBySegment(segment, creatorIds);
  const totalRecipients = fans.length;

  // Calculate tier distribution
  const tierDistribution = {
    whale: fans.filter((f) => f.tier === "whale").length,
    high: fans.filter((f) => f.tier === "high").length,
    medium: fans.filter((f) => f.tier === "medium").length,
    low: fans.filter((f) => f.tier === "low").length,
  };

  // Historical performance by tier (from real OnlyFans data patterns)
  const tierPerformance = {
    whale: { openRate: 0.65, responseRate: 0.3, avgRevenue: 115 },
    high: { openRate: 0.45, responseRate: 0.2, avgRevenue: 45 },
    medium: { openRate: 0.3, responseRate: 0.12, avgRevenue: 18 },
    low: { openRate: 0.2, responseRate: 0.05, avgRevenue: 5 },
  };

  // Calculate weighted predictions
  let estimatedOpens = 0;
  let estimatedResponses = 0;
  let estimatedRevenue = 0;

  (Object.keys(tierDistribution) as Array<keyof typeof tierDistribution>).forEach((tier) => {
    const count = tierDistribution[tier];
    const perf = tierPerformance[tier];

    estimatedOpens += count * perf.openRate;
    estimatedResponses += count * perf.responseRate;

    // If PPV price provided, use it; otherwise use tier average
    if (ppvPrice) {
      estimatedRevenue += count * perf.responseRate * ppvPrice;
    } else {
      estimatedRevenue += count * perf.responseRate * perf.avgRevenue;
    }
  });

  // Calculate overall rates
  const openRate = totalRecipients > 0 ? estimatedOpens / totalRecipients : 0;
  const responseRate =
    totalRecipients > 0 ? estimatedResponses / totalRecipients : 0;
  const avgRevenuePerRecipient =
    totalRecipients > 0 ? estimatedRevenue / totalRecipients : 0;

  return {
    estimatedOpens: Math.round(estimatedOpens),
    estimatedResponses: Math.round(estimatedResponses),
    estimatedRevenue: Math.round(estimatedRevenue * 100) / 100,
    openRate: Math.round(openRate * 100),
    responseRate: Math.round(responseRate * 100),
    avgRevenuePerRecipient: Math.round(avgRevenuePerRecipient * 100) / 100,
  };
}

// ============================================================================
// CAMPAIGN ANALYTICS
// ============================================================================

/**
 * Get detailed analytics for a specific campaign
 */
export function getCampaignAnalytics(campaignId: string): CampaignAnalytics | null {
  const campaign = CAMPAIGNS.find((c) => c.id === campaignId);
  if (!campaign) return null;

  // Get all fans in the segment
  const fans = getFansBySegment(campaign.fanSegment, campaign.creatorIds);

  // Calculate tier breakdown
  const tierBreakdown = ["whale", "high", "medium", "low"].map((tier) => {
    const tierFans = fans.filter((f) => f.tier === tier);
    const tierSent = Math.floor(
      (tierFans.length / fans.length) * campaign.sentCount
    );

    // Apply tier-specific performance multipliers
    const tierMultipliers = {
      whale: { open: 1.3, response: 1.5, revenue: 2.5 },
      high: { open: 1.1, response: 1.2, revenue: 1.5 },
      medium: { open: 0.9, response: 0.8, revenue: 0.8 },
      low: { open: 0.7, response: 0.5, revenue: 0.5 },
    };

    const multiplier =
      tierMultipliers[tier as keyof typeof tierMultipliers] ||
      tierMultipliers.medium;

    const opened = Math.floor(
      tierSent * (campaign.openRate / 100) * multiplier.open
    );
    const responded = Math.floor(
      tierSent * (campaign.responseRate / 100) * multiplier.response
    );
    const revenue = Math.round(
      (campaign.revenue / fans.length) * tierFans.length * multiplier.revenue * 100
    ) / 100;

    return {
      tier: tier as "whale" | "high" | "medium" | "low",
      sent: tierSent,
      opened,
      responded,
      revenue,
    };
  });

  // Calculate variant performance if variants exist
  let variantPerformance = undefined;
  if (campaign.variants && campaign.variants.length > 0) {
    variantPerformance = campaign.variants.map((variant) => {
      const { sent, opened, responded, revenue } = variant.performance;
      return {
        variantId: variant.id,
        variantName: variant.name,
        sent,
        opened,
        responded,
        revenue,
        openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
        responseRate: sent > 0 ? Math.round((responded / sent) * 100) : 0,
      };
    });
  }

  return {
    campaignId: campaign.id,
    campaignName: campaign.name,
    totalSent: campaign.sentCount,
    totalDelivered: campaign.deliveredCount,
    totalOpened: Math.floor((campaign.sentCount * campaign.openRate) / 100),
    totalResponded: Math.floor(
      (campaign.sentCount * campaign.responseRate) / 100
    ),
    totalRevenue: campaign.revenue,
    openRate: campaign.openRate,
    responseRate: campaign.responseRate,
    revenuePerRecipient:
      campaign.sentCount > 0
        ? Math.round((campaign.revenue / campaign.sentCount) * 100) / 100
        : 0,
    byTier: tierBreakdown,
    variantPerformance,
  };
}

/**
 * Get campaign performance summary for dashboard
 */
export function getCampaignPerformanceSummary() {
  const completedCampaigns = CAMPAIGNS.filter((c) => c.status === "completed");

  const totalSent = completedCampaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const totalRevenue = completedCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const avgOpenRate =
    completedCampaigns.reduce((sum, c) => sum + c.openRate, 0) /
    (completedCampaigns.length || 1);
  const avgResponseRate =
    completedCampaigns.reduce((sum, c) => sum + c.responseRate, 0) /
    (completedCampaigns.length || 1);

  return {
    totalCampaigns: CAMPAIGNS.length,
    completedCampaigns: completedCampaigns.length,
    activeCampaigns: CAMPAIGNS.filter((c) => c.status === "sending").length,
    scheduledCampaigns: CAMPAIGNS.filter((c) => c.status === "scheduled").length,
    totalSent,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    avgOpenRate: Math.round(avgOpenRate),
    avgResponseRate: Math.round(avgResponseRate),
    avgRevenuePerMessage:
      totalSent > 0 ? Math.round((totalRevenue / totalSent) * 100) / 100 : 0,
  };
}

/**
 * Get top performing campaigns
 */
export function getTopCampaigns(limit: number = 5): Campaign[] {
  return [...CAMPAIGNS]
    .filter((c) => c.status === "completed")
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

/**
 * Get recent campaigns
 */
export function getRecentCampaigns(limit: number = 10): Campaign[] {
  return [...CAMPAIGNS]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
