/**
 * Approval Workflow Logic
 * Determines when messages need human approval and manages the approval queue
 */

import { ApprovalQueueItem, AIMessage } from '@/types';

/**
 * Configuration for approval thresholds
 * Loaded from environment variables
 */
export interface ApprovalConfig {
  autoSendThreshold: number; // PPV price threshold
  minConfidence: number; // Minimum confidence score (0-1)
  requireApprovalForNewFans: boolean;
  requireApprovalForAll: boolean; // Override: approve everything
}

/**
 * Get approval configuration from environment
 */
export function getApprovalConfig(): ApprovalConfig {
  return {
    autoSendThreshold: parseFloat(process.env.AI_AUTO_SEND_THRESHOLD || '50'),
    minConfidence: parseFloat(process.env.AI_MIN_CONFIDENCE || '0.7'),
    requireApprovalForNewFans: process.env.AI_REQUIRE_APPROVAL_FOR_NEW_FANS === 'true',
    requireApprovalForAll: process.env.AI_REQUIRE_APPROVAL_FOR_ALL === 'true',
  };
}

/**
 * Criteria for determining auto-send eligibility
 */
export interface AutoSendCriteria {
  ppvPrice?: number;
  fanTier: 'whale' | 'high' | 'medium' | 'low';
  isFirstMessage: boolean;
  confidence?: number;
  messageCategory?: string;
  fanTotalSpent?: number;
}

/**
 * Determine if message can be auto-sent or needs approval
 * Returns true if message can be sent automatically
 */
export function calculateAutoSendEligibility(criteria: AutoSendCriteria): boolean {
  const config = getApprovalConfig();

  // Override: If require all approvals, always return false
  if (config.requireApprovalForAll) {
    return false;
  }

  const {
    ppvPrice,
    fanTier,
    isFirstMessage,
    confidence = 1,
    messageCategory,
    fanTotalSpent = 0,
  } = criteria;

  // Rule 1: First messages need approval if configured
  if (isFirstMessage && config.requireApprovalForNewFans) {
    return false;
  }

  // Rule 2: Low confidence needs approval
  if (confidence < config.minConfidence) {
    return false;
  }

  // Rule 3: No PPV = casual chat = auto-send (if confidence is good)
  if (!ppvPrice) {
    return true;
  }

  // Rule 4: High-value PPV needs approval
  if (ppvPrice > config.autoSendThreshold) {
    return false;
  }

  // Rule 5: Whale tier gets higher auto-send threshold
  if (fanTier === 'whale' && ppvPrice <= config.autoSendThreshold * 1.5) {
    return true;
  }

  // Rule 6: High spenders get more lenient treatment
  if (fanTotalSpent > 500 && ppvPrice <= config.autoSendThreshold * 1.25) {
    return true;
  }

  // Rule 7: Low tier needs approval for anything >$20
  if (fanTier === 'low' && ppvPrice > 20) {
    return false;
  }

  // Rule 8: Medium tier - moderate threshold
  if (fanTier === 'medium' && ppvPrice > 35) {
    return false;
  }

  // Default: auto-send if within threshold
  return ppvPrice <= config.autoSendThreshold;
}

/**
 * Determine approval priority based on value and urgency
 */
export function determineApprovalPriority(criteria: {
  ppvPrice?: number;
  fanTier: 'whale' | 'high' | 'medium' | 'low';
  estimatedRevenue?: number;
  fanTotalSpent?: number;
  isFollowUp?: boolean;
}): 'low' | 'normal' | 'high' | 'urgent' {
  const { ppvPrice = 0, fanTier, estimatedRevenue = ppvPrice, fanTotalSpent = 0, isFollowUp = false } = criteria;

  // URGENT: Whale + high value
  if (fanTier === 'whale' && estimatedRevenue > 100) {
    return 'urgent';
  }

  // URGENT: High spender + follow-up opportunity
  if (fanTotalSpent > 1000 && isFollowUp) {
    return 'urgent';
  }

  // HIGH: High value opportunity
  if (estimatedRevenue > 75) {
    return 'high';
  }

  // HIGH: Whale tier always gets priority
  if (fanTier === 'whale') {
    return 'high';
  }

  // HIGH: High tier + good revenue potential
  if (fanTier === 'high' && estimatedRevenue > 50) {
    return 'high';
  }

  // NORMAL: Standard approval
  if (estimatedRevenue > 20 || fanTier === 'high') {
    return 'normal';
  }

  // LOW: Everything else
  return 'low';
}

