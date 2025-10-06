/**
 * OnlyFans API Integration Layer
 * Handles all communication with OnlyFans API
 */

import { Creator, Fan, Transaction } from "@/types";

// API Configuration
const ONLYFANS_API_BASE_URL = process.env.ONLYFANS_API_URL || "https://onlyfans.com/api2/v2";
const ONLYFANS_API_KEY = process.env.ONLYFANS_API_KEY;

// Rate limiting
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
let lastRequestTime = 0;

/**
 * Rate limit helper - ensures we don't exceed API limits
 */
async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
}

/**
 * Make authenticated request to OnlyFans API
 */
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> {
  await rateLimit();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add authentication
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  } else if (ONLYFANS_API_KEY) {
    headers["X-API-Key"] = ONLYFANS_API_KEY;
  }

  const response = await fetch(`${ONLYFANS_API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OnlyFans API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ============================================================================
// TYPES - OnlyFans API Response Formats
// ============================================================================

interface OFCreatorStats {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  subscribersCount: number;
  activeSubscribersCount: number;
  totalEarnings: number; // in cents
  monthlyEarnings: number; // in cents
}

interface OFTransaction {
  id: string;
  userId: string;
  username: string;
  type: "subscription" | "tip" | "post" | "message" | "stream";
  amount: number; // in cents
  description?: string;
  createdAt: string;
  status: "successful" | "pending" | "refunded";
}

interface OFSubscriber {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  subscribedAt: string;
  renewsAt?: string;
  status: "active" | "expired" | "cancelled";
  totalSpent: number; // in cents
  messageCount: number;
  tipCount: number;
  ppvPurchases: number;
}

interface OFRevenueBreakdown {
  subscriptions: number; // in cents
  tips: number;
  messages: number;
  posts: number; // PPV
  streams: number;
}

// ============================================================================
// PUBLIC API METHODS
// ============================================================================

export class OnlyFansAPI {
  /**
   * Authenticate and get creator access
   */
  static async authenticateCreator(
    ofUsername: string,
    accessToken: string
  ): Promise<{ valid: boolean; creatorId?: string }> {
    try {
      const data = await makeRequest<{ user: { id: string } }>(
        `/users/${ofUsername}`,
        { method: "GET" },
        accessToken
      );

      return {
        valid: true,
        creatorId: data.user.id,
      };
    } catch (error) {
      console.error("Authentication failed:", error);
      return { valid: false };
    }
  }

  /**
   * Get creator statistics and metrics
   */
  static async getCreatorStats(
    ofUsername: string,
    accessToken: string
  ): Promise<OFCreatorStats | null> {
    try {
      const data = await makeRequest<{ stats: OFCreatorStats }>(
        `/creators/${ofUsername}/stats`,
        { method: "GET" },
        accessToken
      );

      return data.stats;
    } catch (error) {
      console.error("Failed to fetch creator stats:", error);
      return null;
    }
  }

  /**
   * Get transaction history for a date range
   */
  static async getTransactionHistory(
    ofUsername: string,
    accessToken: string,
    startDate: Date,
    endDate: Date = new Date()
  ): Promise<OFTransaction[]> {
    try {
      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const data = await makeRequest<{ transactions: OFTransaction[] }>(
        `/creators/${ofUsername}/transactions?${params}`,
        { method: "GET" },
        accessToken
      );

      return data.transactions || [];
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return [];
    }
  }

  /**
   * Get subscriber/fan list
   */
  static async getSubscribers(
    ofUsername: string,
    accessToken: string
  ): Promise<OFSubscriber[]> {
    try {
      const data = await makeRequest<{ subscribers: OFSubscriber[] }>(
        `/creators/${ofUsername}/subscribers`,
        { method: "GET" },
        accessToken
      );

      return data.subscribers || [];
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      return [];
    }
  }

  /**
   * Get revenue breakdown by type
   */
  static async getRevenueBreakdown(
    ofUsername: string,
    accessToken: string,
    startDate: Date,
    endDate: Date = new Date()
  ): Promise<OFRevenueBreakdown | null> {
    try {
      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const data = await makeRequest<{ breakdown: OFRevenueBreakdown }>(
        `/creators/${ofUsername}/revenue/breakdown?${params}`,
        { method: "GET" },
        accessToken
      );

      return data.breakdown;
    } catch (error) {
      console.error("Failed to fetch revenue breakdown:", error);
      return null;
    }
  }

  /**
   * Get engagement metrics (messages, response times)
   */
  static async getEngagementMetrics(
    ofUsername: string,
    accessToken: string
  ): Promise<{
    totalMessages: number;
    avgResponseTime: number;
    conversionRate: number;
  } | null> {
    try {
      const data = await makeRequest<{
        metrics: {
          totalMessages: number;
          avgResponseTimeMinutes: number;
          conversionRate: number;
        };
      }>(
        `/creators/${ofUsername}/engagement`,
        { method: "GET" },
        accessToken
      );

      return {
        totalMessages: data.metrics.totalMessages,
        avgResponseTime: data.metrics.avgResponseTimeMinutes,
        conversionRate: data.metrics.conversionRate,
      };
    } catch (error) {
      console.error("Failed to fetch engagement metrics:", error);
      return null;
    }
  }
}

// ============================================================================
// DATA MAPPERS - Convert OnlyFans format to our data models
// ============================================================================

/**
 * Map OnlyFans transaction to our Transaction model
 */
export function mapOFTransactionToTransaction(
  ofTxn: OFTransaction,
  creatorId: string,
  fanId: string
): Omit<Transaction, "id"> {
  // Map OF types to our types
  const typeMap: Record<string, Transaction["type"]> = {
    subscription: "subscription",
    tip: "tip",
    post: "ppv",
    message: "message",
    stream: "ppv", // Treat streams as PPV
  };

  // Map OF status to our status
  const statusMap: Record<string, Transaction["status"]> = {
    successful: "completed",
    pending: "pending",
    refunded: "refunded",
  };

  return {
    fanId,
    creatorId,
    type: typeMap[ofTxn.type] || "subscription",
    amount: ofTxn.amount / 100, // Convert cents to dollars
    description: ofTxn.description,
    createdAt: new Date(ofTxn.createdAt),
    status: statusMap[ofTxn.status] || "completed",
  };
}

/**
 * Map OnlyFans subscriber to our Fan model
 */
export function mapOFSubscriberToFan(
  ofSub: OFSubscriber,
  creatorId: string
): Omit<Fan, "id"> {
  // Calculate tier based on total spent
  const totalSpentDollars = ofSub.totalSpent / 100;
  let tier: Fan["tier"] = "low";

  if (totalSpentDollars >= 1000) tier = "whale";
  else if (totalSpentDollars >= 500) tier = "high";
  else if (totalSpentDollars >= 100) tier = "medium";

  return {
    username: ofSub.username,
    displayName: ofSub.displayName,
    creatorId,
    tier,
    totalSpent: totalSpentDollars,
    messageCount: ofSub.messageCount,
    tipCount: ofSub.tipCount,
    ppvPurchases: ofSub.ppvPurchases,
    subscriptionStatus: ofSub.status as Fan["subscriptionStatus"],
    subscriptionRenewsAt: ofSub.renewsAt ? new Date(ofSub.renewsAt) : undefined,
    joinedAt: new Date(ofSub.subscribedAt),
    lastActiveAt: new Date(), // Would need separate API call for this
  };
}

/**
 * Calculate creator metrics from synced data
 */
export function calculateCreatorMetrics(
  stats: OFCreatorStats
): Pick<Creator, "totalRevenue" | "totalFans" | "activeFans"> {
  return {
    totalRevenue: stats.totalEarnings / 100, // Convert cents to dollars
    totalFans: stats.subscribersCount,
    activeFans: stats.activeSubscribersCount,
  };
}
