/**
 * In-Memory Rate Limiter
 * Prevents API abuse with sliding window rate limiting
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store for rate limit tracking
const requestCounts = new Map<string, RateLimitRecord>();

// Cleanup interval to prevent memory leaks (run every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
const MAX_RECORDS = 10000; // Maximum records before forced cleanup

let lastCleanup = Date.now();

/**
 * Check if request is within rate limit
 *
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param maxRequests - Maximum requests allowed in time window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns Object with success status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();

  // Periodic cleanup to prevent memory leaks
  if (requestCounts.size > MAX_RECORDS || (now - lastCleanup) > CLEANUP_INTERVAL) {
    cleanupExpiredRecords(now);
    lastCleanup = now;
  }

  const record = requestCounts.get(identifier);

  // No existing record or window has expired - create new window
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    requestCounts.set(identifier, { count: 1, resetAt });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt,
    };
  }

  // Rate limit exceeded
  if (record.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  // Increment counter
  record.count++;
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Clean up expired records to prevent memory leaks
 */
function cleanupExpiredRecords(now: number): void {
  let cleaned = 0;

  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetAt) {
      requestCounts.delete(key);
      cleaned++;
    }
  }

  // Force cleanup of oldest records if still too many
  if (requestCounts.size > MAX_RECORDS) {
    const sortedEntries = Array.from(requestCounts.entries())
      .sort((a, b) => a[1].resetAt - b[1].resetAt);

    const toDelete = sortedEntries.slice(0, Math.floor(MAX_RECORDS / 2));
    toDelete.forEach(([key]) => requestCounts.delete(key));
    cleaned += toDelete.length;
  }

  if (cleaned > 0) {
    console.log(`[RateLimit] Cleaned up ${cleaned} expired records. Current size: ${requestCounts.size}`);
  }
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or manual overrides
 */
export function resetRateLimit(identifier: string): void {
  requestCounts.delete(identifier);
}

/**
 * Get current rate limit status without incrementing
 * Useful for checking limit before expensive operations
 */
export function getRateLimitStatus(
  identifier: string,
  maxRequests: number = 10
): { remaining: number; resetAt: number | null } {
  const record = requestCounts.get(identifier);
  const now = Date.now();

  if (!record || now > record.resetAt) {
    return { remaining: maxRequests, resetAt: null };
  }

  return {
    remaining: Math.max(0, maxRequests - record.count),
    resetAt: record.resetAt,
  };
}

/**
 * Get rate limiter statistics
 * Useful for monitoring
 */
export function getRateLimiterStats(): {
  activeTrackers: number;
  memoryUsage: string;
} {
  return {
    activeTrackers: requestCounts.size,
    memoryUsage: `${(requestCounts.size * 32 / 1024).toFixed(2)} KB (estimated)`,
  };
}
