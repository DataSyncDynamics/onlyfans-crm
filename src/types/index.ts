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
  messageContent?: string; // Full message content for message transactions
  messagePreview?: string; // Truncated preview for lists
  conversationThread?: Message[]; // 2-3 messages leading up to the paid message
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
  type: "ppv" | "promotion" | "reengagement" | "custom";
  status: "draft" | "scheduled" | "sending" | "completed" | "paused";

  creatorIds: string[];
  fanSegment: FanSegment;
  estimatedReach: number;

  messageTemplate: string;
  mediaUrls?: string[];
  ppvPrice?: number;

  scheduledAt?: Date;
  sendRate?: number; // messages per hour

  variants?: CampaignVariant[];

  sentCount: number;
  deliveredCount: number;
  openRate: number;
  responseRate: number;
  revenue: number;

  createdAt: Date;
  createdBy: string;
}

export interface FanSegment {
  name: string;
  filters: {
    tiers?: ("whale" | "high" | "medium" | "low")[];
    minSpend?: number;
    maxSpend?: number;
    subscriptionStatus?: ("active" | "expired" | "cancelled")[];
    lastActiveWithin?: number; // days
    hasPurchasedPPV?: boolean;
    tags?: string[];
  };
  fanCount: number;
}

export interface CampaignVariant {
  id: string;
  name: string;
  messageTemplate: string;
  trafficSplit: number;
  performance: {
    sent: number;
    opened: number;
    responded: number;
    revenue: number;
  };
}

export interface CampaignPrediction {
  estimatedOpens: number;
  estimatedResponses: number;
  estimatedRevenue: number;
  openRate: number;
  responseRate: number;
  avgRevenuePerRecipient: number;
}

export interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalResponded: number;
  totalRevenue: number;
  openRate: number;
  responseRate: number;
  revenuePerRecipient: number;
  byTier: {
    tier: "whale" | "high" | "medium" | "low";
    sent: number;
    opened: number;
    responded: number;
    revenue: number;
  }[];
  variantPerformance?: {
    variantId: string;
    variantName: string;
    sent: number;
    opened: number;
    responded: number;
    revenue: number;
    openRate: number;
    responseRate: number;
  }[];
}

// ============================================================================
// SHIFT SCHEDULING
// ============================================================================

export interface Shift {
  id: string;
  chatterId: string;
  creatorIds: string[]; // Which creators they cover
  startTime: Date;
  endTime: Date;
  recurrence?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  handoffNotes?: string;
  coverage?: {
    messagesHandled: number;
    revenue: number;
    avgResponseTime: number;
  };
}

export interface ShiftHandoff {
  id: string;
  fromChatterId: string;
  toChatterId: string;
  shiftDate: Date;
  notes: string;
  urgentFans?: string[];
  createdAt: Date;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  chatterId: string;
  creatorIds: string[];
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  daysOfWeek: number[]; // [1,2,3,4,5] = Mon-Fri (0=Sunday, 6=Saturday)
  isActive: boolean;
}

export interface ShiftConflict {
  shift1: Shift;
  shift2: Shift;
  type: 'overlap' | 'double_booking';
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface ShiftStats {
  chatterId: string;
  totalShifts: number;
  totalHours: number;
  completedShifts: number;
  cancelledShifts: number;
  avgMessagesPerShift: number;
  avgRevenuePerShift: number;
  avgResponseTime: number;
  coverageByCreator: {
    creatorId: string;
    shifts: number;
    hours: number;
  }[];
}

// ============================================================================
// AI CHAT ASSISTANT
// ============================================================================

export interface Conversation {
  id: string;
  fanId: string;
  creatorId: string;
  chatterId: string;
  lastMessageAt: Date;
  status: 'active' | 'waiting' | 'archived';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  unreadCount: number;
  messages: ChatMessage[];
  aiContext?: {
    fanTier: 'whale' | 'high' | 'medium' | 'low';
    totalSpent: number;
    recentPurchases: string[];
    engagementLevel: number; // 0-100
  };
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  sentBy: 'fan' | 'chatter';
  sentAt: Date;
  aiSuggestion?: boolean;
  detectedKeywords?: string[];
}

export interface AISuggestion {
  id: string;
  conversationId: string;
  type: 'reply' | 'upsell' | 'ppv' | 'engagement';
  message: string;
  confidence: number; // 0-100
  reasoning: string;
  suggestedPrice?: number;
  createdAt: Date;
}

export interface KeywordAlert {
  id: string;
  keyword: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  action: 'flag' | 'auto_reply' | 'notify_manager';
  responseTemplate?: string;
  color: string;
}

export interface MessageTemplate {
  id: string;
  category: 'greeting' | 'ppv_pitch' | 'custom_offer' | 'reengagement' | 'appreciation';
  name: string;
  message: string;
  usageCount: number;
  avgConversionRate: number;
  variables?: string[];
}

// ============================================================================
// CONTENT VAULT
// ============================================================================

export interface ContentItem {
  id: string;
  creatorId: string;
  type: 'photo' | 'video' | 'photoset';
  title: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl: string;
  fileSize: number; // bytes
  duration?: number; // seconds for videos
  uploadedAt: Date;
  tags: string[];
  collections: string[]; // collection IDs
  isPPV: boolean;
  ppvPrice?: number;
  ppvPurchases?: number;
  ppvRevenue?: number;
  isPublic: boolean;
  publicViews?: number;
  likes?: number;
  status: 'active' | 'archived' | 'draft';
}

export interface ContentCollection {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentAnalytics {
  totalItems: number;
  totalSize: number; // bytes
  ppvItems: number;
  ppvRevenue: number;
  publicItems: number;
  totalViews: number;
  totalLikes: number;
  topPerformingItems: ContentItem[];
  revenueByMonth: { month: string; revenue: number }[];
}

// ============================================================================
// ONLYFANS INTEGRATION
// ============================================================================

export interface OnlyFansConnection {
  id: string;
  creatorId: string;
  ofUsername: string;
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  autoSync: boolean;
  syncInterval: number; // hours
  syncSettings: {
    syncMessages: boolean;
    syncSubscribers: boolean;
    syncRevenue: boolean;
    syncContent: boolean;
  };
  apiKeyLastFour?: string;
  connectedAt: Date;
  errorMessage?: string;
}

export interface SyncActivity {
  id: string;
  connectionId: string;
  type: 'manual' | 'automatic';
  status: 'in_progress' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  itemsSynced: {
    messages: number;
    subscribers: number;
    transactions: number;
    content: number;
  };
  errors?: string[];
}

export interface SyncPreview {
  newMessages: number;
  newSubscribers: number;
  newTransactions: number;
  newContent: number;
  estimatedDuration: number; // seconds
}
