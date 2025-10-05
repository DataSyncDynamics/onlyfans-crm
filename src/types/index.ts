// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  ofUsername: string; // OnlyFans username
  avatarUrl?: string;
  bio?: string;
  subscriptionPrice: number;
  totalRevenue: number;
  totalFans: number;
  activeFans: number;
  joinedAt: Date;
  status: "active" | "inactive" | "suspended";
  tags?: string[];
}

export interface Fan {
  id: string;
  username: string;
  displayName?: string;
  email?: string;
  creatorId: string; // Which creator they follow
  tier: "whale" | "high" | "medium" | "low"; // Spending tier
  totalSpent: number;
  messageCount: number;
  tipCount: number;
  ppvPurchases: number;
  subscriptionStatus: "active" | "expired" | "cancelled";
  subscriptionRenewsAt?: Date;
  joinedAt: Date;
  lastActiveAt: Date;
  tags?: string[];
  notes?: string;
  riskScore?: number; // Churn risk (0-100)
}

export interface Chatter {
  id: string;
  name: string;
  email: string;
  role: "lead" | "senior" | "junior";
  assignedCreators: string[]; // Creator IDs they handle
  messageCount: number;
  revenueGenerated: number;
  avgResponseTime: number; // in minutes
  conversionRate: number; // percentage
  performanceScore: number; // A-F mapped to 0-100
  status: "active" | "on_break" | "offline";
  shiftsThisWeek: number;
  hoursWorked: number;
  joinedAt: Date;
}

export interface Transaction {
  id: string;
  fanId: string;
  creatorId: string;
  chatterId?: string; // If chatter facilitated
  type: "subscription" | "tip" | "ppv" | "message";
  amount: number;
  description?: string;
  createdAt: Date;
  status: "completed" | "pending" | "refunded";
}

export interface Message {
  id: string;
  fanId: string;
  creatorId: string;
  chatterId?: string;
  content: string;
  type: "text" | "media" | "ppv_offer";
  sentBy: "fan" | "creator";
  sentAt: Date;
  read: boolean;
}

// ============================================================================
// ANALYTICS & METRICS
// ============================================================================

export interface AgencyMetrics {
  totalRevenue: number;
  totalFans: number;
  activeFans: number;
  churnRate: number;
  avgRevenuePerFan: number;
  topCreatorId: string;
  topFanId: string;
  messagesThisMonth: number;
  conversionRate: number;
}

export interface RevenueData {
  date: Date;
  subscriptions: number;
  tips: number;
  messages: number;
  ppv: number;
  total: number;
}

export interface Metric {
  label: string;
  value: number | string;
  change: number;
  trend: "up" | "down" | "neutral";
  period: string;
}

// ============================================================================
// UI & MISC
// ============================================================================

export interface Alert {
  id: string;
  type: "revenue" | "message" | "chat" | "warning" | "info";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "promotion" | "content" | "announcement";
  status: "draft" | "active" | "completed" | "paused";
  startDate: Date;
  endDate?: Date;
  targetAudience?: string[];
  metrics?: {
    views: number;
    clicks: number;
    conversions: number;
  };
}
