export type CampaignType = "ppv" | "promo" | "reengagement" | "welcome";
export type CampaignStatus = "draft" | "scheduled" | "sending" | "completed" | "paused";
export type SendRate = "slow" | "medium" | "fast";

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  creatorIds: string[];

  // Audience
  segmentType: "all" | "whales" | "high-spenders" | "expired" | "ppv-buyers" | "inactive" | "custom";
  targetTiers?: string[];
  spendRange?: { min: number; max: number };
  lastActiveDays?: number;
  subscriptionStatus?: ("active" | "expired" | "cancelled")[];
  hasPurchasedPPV?: boolean;
  targetCount: number;

  // Message
  message: string;
  mediaUrls?: string[];
  ppvPrice?: number;

  // A/B Testing
  hasABTest?: boolean;
  variants?: {
    id: string;
    message: string;
    mediaUrls?: string[];
    trafficSplit: number; // percentage
    opens?: number;
    responses?: number;
    revenue?: number;
  }[];

  // Scheduling
  scheduledFor?: Date;
  sendRate: SendRate;

  // Analytics
  sentCount?: number;
  openedCount?: number;
  respondedCount?: number;
  revenue?: number;

  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface CampaignMetrics {
  sent: number;
  opened: number;
  openRate: number;
  responded: number;
  responseRate: number;
  revenue: number;
  avgRevenuePerFan: number;
  conversionRate: number;
}

export interface FanSegment {
  id: string;
  name: string;
  description: string;
  count: number;
  estimatedRevenue: { min: number; max: number };
}

export interface CampaignTemplate {
  id: string;
  name: string;
  type: CampaignType;
  message: string;
  suggestedPrice?: number;
}
