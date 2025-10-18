/**
 * AI Message Generation Engine
 * Core system that generates personalized messages using Claude AI
 * Integrates: templates, personality, safety filters, and approval logic
 */

import { getAnthropicClient } from './client';
import {
  AIGenerationRequest,
  AIGenerationResponse,
  MessageContext,
  AIMessage,
  CreatorPersonality,
} from '@/types';
import { getCreatorPersonality, applyPersonality, buildPersonalityPrompt } from './personality';
import { selectBestTemplate, fillTemplate, TemplateVariables } from './templates';
import { calculateAutoSendEligibility } from './approval';
import { checkContentSafety, isOnlyFansCompliant, logSafetyViolation } from './safety';
import {
  generateMockAIResponse,
  applyPersonalityToMock,
  generateMockMetadata,
  generateMockConfidence,
} from './mock-responses';
import { logger } from '@/lib/utils/logger';

const log = logger.withContext('AI:Generator');

// Configuration from environment
const AI_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || '0.7');
const AI_MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS || '500');
const CONTENT_FILTER_ENABLED = process.env.AI_CONTENT_FILTER_ENABLED === 'true';
const USE_MOCK_AI = process.env.USE_MOCK_AI === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/**
 * Main message generation function
 * Determines whether to use template or Claude, then generates message
 */
