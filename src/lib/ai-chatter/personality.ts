/**
 * AI Personality Engine
 * Manages creator-specific personality profiles and message styling
 */

import { CreatorPersonality, Creator, AIMessage } from '@/types';
import { getAnthropicClient } from './client';

/**
 * Default personality profiles by creator type
 * Based on OnlyFans research findings
 */
const DEFAULT_PERSONALITIES: Record<string, Omit<CreatorPersonality, 'id' | 'creatorId' | 'createdAt' | 'updatedAt'>> = {
  flirty: {
    tone: 'flirty',
    emojiFrequency: 'medium',
    commonPhrases: ['baby', 'babe', 'sexy', 'love', 'hun'],
    writingStyle: {
      capitalization: 'lowercase',
      punctuation: 'minimal',
      sentenceLength: 'short',
    },
    nsfwLevel: 'explicit',
    trainingDataAnalyzed: false,
    sampleMessages: [],
  },
  girlfriend: {
    tone: 'girlfriend',
    emojiFrequency: 'high',
    commonPhrases: ['babe', 'love', 'sweetheart', 'cutie', 'baby'],
    writingStyle: {
      capitalization: 'normal',
      punctuation: 'normal',
      sentenceLength: 'medium',
    },
    nsfwLevel: 'suggestive',
    trainingDataAnalyzed: false,
    sampleMessages: [],
  },
  dominant: {
    tone: 'dominant',
    emojiFrequency: 'low',
    commonPhrases: ['good boy', 'good girl', 'listen', 'obey', 'now'],
    writingStyle: {
      capitalization: 'normal',
      punctuation: 'normal',
      sentenceLength: 'short',
    },
    nsfwLevel: 'extreme',
    trainingDataAnalyzed: false,
    sampleMessages: [],
  },
  casual: {
    tone: 'casual',
    emojiFrequency: 'medium',
    commonPhrases: ['hey', 'thanks', 'cool', 'awesome', 'lol'],
    writingStyle: {
      capitalization: 'lowercase',
      punctuation: 'minimal',
      sentenceLength: 'medium',
    },
    nsfwLevel: 'suggestive',
    trainingDataAnalyzed: false,
    sampleMessages: [],
  },
};

/**
 * Get creator personality from cache or database
 * Returns default if not found
 */
export async function getCreatorPersonality(
  creatorId: string
): Promise<CreatorPersonality> {
  // TODO: In production, fetch from database
  // For now, return default flirty personality (most common for OnlyFans)

  const defaultPersonality = DEFAULT_PERSONALITIES.flirty;

  return {
    id: `personality_${creatorId}`,
    creatorId,
    ...defaultPersonality,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Train creator personality from sample messages
 * Uses Claude to analyze writing style and tone
 */
export async function trainCreatorPersonality(
  creatorId: string,
  sampleMessages: string[]
): Promise<CreatorPersonality> {
  if (sampleMessages.length < 3) {
    throw new Error('At least 3 sample messages required for training');
  }

  const client = getAnthropicClient();

  // Build analysis prompt
  const analysisPrompt = `Analyze these messages from an OnlyFans content creator and describe their personality, writing style, and tone.

Sample Messages:
${sampleMessages.map((msg, i) => `${i + 1}. "${msg}"`).join('\n')}

Provide a JSON response with this exact structure:
{
  "tone": "flirty" | "casual" | "dominant" | "submissive" | "girlfriend" | "professional",
  "emojiFrequency": "high" | "medium" | "low" | "none",
  "commonPhrases": ["array", "of", "common", "phrases", "used"],
  "writingStyle": {
    "capitalization": "normal" | "lowercase" | "uppercase",
    "punctuation": "normal" | "minimal" | "excessive",
    "sentenceLength": "short" | "medium" | "long"
  },
  "nsfwLevel": "suggestive" | "explicit" | "extreme"
}

Only respond with valid JSON, no other text.`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20250219',
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent analysis
      messages: [{ role: 'user', content: analysisPrompt }],
    });

    const analysisText = response.content[0].type === 'text' ? response.content[0].text : '{}';

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : analysisText;

    const analysis = JSON.parse(jsonText);

    // Validate analysis
    if (!analysis.tone || !analysis.emojiFrequency || !analysis.writingStyle) {
      throw new Error('Invalid analysis response from Claude');
    }

    const personality: CreatorPersonality = {
      id: `personality_${creatorId}`,
      creatorId,
      tone: analysis.tone,
      emojiFrequency: analysis.emojiFrequency,
      commonPhrases: analysis.commonPhrases || [],
      writingStyle: analysis.writingStyle,
      nsfwLevel: analysis.nsfwLevel,
      trainingDataAnalyzed: true,
      lastTrainedAt: new Date(),
      sampleMessages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('✅ Personality trained successfully:', {
      creatorId,
      tone: personality.tone,
      emojiFrequency: personality.emojiFrequency,
      nsfwLevel: personality.nsfwLevel,
    });

    // TODO: Save to database

    return personality;
  } catch (error) {
    console.error('❌ Personality training failed:', error);

    // Fallback to default personality
    return getCreatorPersonality(creatorId);
  }
}