/**
 * Generate approval reason text
 * Explains why approval is needed
 */
export function generateApprovalReason(criteria: {
  ppvPrice?: number;
  fanTier: 'whale' | 'high' | 'medium' | 'low';
  confidence?: number;
  isFirstMessage?: boolean;
  messageCategory?: string;
}): string {
  const config = getApprovalConfig();
  const { ppvPrice, fanTier, confidence, isFirstMessage, messageCategory } = criteria;

  const reasons: string[] = [];

  // Check why approval is needed
  if (config.requireApprovalForAll) {
    reasons.push('Manual approval required for all messages (safety mode enabled)');
  }

  if (isFirstMessage && config.requireApprovalForNewFans) {
    reasons.push('First message to this fan');
  }

  if (confidence && confidence < config.minConfidence) {
    reasons.push(`Low confidence score (${(confidence * 100).toFixed(0)}%)`);
  }

  if (ppvPrice && ppvPrice > config.autoSendThreshold) {
    reasons.push(`High-value PPV offer ($${ppvPrice})`);
  }

  if (fanTier === 'whale' || fanTier === 'high') {
    reasons.push(`${fanTier.charAt(0).toUpperCase() + fanTier.slice(1)} tier fan - VIP treatment`);
  }

  if (messageCategory === 'custom' || messageCategory === 'upsell') {
    reasons.push(`${messageCategory.charAt(0).toUpperCase() + messageCategory.slice(1)} message type`);
  }

  if (reasons.length === 0) {
    reasons.push('Standard approval process');
  }

  return reasons.join(' • ');
}

/**
 * Calculate estimated revenue for approval prioritization
 */
export function estimateRevenue(criteria: {
  ppvPrice?: number;
  fanTier: 'whale' | 'high' | 'medium' | 'low';
  messageCategory?: string;
  fanHistoricalConversionRate?: number;
}): number {
  const { ppvPrice, fanTier, messageCategory, fanHistoricalConversionRate } = criteria;

  // Base conversion rates by tier (from research)
  const tierConversionRates = {
    whale: 0.45, // 45% conversion for whales
    high: 0.25, // 25% for high tier
    medium: 0.15, // 15% for medium
    low: 0.08, // 8% for low tier
  };

  // Message type multipliers
  const categoryMultipliers: Record<string, number> = {
    ppv_offer: 1.0,
    upsell: 0.8,
    custom: 1.2,
    sexting: 0.9,
    greeting: 0.3,
    reengagement: 0.5,
    response: 0.4,
  };

  // Use fan's historical rate if available, otherwise use tier average
  const conversionRate = fanHistoricalConversionRate || tierConversionRates[fanTier];

  // Apply category multiplier
  const categoryMultiplier = messageCategory ? (categoryMultipliers[messageCategory] || 1.0) : 1.0;

  // Calculate estimated revenue
  const estimatedRevenue = (ppvPrice || 0) * conversionRate * categoryMultiplier;

  return Math.round(estimatedRevenue * 100) / 100;
}

/**
 * Create approval queue item
 */
