/**
 * AI Personality Training API
 * Manages creator personality profiles and training
 */

import { NextRequest, NextResponse } from 'next/server';
import { trainCreatorPersonality, getCreatorPersonality } from '@/lib/ai-chatter/personality';
import { CreatorPersonality } from '@/types';

export const runtime = 'nodejs'; // Use Node.js runtime for Anthropic SDK

/**
 * GET /api/ai/personality
 * Get creator personality profile
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const creatorId = searchParams.get('creatorId');

    if (!creatorId) {
      return NextResponse.json(
        { error: 'creatorId is required' },
        { status: 400 }
      );
    }

    // Get personality
    const personality = await getCreatorPersonality(creatorId);

    return NextResponse.json({
      success: true,
      data: personality,
    });

  } catch (error) {
    console.error('❌ Personality GET Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch personality',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/personality/train
 * Train creator personality from sample messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { creatorId, sampleMessages, manualOverrides } = body;

    // Validate required fields
    if (!creatorId) {
      return NextResponse.json(
        { error: 'creatorId is required' },
        { status: 400 }
      );
    }

    let personality: CreatorPersonality;

    // If sample messages provided, train with Claude
    if (sampleMessages && Array.isArray(sampleMessages) && sampleMessages.length >= 3) {
      console.log(`🎓 Training personality for creator ${creatorId} with ${sampleMessages.length} samples`);

      const startTime = Date.now();
      personality = await trainCreatorPersonality(creatorId, sampleMessages);
      const duration = Date.now() - startTime;

      console.log('✅ Personality trained:', {
        creatorId,
        tone: personality.tone,
        emojiFrequency: personality.emojiFrequency,
        nsfwLevel: personality.nsfwLevel,
        duration: `${duration}ms`,
      });

    } else if (manualOverrides) {
      // Manual configuration
      console.log(`⚙️  Manual personality configuration for creator ${creatorId}`);

      const basePersonality = await getCreatorPersonality(creatorId);

      personality = {
        ...basePersonality,
        ...manualOverrides,
        trainingDataAnalyzed: false,
        updatedAt: new Date(),
      };

      // TODO: Save to database

    } else {
      return NextResponse.json(
        { error: 'Either sampleMessages (min 3) or manualOverrides required' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // INSERT INTO creator_personalities ... ON CONFLICT UPDATE

    return NextResponse.json({
      success: true,
      data: personality,
      meta: {
        method: sampleMessages ? 'ai_trained' : 'manual',
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('❌ Personality Training Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to train personality',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ai/personality
 * Update specific personality fields
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { creatorId, updates } = body;

    if (!creatorId || !updates) {
      return NextResponse.json(
        { error: 'creatorId and updates are required' },
        { status: 400 }
      );
    }

    // Get current personality
    const currentPersonality = await getCreatorPersonality(creatorId);

    // Apply updates
    const updatedPersonality: CreatorPersonality = {
      ...currentPersonality,
      ...updates,
      updatedAt: new Date(),
    };

    // TODO: Save to database
    // UPDATE creator_personalities SET ... WHERE creator_id = creatorId

    console.log('✅ Personality updated:', {
      creatorId,
      updatedFields: Object.keys(updates),
    });

    return NextResponse.json({
      success: true,
      data: updatedPersonality,
    });

  } catch (error) {
    console.error('❌ Personality PATCH Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update personality',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai/personality
 * Reset personality to default
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const creatorId = searchParams.get('creatorId');

    if (!creatorId) {
      return NextResponse.json(
        { error: 'creatorId is required' },
        { status: 400 }
      );
    }

    // TODO: Delete from database or reset to default
    // DELETE FROM creator_personalities WHERE creator_id = creatorId

    const defaultPersonality = await getCreatorPersonality(creatorId);

    console.log('✅ Personality reset to default:', { creatorId });

    return NextResponse.json({
      success: true,
      data: defaultPersonality,
      message: 'Personality reset to default',
    });

  } catch (error) {
    console.error('❌ Personality DELETE Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset personality',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
