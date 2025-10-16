/**
 * AI Template System
 * Handles template selection, variable substitution, and performance tracking
 */

import { AITemplate } from '@/types';

/**
 * Template selection criteria
 */
export interface TemplateSelectionCriteria {
  category: AITemplate['category'];
  fanTier: 'whale' | 'high' | 'medium' | 'low';
  ppvPrice?: number;
  isNsfw?: boolean;
  excludeTemplateIds?: string[];
}

/**
 * Variable substitution map
 */
export interface TemplateVariables {
  fanName?: string;
  creatorName?: string;
  ppvPrice?: string;
  ppvDescription?: string;
  totalSpent?: string;
  [key: string]: string | undefined;
}

/**
 * Seed templates (will be loaded from database in production)
 * Based on OnlyFans research findings
 */
export const SEED_TEMPLATES: Omit<AITemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // ============================================================================
  // GREETING TEMPLATES
  // ============================================================================
  {
    name: 'Greeting - Whale VIP Welcome',
    category: 'greeting',
    templateText: "Hey {fanName}! 💎 I just saw you subscribed and I'm SO excited to have you here! You're already one of my VIPs and I can't wait to spoil you with exclusive content 😘",
    variables: ['fanName'],
    targetTiers: ['whale'],
    isActive: true,
    isNsfw: false,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { tone: 'enthusiastic', personalization: 'high' },
  },
  {
    name: 'Greeting - High Tier Flirty',
    category: 'greeting',
    templateText: "hey {fanName}! 🔥 thanks for subscribing babe, you're gonna love it here 😈 i post exclusive content daily and love chatting with my fans... what brings you to my page? 💋",
    variables: ['fanName'],
    targetTiers: ['high'],
    isActive: true,
    isNsfw: false,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { tone: 'flirty', engagement: 'question' },
  },
  {
    name: 'Greeting - Standard Welcome',
    category: 'greeting',
    templateText: "Hey {fanName}! Thanks for subscribing 😊 Make sure to check out my pinned post for all my exclusive content. DM me anytime! 💕",
    variables: ['fanName'],
    targetTiers: ['medium', 'low'],
    isActive: true,
    isNsfw: false,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { tone: 'friendly', effort: 'low' },
  },

  // ============================================================================
  // PPV OFFER TEMPLATES
  // ============================================================================
  {
    name: 'PPV - Whale Custom Exclusive',
    category: 'ppv_offer',
    templateText: "Hey {fanName} 💎 I just finished shooting something REALLY special that made me think of you... it's {ppvDescription} and honestly some of my hottest work yet. It's ${ppvPrice} but I know you appreciate quality 😈 Want me to send it over?",
    variables: ['fanName', 'ppvDescription', 'ppvPrice'],
    targetTiers: ['whale'],
    minPrice: 50,
    maxPrice: 200,
    isActive: true,
    isNsfw: true,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { tone: 'exclusive', urgency: 'medium', personalization: 'high' },
  },
  {
    name: 'PPV - High Value Tease',
    category: 'ppv_offer',
    templateText: "hey babe 🔥 just dropped a new video that I think you'll LOVE... {ppvDescription} for ${ppvPrice}. It's one of my favorites and I'm only sending it to my best fans 😘 interested?",
    variables: ['ppvDescription', 'ppvPrice'],
    targetTiers: ['high'],
    minPrice: 20,
    maxPrice: 100,
    isActive: true,
    isNsfw: true,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { tone: 'flirty', scarcity: 'medium' },
  },
  {
    name: 'PPV - Medium Bundle Deal',
    category: 'ppv_offer',
    templateText: "Hey! I have a special bundle for you 😘 {ppvDescription} - normally ${ppvPrice} but I'm giving you a deal today. Want it? 🔥",
    variables: ['ppvDescription', 'ppvPrice'],
    targetTiers: ['medium'],
    minPrice: 10,
    maxPrice: 50,
    isActive: true,
    isNsfw: true,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { tone: 'friendly', discount_implied: true },
  },

  // ============================================================================
  // RE-ENGAGEMENT TEMPLATES
  // ============================================================================
  {
    name: 'Reengagement - Whale Miss You',
    category: 'reengagement',
    templateText: "{fanName}! 💎 I noticed you've been quiet lately and I genuinely miss chatting with you... is everything okay? I have some new exclusive content I think you'd love to see 😘",
    variables: ['fanName'],
    targetTiers: ['whale'],
    isActive: true,
    isNsfw: false,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { tone: 'personal', concern: 'genuine', days_inactive: 7 },
  },
  {
    name: 'Reengagement - High Tier Comeback',
    category: 'reengagement',
    templateText: "hey {fanName}! haven't heard from you in a while babe 🥺 been posting some 🔥 content lately... want me to catch you up? 😘",
    variables: ['fanName'],
    targetTiers: ['high'],
    isActive: true,
    isNsfw: false,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { tone: 'friendly', fomo: true, days_inactive: 10 },
  },

  // ============================================================================
  // RESPONSE TEMPLATES
  // ============================================================================
  {
    name: 'Response - Thank You Flirty',
    category: 'response',
    templateText: "aww baby you're making me blush 🥰 that's so sweet of you to say 💕",
    variables: [],
    targetTiers: ['whale', 'high', 'medium', 'low'],
    isActive: true,
    isNsfw: false,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { trigger: 'compliment', tone: 'appreciative' },
  },
  {
    name: 'Response - Compliment Escalation',
    category: 'response',
    templateText: "omg you're too sweet 😘 comments like that make my day... and turn me on a little 😈",
    variables: [],
    targetTiers: ['whale', 'high'],
    isActive: true,
    isNsfw: true,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { trigger: 'compliment', tone: 'flirty', escalation: 'mild' },
  },

  // ============================================================================
  // SEXTING TEMPLATES
  // ============================================================================
  {
    name: 'Sexting - Initiation Soft',
    category: 'sexting',
    templateText: "baby i can't stop thinking about you 🥵 are you alone right now? 😈",
    variables: [],
    targetTiers: ['whale', 'high'],
    isActive: true,
    isNsfw: true,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { intensity: 'soft', consent_check: true },
  },
  {
    name: 'Sexting - Tease Medium',
    category: 'sexting',
    templateText: "just got out of the shower and i'm still all wet 💦 wish you were here with me... 😘",
    variables: [],
    targetTiers: ['whale', 'high'],
    isActive: true,
    isNsfw: true,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { intensity: 'medium', descriptive: true },
  },

  // ============================================================================
  // UPSELL TEMPLATES
  // ============================================================================
  {
    name: 'Upsell - Custom Content Offer',
    category: 'upsell',
    templateText: "btw babe, i do customs if you ever want something made just for you 😘 i can do pretty much anything you're into... pricing starts at ${ppvPrice}. interested? 🔥",
    variables: ['ppvPrice'],
    targetTiers: ['whale', 'high'],
    minPrice: 50,
    maxPrice: 200,
    isActive: true,
    isNsfw: true,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { service: 'custom_content', flexibility: 'high' },
  },
  {
    name: 'Upsell - Sexting Session',
    category: 'upsell',
    templateText: "you know what... i'm really enjoying chatting with you 😊 would you be interested in a private sexting session? i can send pics/vids in real time 🥵 ${ppvPrice} for 30 mins?",
    variables: ['ppvPrice'],
    targetTiers: ['whale', 'high'],
    minPrice: 30,
    maxPrice: 100,
    isActive: true,
    isNsfw: true,
    timesUsed: 0,
    successRate: 0,
    avgRevenue: 0,
    metadata: { service: 'sexting', time_based: true },
  },
];