export async function generateAIResponse(
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  const {
    fanId,
    creatorId,
    incomingMessage,
    context,
    templateCategory,
    ppvPrice,
    ppvDescription,
    forceTemplate = false,
  } = request;

  try {
    // Get creator personality
    const personality = await getCreatorPersonality(creatorId);

    // Decide: Template or Claude?
    const useTemplate = forceTemplate || shouldUseTemplate(context, templateCategory);

    let response: AIGenerationResponse;

    if (useTemplate && templateCategory) {
      response = await generateFromTemplate(request, personality);
    } else {
      try {
        response = await generateFromClaude(request, personality);
      } catch (error) {
        log.warn('Anthropic API unavailable, falling back to template mode', { error: error instanceof Error ? error.message : 'Unknown error' });
        // Graceful fallback to template on API failure
        response = await generateFromTemplate(request, personality);
      }
    }

    // Safety check
    if (CONTENT_FILTER_ENABLED) {
      const safetyCheck = checkContentSafety(response.messageText);

      if (safetyCheck.blocked) {
        logSafetyViolation({
          text: response.messageText,
          violations: safetyCheck.blockedReasons,
          severity: 'critical',
          creatorId,
        });

        // Return error response
        return {
          messageText: '[ERROR: Content safety violation - message blocked]',
          requiresApproval: true,
          confidence: 0,
          reasoning: 'Content safety violation detected',
        };
      }

      // Reduce confidence if warnings
      if (safetyCheck.warnings.length > 0) {
        response.confidence = Math.min(response.confidence, safetyCheck.confidence);
        response.requiresApproval = true;
        response.reasoning = `${response.reasoning || ''} (Safety warnings: ${safetyCheck.warnings.length})`;
      }
    }

    return response;
  } catch (error) {
    log.error('Message generation failed', error);

    return {
      messageText: '[ERROR: Failed to generate message]',
      requiresApproval: true,
      confidence: 0,
      reasoning: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Determine if template should be used vs Claude generation
 */
function shouldUseTemplate(
  context: MessageContext,
  category?: string
): boolean {
  // Use templates for:
  // 1. Greetings (first message)
  if (category === 'greeting' && context.conversationHistory.length === 0) {
    return true;
  }

  // 2. Standard PPV offers
  if (category === 'ppv_offer') {
    return true;
  }

  // 3. Re-engagement (inactive fans)
  if (category === 'reengagement' && context.lastActiveDate) {
    const daysSinceActive = Math.floor(
      (Date.now() - context.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceActive > 7;
  }

  // 4. Upsells and sexting (proven templates)
  if (category === 'upsell' || category === 'sexting') {
    return true;
  }

  // Otherwise, use Claude for personalized responses
  return false;
}

/**
 * Generate message from template
 * Fast, proven approach for standard scenarios
 */
async function generateFromTemplate(
  request: AIGenerationRequest,
  personality: CreatorPersonality
): Promise<AIGenerationResponse> {
  const { context, templateCategory, ppvPrice, ppvDescription } = request;

  // Select best template
  const template = await selectBestTemplate({
    category: templateCategory!,
    fanTier: context.fan.tier,
    ppvPrice,
    isNsfw: personality.nsfwLevel === 'explicit' || personality.nsfwLevel === 'extreme',
  });

  if (!template) {
    // Fallback to Claude if no template found
    return await generateFromClaude(request, personality);
  }

  // Fill template variables
  const variables: TemplateVariables = {
    fanName: context.fan.username.replace('@', ''),
    creatorName: context.creator.displayName,
    ppvPrice: ppvPrice ? ppvPrice.toString() : '',
    ppvDescription: ppvDescription || '',
    totalSpent: context.totalSpent.toFixed(0),
  };

  let messageText = fillTemplate(template.templateText, variables);

  // Apply personality styling
  messageText = applyPersonality(messageText, personality);

  // Determine if requires approval
  const requiresApproval = !calculateAutoSendEligibility({
    ppvPrice,
    fanTier: context.fan.tier,
    isFirstMessage: context.conversationHistory.length === 0,
    confidence: 0.9, // High confidence for templates
    fanTotalSpent: context.totalSpent,
  });

  return {
    messageText,
    templateId: template.id,
    requiresApproval,
    confidence: 0.9, // Templates are high confidence
    reasoning: `Template-based: ${template.name}`,
    suggestedPpvPrice: ppvPrice,
  };
}

/**
 * Generate message using Claude AI
 * Fully personalized, context-aware responses
 */
async function generateFromClaude(
  request: AIGenerationRequest,
  personality: CreatorPersonality
): Promise<AIGenerationResponse> {
  const { context, incomingMessage, ppvPrice, ppvDescription, templateCategory } = request;

  // DEMO MODE: Use mock responses instead of calling Anthropic API
  if (USE_MOCK_AI) {
    log.debug('Demo Mode: Using mock AI response');

    const category = templateCategory || 'response';
    let messageText = generateMockAIResponse(
      category,
      ppvPrice,
      context.fan.username.replace('@', '')
    );

    // Apply personality styling
    messageText = applyPersonalityToMock(messageText, personality.tone);

    // Simulate realistic confidence scores
    const confidence = generateMockConfidence(!!ppvPrice, category);

    // Determine if requires approval (same logic as real API)
    const requiresApproval = !calculateAutoSendEligibility({
      ppvPrice,
      fanTier: context.fan.tier,
      isFirstMessage: context.conversationHistory.length === 0,
      confidence,
      fanTotalSpent: context.totalSpent,
    });

    return {
      messageText,
      requiresApproval,
      confidence,
      reasoning: `Mock AI-generated with ${personality.tone} personality (Demo Mode)`,
      suggestedPpvPrice: ppvPrice,
      detectedIntent: category as any,
      metadata: generateMockMetadata(),
    };
  }

  // REAL API MODE: Call Anthropic Claude
  const client = getAnthropicClient();

  // Build system prompt with personality
  const systemPrompt = buildPersonalityPrompt(
    context.creator,
    personality,
    context.fan.tier
  );

  // Build conversation context
  const conversationMessages = buildConversationContext(
    context.conversationHistory,
    incomingMessage,
    ppvPrice,
    ppvDescription
  );

  try {
    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20250219',
      max_tokens: AI_MAX_TOKENS,
      temperature: AI_TEMPERATURE,
      system: systemPrompt,
      messages: conversationMessages,
    });

    const messageText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Detect intent
    const detectedIntent = detectMessageIntent(messageText, incomingMessage);

    // Calculate confidence
    const confidence = calculateConfidence(response, messageText, personality);

    // Determine if requires approval
    const requiresApproval = !calculateAutoSendEligibility({
      ppvPrice,
      fanTier: context.fan.tier,
      isFirstMessage: context.conversationHistory.length === 0,
      confidence,
      fanTotalSpent: context.totalSpent,
    });

    return {
      messageText,
      requiresApproval,
      confidence,
      reasoning: `AI-generated with ${personality.tone} personality`,
      suggestedPpvPrice: ppvPrice,
      detectedIntent,
      metadata: {
        model: response.model,
        stopReason: response.stop_reason,
        usage: response.usage,
      },
    };
  } catch (error) {
    log.error('Claude API error', error);
    throw error;
  }
}

/**
 * Build conversation context for Claude
 * Includes recent message history and current message
 */
function buildConversationContext(
  history: AIMessage[],
  newMessage?: string,
  ppvPrice?: number,
  ppvDescription?: string
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  // Add last 10 messages for context (keeps token usage manageable)
  const recentHistory = history.slice(-10);

  recentHistory.forEach((msg) => {
    messages.push({
      role: msg.messageType === 'incoming' ? 'user' : 'assistant',
      content: msg.messageText,
    });
  });

  // Add new incoming message or PPV offer prompt
  if (newMessage) {
    messages.push({
      role: 'user',
      content: newMessage,
    });
  } else if (ppvPrice && ppvDescription) {
    // Prompt Claude to create PPV offer
    messages.push({
      role: 'user',
      content: `[SYSTEM: Generate a PPV offer for ${ppvDescription} priced at $${ppvPrice}. Make it enticing and match your personality.]`,
    });
  } else if (messages.length === 0) {
    // First message prompt
    messages.push({
      role: 'user',
      content: '[SYSTEM: Send a greeting message to welcome this new subscriber. Be warm and inviting.]',
    });
  }

  return messages;
}

/**
 * Detect message intent
 * Helps with analytics and learning
 */
function detectMessageIntent(
  messageText: string,
  incomingMessage?: string
): AIGenerationResponse['detectedIntent'] {
  const lowerText = messageText.toLowerCase();

  // PPV offer detection
  if (lowerText.includes('$') && (lowerText.includes('video') || lowerText.includes('content'))) {
    return 'ppv_interest';
  }

  // Complaint detection
  if (
    incomingMessage &&
    (incomingMessage.toLowerCase().includes('disappointed') ||
      incomingMessage.toLowerCase().includes('unhappy') ||
      incomingMessage.toLowerCase().includes('refund'))
  ) {
    return 'complaint';
  }

  // Compliment detection
  if (
    incomingMessage &&
    (incomingMessage.toLowerCase().includes('beautiful') ||
      incomingMessage.toLowerCase().includes('sexy') ||
      incomingMessage.toLowerCase().includes('amazing'))
  ) {
    return 'compliment';
  }

  // Question detection
  if (incomingMessage && incomingMessage.includes('?')) {
    return 'question';
  }

  // Default: casual chat
  return 'casual_chat';
}

/**
 * Calculate confidence score for AI-generated message
 * Based on response quality indicators
 */
function calculateConfidence(
  response: any,
  messageText: string,
  personality: CreatorPersonality
): number {
  let confidence = 0.85; // Base confidence

  // Reduce if message is too short (might be incomplete)
  if (messageText.length < 20) {
    confidence -= 0.15;
  }

  // Reduce if message is too long (might be verbose)
  if (messageText.length > 300) {
    confidence -= 0.1;
  }

  // Increase if message matches personality emoji frequency
  const emojiCount = (messageText.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  const expectedEmojiCount = {
    high: 2,
    medium: 1,
    low: 0,
    none: 0,
  }[personality.emojiFrequency];

  if (Math.abs(emojiCount - expectedEmojiCount) <= 1) {
    confidence += 0.05;
  }

  // Claude's stop_reason indicates quality
  if (response.stop_reason === 'end_turn') {
    confidence += 0.05; // Natural completion
  } else if (response.stop_reason === 'max_tokens') {
    confidence -= 0.1; // Truncated response
  }

  // Ensure confidence is between 0 and 1
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Generate multiple response variations
 * Useful for A/B testing
 */
export async function generateResponseVariations(
  request: AIGenerationRequest,
  count: number = 3
): Promise<AIGenerationResponse[]> {
  const variations: AIGenerationResponse[] = [];

  for (let i = 0; i < count; i++) {
    // Slightly vary temperature for different outputs
    const originalTemp = AI_TEMPERATURE;
    process.env.AI_TEMPERATURE = (originalTemp + (i * 0.1 - 0.1)).toString();

    const variation = await generateAIResponse(request);
    variations.push(variation);

    // Restore original temperature
    process.env.AI_TEMPERATURE = originalTemp.toString();
  }

  return variations;
}

/**
 * Regenerate message with feedback
 * Allows human to request adjustments
 */
export async function regenerateWithFeedback(
  original: AIGenerationResponse,
  feedback: string,
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  const personality = await getCreatorPersonality(request.creatorId);
  const client = getAnthropicClient();

  const systemPrompt = buildPersonalityPrompt(
    request.context.creator,
    personality,
    request.context.fan.tier
  );

  const messages = [
    {
      role: 'user' as const,
      content: `Previous message: "${original.messageText}"\n\nFeedback: ${feedback}\n\nPlease generate a new message that addresses this feedback while maintaining your personality.`,
    },
  ];

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20250219',
    max_tokens: AI_MAX_TOKENS,
    temperature: AI_TEMPERATURE,
    system: systemPrompt,
    messages,
  });

  const messageText = response.content[0].type === 'text' ? response.content[0].text : '';

  return {
    messageText,
    requiresApproval: true, // Always require approval for regenerated messages
    confidence: 0.85,
    reasoning: `Regenerated based on feedback: ${feedback}`,
  };
}
