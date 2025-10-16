/**
 * AI Approval Workflow API
 * Manages approval queue for AI-generated messages
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  validateApprovalDecision,
  getApprovalQueueStats,
  isApprovalExpired,
} from '@/lib/ai-chatter/approval';
import { ApprovalQueueItem } from '@/types';

/**
 * GET /api/ai/approve
 * Get approval queue items
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const creatorId = searchParams.get('creatorId');
    const chatterId = searchParams.get('chatterId');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status') || 'pending';

    // TODO: Fetch from database
    // For now, return mock approval queue
    const queue = getMockApprovalQueue();

    // Filter by parameters
    let filtered = queue.filter((item) => item.status === status);

    if (creatorId) {
      filtered = filtered.filter((item) => item.creatorId === creatorId);
    }

    if (chatterId) {
      filtered = filtered.filter((item) => item.assignedChatterId === chatterId);
    }

    if (priority) {
      filtered = filtered.filter((item) => item.priority === priority);
    }

    // Sort by priority and creation time
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    filtered.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    // Get statistics
    const stats = getApprovalQueueStats(queue);

    return NextResponse.json({
      success: true,
      data: {
        items: filtered,
        stats,
        total: filtered.length,
      },
    });

  } catch (error) {
    console.error('❌ Approval Queue GET Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch approval queue',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/approve
 * Approve or reject a message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      approvalQueueItemId,
      messageId,
      action, // 'approve' | 'reject'
      chatterId,
      reviewNotes,
    } = body;

    // Validate required fields
    if (!messageId || !action || !chatterId) {
      return NextResponse.json(
        { error: 'messageId, action, and chatterId are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'action must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // TODO: Fetch approval item from database
    const approvalItem = getMockApprovalItem(approvalQueueItemId || messageId);

    if (!approvalItem) {
      return NextResponse.json(
        { error: 'Approval item not found' },
        { status: 404 }
      );
    }

    // Check if expired
    if (isApprovalExpired(approvalItem)) {
      return NextResponse.json(
        { error: 'Approval request has expired' },
        { status: 410 } // Gone
      );
    }

    // Validate chatter has permission
    const validation = validateApprovalDecision({
      chatterId,
      creatorId: approvalItem.creatorId,
      assignedChatterIds: approvalItem.assignedChatterId ? [approvalItem.assignedChatterId] : undefined,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 403 }
      );
    }

    // Update approval item
    const updatedItem: ApprovalQueueItem = {
      ...approvalItem,
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date(),
      reviewedBy: chatterId,
      reviewNotes,
    };

    // TODO: Save to database
    console.log('✅ Approval Decision:', {
      messageId,
      action,
      chatterId,
      priority: approvalItem.priority,
      estimatedRevenue: approvalItem.estimatedRevenue,
    });

    // If approved, mark message as ready to send
    if (action === 'approve') {
      // TODO: Update ai_messages table status to 'approved'
      // TODO: Trigger send workflow (or queue for sending)
    }

    // Log analytics event
    // TODO: Insert into ai_analytics_events table

    return NextResponse.json({
      success: true,
      data: {
        approvalQueueItem: updatedItem,
        action,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('❌ Approval POST Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process approval',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai/approve
 * Bulk clear expired approvals
 */
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Update all expired items in database
    // UPDATE approval_queue SET status = 'expired' WHERE status = 'pending' AND expires_at < NOW()

    const deletedCount = 0; // TODO: Get actual count from database

    console.log('✅ Cleared expired approvals:', deletedCount);

    return NextResponse.json({
      success: true,
      data: {
        deletedCount,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('❌ Approval DELETE Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear expired approvals',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Mock approval queue (temporary - replace with database)
 */
function getMockApprovalQueue(): ApprovalQueueItem[] {
  return [
    {
      id: 'approval_1',
      messageId: 'msg_1',
      fanId: 'fan_1',
      creatorId: 'creator_1',
      assignedChatterId: 'chatter_1',
      priority: 'urgent',
      reason: 'High-value PPV offer ($150) • Whale tier fan - VIP treatment',
      ppvPrice: 150,
      estimatedRevenue: 67.50,
      status: 'pending',
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    },
    {
      id: 'approval_2',
      messageId: 'msg_2',
      fanId: 'fan_2',
      creatorId: 'creator_1',
      priority: 'high',
      reason: 'High-value PPV offer ($75)',
      ppvPrice: 75,
      estimatedRevenue: 18.75,
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    },
    {
      id: 'approval_3',
      messageId: 'msg_3',
      fanId: 'fan_3',
      creatorId: 'creator_2',
      priority: 'normal',
      reason: 'First message to this fan',
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  ];
}

/**
 * Get mock approval item by ID
 */
function getMockApprovalItem(id: string): ApprovalQueueItem | null {
  const queue = getMockApprovalQueue();
  return queue.find((item) => item.id === id || item.messageId === id) || null;
}