/**
 * Select best performing template based on criteria
 * Prioritizes templates with highest success rate and revenue
 */
export async function selectBestTemplate(
  criteria: TemplateSelectionCriteria
): Promise<AITemplate | null> {
  const { category, fanTier, ppvPrice, isNsfw, excludeTemplateIds = [] } = criteria;

  // Filter templates based on criteria
  const matching = SEED_TEMPLATES.filter((template) => {
    // Category match
    if (template.category !== category) return false;

    // Fan tier match
    if (!template.targetTiers.includes(fanTier)) return false;

    // Price range match (if PPV)
    if (ppvPrice !== undefined && template.minPrice && template.maxPrice) {
      if (ppvPrice < template.minPrice || ppvPrice > template.maxPrice) {
        return false;
      }
    }

    // NSFW filter
    if (isNsfw !== undefined && template.isNsfw !== isNsfw) {
      return false;
    }

    // Active check
    if (!template.isActive) return false;

    // Exclusion check
    // Note: SEED_TEMPLATES don't have IDs, so this is for future database integration
    return true;
  });

  if (matching.length === 0) {
    console.warn(`No templates found for criteria:`, criteria);
    return null;
  }

  // Sort by performance (success rate, then revenue, then usage)
  const sorted = matching.sort((a, b) => {
    // Primary: Success rate (if both have been used)
    if (a.timesUsed > 0 && b.timesUsed > 0) {
      if (b.successRate !== a.successRate) {
        return b.successRate - a.successRate;
      }
    }

    // Secondary: Average revenue
    if (b.avgRevenue !== a.avgRevenue) {
      return b.avgRevenue - a.avgRevenue;
    }

    // Tertiary: Times used (prefer proven templates)
    return b.timesUsed - a.timesUsed;
  });

  // Return top template with generated ID
  const selectedTemplate = sorted[0];
  return {
    ...selectedTemplate,
    id: `template_${Math.random().toString(36).substring(2, 11)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Fill template with variables
 * Replaces {variableName} placeholders with actual values
 */
export function fillTemplate(
  templateText: string,
  variables: TemplateVariables
): string {
  let result = templateText;

  // Replace each variable
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined) {
      const placeholder = `{${key}}`;
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, value);
    }
  });

  // Check for unfilled variables (debugging)
  const unfilledMatches = result.match(/\{[a-zA-Z0-9_]+\}/g);
  if (unfilledMatches) {
    console.warn('Unfilled template variables:', unfilledMatches);
  }

  return result;
}

/**
 * Get all templates by category
 * Useful for template management UI
 */
export function getTemplatesByCategory(
  category: AITemplate['category']
): Omit<AITemplate, 'id' | 'createdAt' | 'updatedAt'>[] {
  return SEED_TEMPLATES.filter((t) => t.category === category && t.isActive);
}

/**
 * Get template performance summary
 * Calculates aggregate stats across all templates
 */
export function getTemplatePerformanceSummary() {
  const total = SEED_TEMPLATES.length;
  const active = SEED_TEMPLATES.filter((t) => t.isActive).length;
  const nsfw = SEED_TEMPLATES.filter((t) => t.isNsfw).length;

  const totalUsage = SEED_TEMPLATES.reduce((sum, t) => sum + t.timesUsed, 0);
  const avgSuccessRate =
    totalUsage > 0
      ? SEED_TEMPLATES.reduce((sum, t) => sum + t.successRate * t.timesUsed, 0) / totalUsage
      : 0;

  const totalRevenue = SEED_TEMPLATES.reduce((sum, t) => sum + t.avgRevenue * t.timesUsed, 0);

  return {
    totalTemplates: total,
    activeTemplates: active,
    nsfwTemplates: nsfw,
    totalUsage,
    avgSuccessRate: Math.round(avgSuccessRate * 100) / 100,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    byCategory: groupTemplatesByCategory(),
  };
}

/**
 * Group templates by category with counts
 */
function groupTemplatesByCategory() {
  const categories: Record<string, number> = {};

  SEED_TEMPLATES.forEach((template) => {
    categories[template.category] = (categories[template.category] || 0) + 1;
  });

  return categories;
}

/**
 * Validate template text for common issues
 * Helps prevent errors in template usage
 */
export function validateTemplateText(
  templateText: string,
  declaredVariables: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Extract variables from template text
  const variablesInText = (templateText.match(/\{[a-zA-Z0-9_]+\}/g) || []).map((v) =>
    v.slice(1, -1)
  );

  // Check for variables used but not declared
  variablesInText.forEach((varInText) => {
    if (!declaredVariables.includes(varInText)) {
      errors.push(`Variable {${varInText}} used in template but not declared`);
    }
  });

  // Check for declared variables not used
  declaredVariables.forEach((declared) => {
    if (!variablesInText.includes(declared)) {
      errors.push(`Variable {${declared}} declared but not used in template`);
    }
  });

  // Check template is not empty
  if (templateText.trim().length === 0) {
    errors.push('Template text cannot be empty');
  }

  // Check template is not too long (500 chars max recommended)
  if (templateText.length > 500) {
    errors.push(`Template is ${templateText.length} characters (recommended: <500)`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
