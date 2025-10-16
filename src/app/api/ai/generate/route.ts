/**
 * AI Message Generation API
 * POST /api/ai/generate
 *
 * Generates personalized messages using AI based on context and creator personality
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai-chatter/generator';
import { AIGenerationRequest, MessageContext } from '@/types';

export const runtime = 'nodejs'; // Use Node.js runtime for Anthropic SDK

/**
 * POST /api/ai/generate
 * Generate AI message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fanId,
      creatorId,
      incomingMessage,
      templateCategory,
      ppvPrice,
      ppvDescription,
      forceTemplate = false,
    } = body;

    // Validate required fields
    if (!fanId || !creatorId) {
      return NextResponse.json(
        { error: 'fanId and creatorId are required' },
        { status: 400 }
      );
    }

    // Build context (in production, fetch from database)
    const context: MessageContext = await buildMessageContext(fanId, creatorId);

    // Build generation request
    const generationRequest: AIGenerationRequest = {
      fanId,
      creatorId,
      incomingMessage,
      context,
      templateCategory,
      ppvPrice,
      ppvDescription,
      forceTemplate,
    };

    // Generate message
    const startTime = Date.now();
    const response = await generateAIResponse(generationRequest);
    const duration = Date.now() - startTime;

    // Log generation (for analytics)
    console.log('✅ AI Message Generated:', {
      fanId,
      creatorId,
      category: templateCategory,
      duration: `${duration}ms`,
      confidence: response.confidence,
      requiresApproval: response.requiresApproval,
      templateUsed: !!response.templateId,
    });

    // Return response
    return NextResponse.json({
      success: true,
      data: response,
      meta: {
        duration,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('❌ AI Generation API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate message',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Build message context from database
 * TODO: Replace with actual database queries
 */
async function buildMessageContext(
  fanId: string,
  creatorId: string
): Promise<MessageContext> {
  // TODO: Fetch from database
  // For now, return mock data that matches existing mock-data.ts structure

  const { getFanById, getCreatorById, getMessagesByFan } = await import('@/lib/mock-data');

  const fan = getFanById(fanId);
  const creator = getCreatorById(creatorId);

  if (!fan || !creator) {
    throw new Error('Fan or creator not found');
  }

  // Get conversation history (last 10 messages)
  const messages = getMessagesByFan(fanId).slice(-10);

  // Convert to AIMessage format
  const conversationHistory = messages.map((msg) => ({
    id: msg.id,
    conversationId: `conv_${fanId}_${creatorId}`,
    fanId: msg.fanId,
    creatorId: msg.creatorId,
    messageText: msg.content,
    messageType: msg.sentBy === 'fan' ? 'incoming' as const : 'outgoing' as const,
    isAiGenerated: false,
    status: 'sent' as const,
    approvalRequired: false,
    createdAt: msg.sentAt,
  }));

  return {
    fan,
    creator,
    conversationHistory,
    totalSpent: fan.totalSpent,
    tier: fan.tier,
    lastActiveDate: fan.lastActiveAt,
    lastPurchaseDate: fan.lastActiveAt, // TODO: Get actual last purchase
    recentPurchases: [], // TODO: Fetch recent purchases
    engagementScore: calculateEngagementScore(fan),
  };
}

/**
 * Calculate engagement score (0-100)
 */
function calculateEngagementScore(fan: any): number {
  let score = 0;

  // Message activity (40 points)
  const messageActivity = Math.min(fan.messageCount / 50, 1) * 40;
  score += messageActivity;

  // Purchase history (30 points)
  const purchaseActivity = Math.min(fan.ppvPurchases / 10, 1) * 30;
  score += purchaseActivity;

  // Recency (20 points)
  const daysSinceActive = Math.floor(
    (Date.now() - new Date(fan.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const recencyScore = Math.max(0, 1 - daysSinceActive / 30) * 20;
  score += recencyScore;

  // Subscription status (10 points)
  if (fan.subscriptionStatus === 'active') {
    score += 10;
  }

  return Math.min(100, Math.round(score));
}

/**
 * GET /api/ai/generate/config
 * Get AI configuration
 */
export async function GET() {
  const { getAPIConfig } = await import('@/lib/ai-chatter/client');

  const config = getAPIConfig();

  return NextResponse.json({
    success: true,
    data: config,
  });
}
