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

// ============================================================================
// AI CHATTER SYSTEM (Complete Implementation)
// ============================================================================

/**
 * AI-powered conversation tracking
 * Manages full conversation context between fans and creators
 */
export interface AIConversation {
  id: string;
  fanId: string;
  creatorId: string;
  lastMessageAt: Date;
  messageCount: number;
  totalRevenue: number;
  sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated';
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Individual AI-generated or human message
 * Tracks approval status, performance, and revenue attribution
 */
export interface AIMessage {
  id: string;
  conversationId: string;
  fanId: string;
  creatorId: string;
  messageText: string;
  messageType: 'incoming' | 'outgoing';
  isAiGenerated: boolean;
  templateId?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'failed' | 'rejected';
  approvalRequired: boolean;
  approvedBy?: string;
  sentAt?: Date;
  readAt?: Date;
  respondedAt?: Date;
  ppvPrice?: number;
  ppvPurchased?: boolean;
  confidenceScore?: number; // 0-1
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Reusable message template with performance tracking
 * Optimized per fan tier and content type
 */
export interface AITemplate {
  id: string;
  name: string;
  category: 'greeting' | 'ppv_offer' | 'reengagement' | 'response' | 'custom' | 'sexting' | 'upsell';
  templateText: string;
  variables: string[]; // e.g., ['fanName', 'ppvPrice', 'ppvDescription']
  targetTiers: Array<'whale' | 'high' | 'medium' | 'low'>;
  minPrice?: number;
  maxPrice?: number;
  isActive: boolean;
  isNsfw: boolean;
  createdBy?: string;
  timesUsed: number;
  successRate: number; // 0-100 percentage
  avgResponseTimeMinutes?: number;
  avgRevenue: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creator-specific AI personality configuration
 * Defines tone, style, and voice for AI-generated messages
 */
export interface CreatorPersonality {
  id: string;
  creatorId: string;
  tone: 'flirty' | 'casual' | 'dominant' | 'submissive' | 'girlfriend' | 'professional';
  emojiFrequency: 'high' | 'medium' | 'low' | 'none';
  commonPhrases: string[];
  writingStyle: {
    capitalization?: 'normal' | 'lowercase' | 'uppercase';
    punctuation?: 'normal' | 'minimal' | 'excessive';
    sentenceLength?: 'short' | 'medium' | 'long';
  };
  nsfwLevel: 'suggestive' | 'explicit' | 'extreme';
  trainingDataAnalyzed: boolean;
  lastTrainedAt?: Date;
  sampleMessages: string[];
  customInstructions?: string; // Additional instructions for AI
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Template performance analytics per fan tier
 * Tracks conversion rates, revenue, and engagement
 */
export interface TemplatePerformance {
  id: string;
  templateId: string;
  fanTier: 'whale' | 'high' | 'medium' | 'low';
  timesSent: number;
  timesOpened: number;
  timesResponded: number;
  timesPurchased: number;
  totalRevenue: number;
  avgResponseTimeMinutes?: number;
  lastUsedAt?: Date;
  createdAt: Date;
}

/**
 * Approval queue for high-value or uncertain messages
 * Requires human review before sending
 */
export interface ApprovalQueueItem {
  id: string;
  messageId: string;
  fanId: string;
  creatorId: string;
  assignedChatterId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  reason?: string;
  ppvPrice?: number;
  estimatedRevenue?: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'timeout';
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  expiresAt?: Date;
  createdAt: Date;
  // Populated fields (joined data)
  message?: AIMessage;
  fan?: Fan;
  creator?: Creator;
}

/**
 * A/B test for template optimization
 * Compares two templates to determine winner
 */
export interface ABTest {
  id: string;
  testName: string;
  templateAId: string;
  templateBId: string;
  targetTier?: 'whale' | 'high' | 'medium' | 'low';
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled';
  winnerTemplateId?: string;
  confidenceLevel?: number; // 0-1 statistical confidence
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Analytics event for AI learning
 * Tracks all interactions for optimization
 */
export interface AIAnalyticsEvent {
  id: string;
  eventType: 'message_sent' | 'message_opened' | 'message_responded' | 'ppv_purchased' |
             'conversation_started' | 'conversation_ended' | 'approval_requested' |
             'approval_granted' | 'approval_rejected';
  messageId?: string;
  conversationId?: string;
  templateId?: string;
  fanId: string;
  creatorId: string;
  fanTier?: 'whale' | 'high' | 'medium' | 'low';
  revenue?: number;
  responseTimeSeconds?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Context passed to AI for message generation
 * Contains fan history, spending, and conversation state
 */
export interface MessageContext {
  fan: Fan;
  creator: Creator;
  conversationHistory: AIMessage[];
  lastPurchaseDate?: Date;
  totalSpent: number;
  tier: 'whale' | 'high' | 'medium' | 'low';
  lastActiveDate?: Date;
  recentPurchases?: string[];
  engagementScore?: number; // 0-100
}

/**
 * Request to AI for message generation
 * Includes context and optional PPV details
 */
export interface AIGenerationRequest {
  fanId: string;
  creatorId: string;
  incomingMessage?: string;
  context: MessageContext;
  templateCategory?: AITemplate['category'];
  ppvPrice?: number;
  ppvDescription?: string;
  forceTemplate?: boolean; // Force template usage vs Claude generation
}

/**
 * AI-generated message response
 * Includes message text, approval requirements, and metadata
 */
export interface AIGenerationResponse {
  messageText: string;
  templateId?: string;
  requiresApproval: boolean;
  confidence: number; // 0-1
  reasoning?: string;
  suggestedPpvPrice?: number;
  detectedIntent?: 'casual_chat' | 'ppv_interest' | 'complaint' | 'compliment' | 'question';
  metadata?: Record<string, any>;
}

/**
 * Real-time notification for approval queue
 * Triggers push notifications and email alerts
 */
export interface AINotification {
  id: string;
  type: 'approval_needed' | 'approval_timeout' | 'high_value_opportunity' | 'ai_error';
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  actionUrl?: string;
  approvalQueueItemId?: string;
  chatterId?: string; // Who should be notified
  creatorId?: string;
  read: boolean;
  dismissedAt?: Date;
  createdAt: Date;
}

/**
 * AI System configuration and settings
 * Manages thresholds, safety settings, and feature flags
 */
export interface AISystemConfig {
  autoSendThreshold: number; // PPV price threshold for auto-send
  minConfidence: number; // Minimum confidence score (0-1)
  temperature: number; // Claude creativity level (0-1)
  maxTokens: number; // Max response length
  contentFilterEnabled: boolean;
  requireApprovalForNewFans: boolean;
  requireApprovalForAll: boolean;
  enableAIChat: boolean;
  model: string; // Claude model version
}

/**
 * AI Performance metrics and analytics
 * Dashboard overview of AI system performance
 */
export interface AIPerformanceMetrics {
  totalMessagesGenerated: number;
  totalMessagesSent: number;
  totalMessagesApproved: number;
  totalMessagesRejected: number;
  autoSendRate: number; // Percentage
  approvalRate: number; // Percentage
  avgConfidenceScore: number;
  avgResponseTimeMinutes: number;
  totalRevenue: number;
  conversionRate: number; // Percentage
  avgRevenuePerMessage: number;
  topPerformingTemplates: AITemplate[];
  performanceByTier: {
    tier: 'whale' | 'high' | 'medium' | 'low';
    messagesSent: number;
    revenue: number;
    conversionRate: number;
  }[];
}
