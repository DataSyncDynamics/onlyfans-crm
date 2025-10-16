/**
 * Content Safety Filter
 * Prevents illegal, prohibited, or policy-violating content
 * Based on OnlyFans Terms of Service and legal requirements
 */

/**
 * Blocked keywords - CRITICAL for legal compliance
 * Source: OnlyFans prohibited content policy + research
 */
const BLOCKED_KEYWORDS = {
  // Age-related (CRITICAL - zero tolerance)
  age: [
    'under 18',
    'underage',
    'under age',
    'minor',
    'child',
    'kid',
    'teen',
    'teenager',
    'young',
    'school girl',
    'schoolgirl',
    'lolita',
    'barely legal',
    'jailbait',
    'adolescent',
    'juvenile',
  ],

  // Incest/family (OnlyFans prohibited)
  family: [
    'daddy',
    'mommy',
    'brother',
    'sister',
    'son',
    'daughter',
    'family',
    'incest',
    'stepdad',
    'stepmom',
    'stepbrother',
    'stepsister',
  ],

  // Violence/non-consent (prohibited)
  violence: [
    'rape',
    'forced',
    'non-consent',
    'kidnap',
    'abuse',
    'torture',
    'hurt',
    'pain',
    'blood',
    'knife',
    'gun',
  ],

  // Bodily waste (OnlyFans prohibited)
  waste: [
    'poop',
    'pee',
    'urine',
    'feces',
    'scat',
    'toilet',
    'bathroom',
    'shit',
    'piss',
  ],

  // Animals (prohibited)
  animals: [
    'dog',
    'cat',
    'horse',
    'animal',
    'pet',
    'beast',
    'zoo',
  ],

  // Drugs (prohibited)
  drugs: [
    'cocaine',
    'heroin',
    'meth',
    'drugs',
    'high',
    'trip',
    'needle',
  ],

  // Payment outside platform (OnlyFans policy)
  payment: [
    'cashapp',
    'venmo',
    'paypal',
    'zelle',
    'bitcoin',
    'crypto',
    'off platform',
  ],

  // Personal info (safety)
  personal: [
    'phone number',
    'address',
    'real name',
    'social security',
    'driver license',
  ],
};

/**
 * Warning keywords - flag for review but don't block
 */
const WARNING_KEYWORDS = {
  // Potentially problematic but context-dependent
  contextual: [
    'meet',
    'meetup',
    'in person',
    'irl',
    'real life',
    'escort',
    'prostitute',
  ],

  // High-risk financial
  financial: [
    'gift card',
    'amazon card',
    'wire transfer',
    'bank account',
  ],

  // Extreme content (review needed)
  extreme: [
    'extreme',
    'hardcore',
    'taboo',
    'forbidden',
    'illegal',
  ],
};

/**
 * Safety check result
 */
export interface SafetyCheckResult {
  safe: boolean;
  blocked: boolean;
  warnings: string[];
  blockedReasons: string[];
  sanitized?: string;
  confidence: number; // 0-1
}

/**
 * Main content safety check
 * Returns comprehensive safety analysis
 */
export function checkContentSafety(text: string): SafetyCheckResult {
  const lowerText = text.toLowerCase();
  const warnings: string[] = [];
  const blockedReasons: string[] = [];
  let blocked = false;

  // Check all blocked keyword categories
  Object.entries(BLOCKED_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach((keyword) => {
      // Use word boundary regex to avoid false positives (e.g., "meth" in "something")
      const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (pattern.test(lowerText)) {
        blocked = true;
        blockedReasons.push(`Prohibited content: ${category} (keyword: "${keyword}")`);
      }
    });
  });

  // Check warning keywords
  Object.entries(WARNING_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach((keyword) => {
      // Use word boundary regex for warnings too
      const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (pattern.test(lowerText)) {
        warnings.push(`Warning: ${category} content detected (keyword: "${keyword}")`);
      }
    });
  });

  // Additional pattern checks
  const patternChecks = checkProblematicPatterns(text);
  if (patternChecks.blocked) {
    blocked = true;
    blockedReasons.push(...patternChecks.reasons);
  }
  warnings.push(...patternChecks.warnings);

  // Calculate confidence (inverse of suspicion)
  const confidence = calculateSafetyConfidence(text, warnings.length, blockedReasons.length);

  return {
    safe: !blocked && warnings.length === 0,
    blocked,
    warnings,
    blockedReasons,
    confidence,
  };
}

/**
 * Check for problematic patterns (regex-based)
 */
function checkProblematicPatterns(text: string): {
  blocked: boolean;
  reasons: string[];
  warnings: string[];
} {
  const reasons: string[] = [];
  const warnings: string[] = [];
  let blocked = false;

  // Age mention patterns
  const agePatterns = [
    /\b(\d{1,2})\s*year[s]?\s*old\b/i,
    /\bages?\s*(\d{1,2})\b/i,
    /\b(\d{1,2})\s*yo\b/i,
  ];

  agePatterns.forEach((pattern) => {
    const match = text.match(pattern);
    if (match) {
      const age = parseInt(match[1]);
      if (age < 18) {
        blocked = true;
        reasons.push(`Underage mention detected: ${age} years old`);
      } else if (age === 18 || age === 19) {
        warnings.push(`Age mention detected: ${age} (legal but risky)`);
      }
    }
  });

  // Contact info patterns
  const phonePattern = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/;
  if (phonePattern.test(text)) {
    blocked = true;
    reasons.push('Phone number detected');
  }

  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  if (emailPattern.test(text)) {
    blocked = true;
    reasons.push('Email address detected');
  }

  // External payment URLs
  const paymentUrlPatterns = [
    /cashapp\.com/i,
    /cash\.app/i,
    /venmo\.com/i,
    /paypal\.me/i,
  ];

  paymentUrlPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      blocked = true;
      reasons.push('External payment link detected (against OnlyFans policy)');
    }
  });

  return { blocked, reasons, warnings };
}