export function createApprovalQueueItem(
  message: AIMessage,
  criteria: AutoSendCriteria & { estimatedRevenue?: number }
): Omit<ApprovalQueueItem, 'id' | 'createdAt'> {
  const priority = determineApprovalPriority({
    ppvPrice: criteria.ppvPrice,
    fanTier: criteria.fanTier,
    estimatedRevenue: criteria.estimatedRevenue,
    fanTotalSpent: criteria.fanTotalSpent,
  });

  const reason = generateApprovalReason({
    ppvPrice: criteria.ppvPrice,
    fanTier: criteria.fanTier,
    confidence: criteria.confidence,
    isFirstMessage: criteria.isFirstMessage,
    messageCategory: criteria.messageCategory,
  });

  // Calculate expiration time (24 hours for most, 2 hours for urgent)
  const expiresIn = priority === 'urgent' ? 2 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + expiresIn);

  return {
    messageId: message.id,
    fanId: message.fanId,
    creatorId: message.creatorId,
    priority,
    reason,
    ppvPrice: criteria.ppvPrice,
    estimatedRevenue: criteria.estimatedRevenue,
    status: 'pending',
    expiresAt,
  };
}

/**
 * Validate approval decision
 * Checks if chatter has permission to approve/reject
 */
export function validateApprovalDecision(params: {
  chatterId: string;
  creatorId: string;
  assignedChatterIds?: string[];
}): { valid: boolean; error?: string } {
  const { chatterId, creatorId, assignedChatterIds } = params;

  // TODO: Check database for chatter permissions
  // For now, basic validation

  if (!chatterId) {
    return { valid: false, error: 'Chatter ID required' };
  }

  if (!creatorId) {
    return { valid: false, error: 'Creator ID required' };
  }

  // If assigned to specific chatters, validate
  if (assignedChatterIds && assignedChatterIds.length > 0) {
    if (!assignedChatterIds.includes(chatterId)) {
      return { valid: false, error: 'Not assigned to this chatter' };
    }
  }

  return { valid: true };
}

/**
 * Auto-assign approval queue items to chatters
 * Based on creator assignment and chatter availability
 */
export function autoAssignApprovalItem(params: {
  creatorId: string;
  priority: ApprovalQueueItem['priority'];
  availableChatters: Array<{ id: string; currentLoad: number }>;
}): string | undefined {
  const { creatorId, priority, availableChatters } = params;

  if (availableChatters.length === 0) {
    return undefined;
  }

  // For urgent items, assign to least busy chatter
  if (priority === 'urgent' || priority === 'high') {
    const leastBusy = availableChatters.reduce((min, chatter) =>
      chatter.currentLoad < min.currentLoad ? chatter : min
    );

    return leastBusy.id;
  }

  // For normal/low priority, round-robin or least busy
  const leastBusy = availableChatters.reduce((min, chatter) =>
    chatter.currentLoad < min.currentLoad ? chatter : min
  );

  return leastBusy.id;
}

/**
 * Check if approval has expired
 */
export function isApprovalExpired(item: ApprovalQueueItem): boolean {
  if (!item.expiresAt) {
    return false;
  }

  return new Date() > new Date(item.expiresAt);
}

/**
 * Get approval queue statistics
 */
export function getApprovalQueueStats(items: ApprovalQueueItem[]) {
  const pending = items.filter((i) => i.status === 'pending');
  const expired = items.filter((i) => isApprovalExpired(i) && i.status === 'pending');

  const byPriority = {
    urgent: pending.filter((i) => i.priority === 'urgent').length,
    high: pending.filter((i) => i.priority === 'high').length,
    normal: pending.filter((i) => i.priority === 'normal').length,
    low: pending.filter((i) => i.priority === 'low').length,
  };

  const totalEstimatedRevenue = pending.reduce(
    (sum, item) => sum + (item.estimatedRevenue || 0),
    0
  );

  const avgWaitTime = pending.length > 0
    ? pending.reduce((sum, item) => {
        const waitTime = Date.now() - new Date(item.createdAt).getTime();
        return sum + waitTime;
      }, 0) / pending.length / 1000 / 60 // Convert to minutes
    : 0;

  return {
    totalPending: pending.length,
    totalExpired: expired.length,
    byPriority,
    totalEstimatedRevenue: Math.round(totalEstimatedRevenue * 100) / 100,
    avgWaitTimeMinutes: Math.round(avgWaitTime),
  };
}