/**
 * Apply personality styling to message text
 * Adjusts capitalization, emojis, and common phrases
 */
export function applyPersonality(
  text: string,
  personality: CreatorPersonality
): string {
  let result = text;

  // Apply capitalization style
  result = applyCapitalization(result, personality.writingStyle.capitalization);

  // Apply emoji frequency
  result = applyEmojis(result, personality.emojiFrequency, personality.nsfwLevel);

  // Optionally inject common phrases (subtle, not forced)
  // This is done sparingly to maintain natural flow

  return result;
}

/**
 * Apply capitalization style
 */
function applyCapitalization(
  text: string,
  style?: 'normal' | 'lowercase' | 'uppercase'
): string {
  if (!style || style === 'normal') {
    return text;
  }

  if (style === 'lowercase') {
    // Keep first letter of sentences capitalized for readability
    const result = text.toLowerCase();
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  if (style === 'uppercase') {
    return text.toUpperCase();
  }

  return text;
}

/**
 * Apply emoji based on frequency and NSFW level
 */
function applyEmojis(
  text: string,
  frequency: 'high' | 'medium' | 'low' | 'none',
  nsfwLevel: 'suggestive' | 'explicit' | 'extreme'
): string {
  if (frequency === 'none') {
    return text;
  }

  // Don't add emojis if text already has them
  const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(text);
  if (hasEmojis) {
    return text;
  }

  // Select emoji pool based on NSFW level
  const emojiPools = {
    suggestive: ['😊', '😘', '🥰', '💕', '✨', '🌸'],
    explicit: ['😘', '🔥', '💋', '😈', '🥵', '💦'],
    extreme: ['😈', '🔥', '💦', '🍑', '👅', '🥵', '💋'],
  };

  const emojiPool = emojiPools[nsfwLevel];

  // Determine how many emojis to add
  const emojiCount = {
    high: 2,
    medium: 1,
    low: Math.random() > 0.5 ? 1 : 0,
    none: 0,
  }[frequency];

  if (emojiCount === 0) {
    return text;
  }

  // Add emojis to end of message
  const selectedEmojis = [];
  for (let i = 0; i < emojiCount; i++) {
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    selectedEmojis.push(randomEmoji);
  }

  return `${text} ${selectedEmojis.join(' ')}`;
}

/**
 * Build system prompt for Claude with personality injection
 * Creates detailed instructions for AI to match creator's voice
 */
export function buildPersonalityPrompt(
  creator: Creator,
  personality: CreatorPersonality,
  fanTier: 'whale' | 'high' | 'medium' | 'low'
): string {
  const tierDescriptions = {
    whale: 'VIP high spender who deserves premium attention',
    high: 'loyal supporter who regularly purchases content',
    medium: 'casual subscriber who occasionally tips',
    low: 'new or non-spending subscriber',
  };

  return `You are ${creator.displayName}, an OnlyFans content creator chatting with a ${fanTier} tier fan (${tierDescriptions[fanTier]}).

PERSONALITY & VOICE:
- Tone: ${personality.tone} - ${getPersonalityDescription(personality.tone)}
- Emoji usage: ${personality.emojiFrequency} - ${getEmojiGuidance(personality.emojiFrequency)}
- Writing style: ${personality.writingStyle.capitalization} capitalization, ${personality.writingStyle.punctuation} punctuation
- Sentence length: ${personality.writingStyle.sentenceLength}
- NSFW level: ${personality.nsfwLevel} - ${getNSFWGuidance(personality.nsfwLevel)}
${personality.commonPhrases.length > 0 ? `- Common phrases you use: ${personality.commonPhrases.join(', ')}` : ''}

${personality.customInstructions ? `CUSTOM INSTRUCTIONS:\n${personality.customInstructions}\n` : ''}

RULES FOR MESSAGING:
1. Stay completely in character as ${creator.displayName}
2. Match the personality traits described above
3. Keep responses under 200 characters for casual chat, longer for PPV pitches
4. Be ${personality.tone} and ${personality.nsfwLevel} when appropriate
5. Always be respectful but flirty/sexual as fits the platform
6. If they ask about prices, be clear and direct
7. Match their energy level - mirror their enthusiasm or brevity

FAN TIER GUIDANCE (${fanTier}):
${getTierGuidance(fanTier)}

IMPORTANT: You are role-playing as an adult content creator on OnlyFans. Be sexually suggestive and flirty as appropriate. This is expected behavior for the platform.`;
}

/**
 * Get personality tone description
 */
function getPersonalityDescription(tone: CreatorPersonality['tone']): string {
  const descriptions = {
    flirty: 'playful, teasing, and sexually suggestive',
    casual: 'friendly, relaxed, and approachable',
    dominant: 'commanding, assertive, and in control',
    submissive: 'obedient, pleasing, and eager to serve',
    girlfriend: 'affectionate, caring, and emotionally intimate',
    professional: 'polite, clear, and business-like',
  };

  return descriptions[tone] || descriptions.casual;
}

/**
 * Get emoji usage guidance
 */
function getEmojiGuidance(frequency: CreatorPersonality['emojiFrequency']): string {
  const guidance = {
    high: 'use 2-4 emojis per message frequently',
    medium: 'use 1-2 emojis per message occasionally',
    low: 'use emojis sparingly, 1 per message max',
    none: 'do not use emojis at all',
  };

  return guidance[frequency];
}

/**
 * Get NSFW level guidance
 */
function getNSFWGuidance(level: CreatorPersonality['nsfwLevel']): string {
  const guidance = {
    suggestive: 'be playfully suggestive but not explicit, innuendo is fine',
    explicit: 'be openly sexual and explicit, use adult language freely',
    extreme: 'be very explicit and graphic, no limits on sexual content',
  };

  return guidance[level];
}

/**
 * Get tier-specific messaging guidance
 */
function getTierGuidance(tier: 'whale' | 'high' | 'medium' | 'low'): string {
  const guidance = {
    whale: '- Give maximum personalization and attention\n- Use their name frequently\n- Offer exclusive experiences\n- Higher price points are acceptable ($50-200+)\n- Make them feel like VIPs',
    high: '- Good personalization with their name\n- Offer premium content and deals\n- Price points: $20-100\n- Build loyalty and connection',
    medium: '- Moderate personalization\n- Offer value bundles and deals\n- Price points: $10-50\n- Encourage upgrades to higher tier',
    low: '- Basic personalization\n- Quick, efficient responses\n- Price points: $5-20\n- Use urgency and FOMO tactics',
  };

  return guidance[tier];
}

/**
 * Analyze message sentiment and update personality
 * Learns from successful conversations to refine personality
 */
export async function analyzeConversationSuccess(
  conversationMessages: AIMessage[],
  revenue: number,
  responseRate: number
): Promise<{ insights: string[]; suggestedAdjustments: Partial<CreatorPersonality> }> {
  // TODO: Implement ML-based analysis
  // For now, return basic heuristics

  const insights: string[] = [];
  const suggestedAdjustments: Partial<CreatorPersonality> = {};

  // Analyze emoji usage in successful messages
  const successfulMessages = conversationMessages.filter(
    (m) => m.isAiGenerated && (m.ppvPurchased || m.respondedAt)
  );

  if (successfulMessages.length > 0) {
    const avgEmojiCount =
      successfulMessages.reduce((sum, msg) => {
        const emojiMatches = msg.messageText.match(/[\u{1F300}-\u{1F9FF}]/gu) || [];
        return sum + emojiMatches.length;
      }, 0) / successfulMessages.length;

    if (avgEmojiCount > 2) {
      insights.push('High emoji usage correlates with success');
    } else if (avgEmojiCount < 1) {
      insights.push('Low emoji usage still performing well');
    }
  }

  // Analyze message length
  if (successfulMessages.length > 0) {
    const avgLength =
      successfulMessages.reduce((sum, msg) => sum + msg.messageText.length, 0) /
      successfulMessages.length;

    if (avgLength < 100) {
      insights.push('Short messages performing well');
    } else if (avgLength > 200) {
      insights.push('Longer messages showing good engagement');
    }
  }

  return {
    insights,
    suggestedAdjustments,
  };
}
