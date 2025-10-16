/**
 * AI Templates API
 * Manage message templates with CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { AITemplate } from '@/types';

/**
 * GET /api/ai/templates
 * Get all templates with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const creatorId = searchParams.get('creatorId');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');

    // TODO: Fetch from database
    // For now, return mock templates from the seed data
    let templates = getMockTemplates();

    // Filter by parameters
    if (creatorId) {
      templates = templates.filter((t) => t.creatorId === creatorId);
    }

    if (category) {
      templates = templates.filter((t) => t.category === category);
    }

    if (isActive !== null) {
      const activeFilter = isActive === 'true';
      templates = templates.filter((t) => t.isActive === activeFilter);
    }

    // Sort by performance (success rate * usage)
    templates.sort((a, b) => {
      const scoreA = a.successRate * a.timesUsed;
      const scoreB = b.successRate * b.timesUsed;
      return scoreB - scoreA;
    });

    return NextResponse.json({
      success: true,
      data: {
        templates,
        total: templates.length,
      },
    });

  } catch (error) {
    console.error('❌ Templates GET Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch templates',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/templates
 * Create a new template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      creatorId,
      name,
      templateText,
      category,
      targetTiers,
      minPrice,
      maxPrice,
      isNsfw,
    } = body;

    // Validate required fields
    if (!creatorId || !name || !templateText || !category || !targetTiers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new template
    const newTemplate: AITemplate = {
      id: `template_${Date.now()}`,
      creatorId,
      name,
      templateText,
      category,
      targetTiers,
      minPrice,
      maxPrice,
      isActive: true,
      isNsfw: isNsfw || false,
      successRate: 0,
      avgRevenue: 0,
      avgResponseTime: 0,
      timesUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Save to database
    // INSERT INTO ai_templates ...

    console.log('✅ Template created:', {
      id: newTemplate.id,
      name: newTemplate.name,
      category: newTemplate.category,
    });

    return NextResponse.json({
      success: true,
      data: newTemplate,
    });

  } catch (error) {
    console.error('❌ Template POST Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create template',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ai/templates/:id
 * Update an existing template
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json(
        { error: 'Template ID and updates are required' },
        { status: 400 }
      );
    }

    // TODO: Fetch from database
    const template = getMockTemplates().find((t) => t.id === id);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Apply updates
    const updatedTemplate: AITemplate = {
      ...template,
      ...updates,
      updatedAt: new Date(),
    };

    // TODO: Save to database
    // UPDATE ai_templates SET ... WHERE id = id

    console.log('✅ Template updated:', {
      id: updatedTemplate.id,
      updatedFields: Object.keys(updates),
    });

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
    });

  } catch (error) {
    console.error('❌ Template PATCH Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update template',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai/templates/:id
 * Delete a template
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // TODO: Delete from database
    // DELETE FROM ai_templates WHERE id = id

    console.log('✅ Template deleted:', { id });

    return NextResponse.json({
      success: true,
      data: {
        id,
        deleted: true,
      },
    });

  } catch (error) {
    console.error('❌ Template DELETE Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete template',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Mock templates (matches seed data)
 */
function getMockTemplates(): AITemplate[] {
  return [
    {
      id: 'template_1',
      creatorId: 'creator_1',
      name: 'VIP Whale Greeting',
      templateText: 'Hey babe! 😘 I noticed you just subscribed... I have something EXTRA special for you 💎 Want to see?',
      category: 'greeting',
      targetTiers: ['whale'],
      minPrice: 100,
      maxPrice: 250,
      isActive: true,
      isNsfw: true,
      successRate: 45.2,
      avgRevenue: 187.5,
      avgResponseTime: 180,
      timesUsed: 28,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template_2',
      creatorId: 'creator_1',
      name: 'PPV $25 Teaser',
      templateText: 'Just finished a hot photoshoot 📸🔥 Wanna see the pics I can\'t post anywhere else? Only $25 for the full set 💕',
      category: 'ppv_offer',
      targetTiers: ['high', 'medium'],
      minPrice: 20,
      maxPrice: 30,
      isActive: true,
      isNsfw: true,
      successRate: 28.5,
      avgRevenue: 22.5,
      avgResponseTime: 300,
      timesUsed: 142,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template_3',
      creatorId: 'creator_1',
      name: 'Re-engagement Casual',
      templateText: 'Hey stranger! 👋 Haven\'t heard from you in a while... miss chatting with you 💭 How have you been?',
      category: 'reengagement',
      targetTiers: ['high', 'medium', 'low'],
      isActive: true,
      isNsfw: false,
      successRate: 18.3,
      avgRevenue: 0,
      avgResponseTime: 480,
      timesUsed: 89,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template_4',
      creatorId: 'creator_1',
      name: 'Sexting Initiation',
      templateText: 'I\'m feeling so naughty right now 😈 Wish you were here... want to play? 💦',
      category: 'sexting',
      targetTiers: ['whale', 'high'],
      isActive: true,
      isNsfw: true,
      successRate: 35.7,
      avgRevenue: 45.0,
      avgResponseTime: 120,
      timesUsed: 67,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template_5',
      creatorId: 'creator_1',
      name: 'Custom Video Upsell',
      templateText: 'I loved our chat! 💕 Would you like a custom video just for you? I can make your fantasy come true 😘 Starting at $50',
      category: 'upsell',
      targetTiers: ['whale', 'high'],
      minPrice: 50,
      maxPrice: 200,
      isActive: true,
      isNsfw: true,
      successRate: 22.1,
      avgRevenue: 87.5,
      avgResponseTime: 240,
      timesUsed: 34,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template_6',
      creatorId: 'creator_1',
      name: 'Thank You Response',
      templateText: 'Thank you SO much babe! 🥰 You just made my day! I really appreciate your support 💖',
      category: 'response',
      targetTiers: ['whale', 'high', 'medium', 'low'],
      isActive: true,
      isNsfw: false,
      successRate: 42.8,
      avgRevenue: 0,
      avgResponseTime: 60,
      timesUsed: 198,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template_7',
      creatorId: 'creator_1',
      name: 'PPV $50 Exclusive',
      templateText: 'I just shot something REALLY special 🔥💦 This one\'s too hot for most... but I think you can handle it 😈 $50 for the full video',
      category: 'ppv_offer',
      targetTiers: ['whale', 'high'],
      minPrice: 45,
      maxPrice: 60,
      isActive: true,
      isNsfw: true,
      successRate: 31.2,
      avgRevenue: 48.0,
      avgResponseTime: 240,
      timesUsed: 76,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template_8',
      creatorId: 'creator_1',
      name: 'Morning Greeting',
      templateText: 'Good morning babe! ☀️ Hope you slept well... thinking about you 💭😘',
      category: 'greeting',
      targetTiers: ['whale', 'high', 'medium'],
      isActive: true,
      isNsfw: false,
      successRate: 24.5,
      avgRevenue: 0,
      avgResponseTime: 180,
      timesUsed: 156,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}
