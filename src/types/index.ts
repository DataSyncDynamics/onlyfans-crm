export interface Fan {
  id: string;
  username: string;
  email?: string;
  totalSpent: number;
  messageCount: number;
  tipCount: number;
  subscriptionStatus: "active" | "inactive" | "expired";
  joinedAt: Date;
  lastActiveAt: Date;
  tags?: string[];
  notes?: string;
}

export interface Chatter {
  id: string;
  name: string;
  email: string;
  messageCount: number;
  revenue: number;
  conversionRate: number;
  status: "active" | "inactive" | "break";
  assignedFans: string[];
  createdAt: Date;
}

export interface Message {
  id: string;
  fanId: string;
  chatterId?: string;
  content: string;
  type: "text" | "media" | "tip";
  amount?: number;
  sentAt: Date;
  isFromFan: boolean;
}

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

export interface RevenueData {
  date: Date;
  subscriptions: number;
  tips: number;
  messages: number;
  total: number;
}

export interface Metric {
  label: string;
  value: number | string;
  change: number;
  trend: "up" | "down" | "neutral";
  period: string;
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