/**
 * Calculate safety confidence score
 * Higher = safer content
 */
function calculateSafetyConfidence(
  text: string,
  warningCount: number,
  blockedCount: number
): number {
  let confidence = 1.0;

  // Reduce confidence for blocked content
  if (blockedCount > 0) {
    return 0.0;
  }

  // Reduce confidence for warnings
  confidence -= warningCount * 0.15;

  // Reduce confidence for excessive caps (screaming)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.5) {
    confidence -= 0.1;
  }

  // Reduce confidence for excessive punctuation
  const punctuationRatio = (text.match(/[!?]{2,}/g) || []).length / text.length;
  if (punctuationRatio > 0.1) {
    confidence -= 0.1;
  }

  return Math.max(0, Math.min(1, confidence));
}

/**
 * Sanitize message by removing problematic content
 * Use with caution - better to reject than sanitize critical issues
 */
export function sanitizeMessage(text: string): string {
  let sanitized = text;

  // Remove phone numbers
  sanitized = sanitized.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE REMOVED]');

  // Remove email addresses
  sanitized = sanitized.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    '[EMAIL REMOVED]'
  );

  // Remove URLs
  sanitized = sanitized.replace(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
    '[LINK REMOVED]'
  );

  return sanitized;
}

/**
 * Check if content is age-appropriate
 * CRITICAL function - must be bulletproof
 */
export function isAgeAppropriate(text: string): boolean {
  const lowerText = text.toLowerCase();

  // Check age-related keywords
  const ageKeywords = BLOCKED_KEYWORDS.age;
  for (const keyword of ageKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return false;
    }
  }

  // Check age patterns
  const agePatterns = [
    /\b(\d{1,2})\s*year[s]?\s*old\b/i,
    /\bages?\s*(\d{1,2})\b/i,
    /\b(\d{1,2})\s*yo\b/i,
  ];

  for (const pattern of agePatterns) {
    const match = text.match(pattern);
    if (match) {
      const age = parseInt(match[1]);
      if (age < 18) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if content complies with OnlyFans terms
 */
export function isOnlyFansCompliant(text: string): boolean {
  const safetyCheck = checkContentSafety(text);

  // Must not be blocked
  if (safetyCheck.blocked) {
    return false;
  }

  // Age-appropriate is non-negotiable
  if (!isAgeAppropriate(text)) {
    return false;
  }

  return true;
}

/**
 * Get content safety report
 * Detailed analysis for logging and review
 */
export function getContentSafetyReport(text: string): {
  text: string;
  length: number;
  safetyCheck: SafetyCheckResult;
  ageAppropriate: boolean;
  onlyFansCompliant: boolean;
  recommendation: 'approve' | 'review' | 'reject';
  timestamp: Date;
} {
  const safetyCheck = checkContentSafety(text);
  const ageAppropriate = isAgeAppropriate(text);
  const onlyFansCompliant = isOnlyFansCompliant(text);

  let recommendation: 'approve' | 'review' | 'reject' = 'approve';

  if (safetyCheck.blocked || !ageAppropriate || !onlyFansCompliant) {
    recommendation = 'reject';
  } else if (safetyCheck.warnings.length > 0) {
    recommendation = 'review';
  }

  return {
    text,
    length: text.length,
    safetyCheck,
    ageAppropriate,
    onlyFansCompliant,
    recommendation,
    timestamp: new Date(),
  };
}

/**
 * Batch check multiple messages
 * Useful for conversation analysis
 */
export function batchCheckSafety(messages: string[]): {
  allSafe: boolean;
  results: SafetyCheckResult[];
  blockedCount: number;
  warningCount: number;
} {
  const results = messages.map((msg) => checkContentSafety(msg));

  const blockedCount = results.filter((r) => r.blocked).length;
  const warningCount = results.filter((r) => r.warnings.length > 0).length;
  const allSafe = blockedCount === 0 && warningCount === 0;

  return {
    allSafe,
    results,
    blockedCount,
    warningCount,
  };
}

/**
 * Log safety violation for audit trail
 * IMPORTANT: All violations should be logged
 */
export function logSafetyViolation(params: {
  messageId?: string;
  text: string;
  violations: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  userId?: string;
  creatorId?: string;
}): void {
  const { messageId, text, violations, severity, userId, creatorId } = params;

  const logEntry = {
    timestamp: new Date().toISOString(),
    messageId,
    severity,
    violations,
    textLength: text.length,
    textPreview: text.substring(0, 100), // Don't log full text for privacy
    userId,
    creatorId,
  };

  // TODO: Send to logging service / database
  console.error('🚨 SAFETY VIOLATION DETECTED:', logEntry);

  // For critical violations, send immediate alert
  if (severity === 'critical') {
    console.error('🚨🚨🚨 CRITICAL SAFETY VIOLATION - IMMEDIATE ACTION REQUIRED');
    // TODO: Send alert to admin/compliance team
  }
}
