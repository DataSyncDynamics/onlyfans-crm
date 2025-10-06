import { NextResponse } from "next/server";
import { DataSyncService, SyncProgress } from "@/lib/services/data-sync";
import { CREATORS } from "@/lib/mock-data";

interface SyncStatus extends SyncProgress {
  isCurrentlySyncing: boolean;
  lastSyncAt?: Date;
  itemsSynced?: {
    transactions: number;
    fans: number;
  };
}

// In-memory storage for sync status (temporary - replace with database)
const syncStatuses = new Map<string, SyncStatus>();

export async function POST(
  request: Request,
  { params }: { params: { creatorId: string } }
) {
  try {
    const { creatorId } = params;

    // Get creator info
    const creator = CREATORS.find(c => c.id === creatorId);
    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    // Check if sync is already in progress
    const currentStatus = syncStatuses.get(creatorId);
    if (currentStatus?.isCurrentlySyncing) {
      return NextResponse.json(
        { error: "Sync already in progress" },
        { status: 409 }
      );
    }

    // TODO: Get access token from database
    // For now, use a mock token
    const accessToken = "mock_access_token";

    // Initialize sync status
    syncStatuses.set(creatorId, {
      isCurrentlySyncing: true,
      stage: "authenticating",
      message: "Starting sync...",
      progress: 0,
    });

    // Perform sync in background (don't await)
    DataSyncService.performInitialSync(
      creatorId,
      creator.ofUsername,
      accessToken,
      (progress) => {
        // Update sync status
        syncStatuses.set(creatorId, {
          isCurrentlySyncing: progress.stage !== "completed" && progress.stage !== "error",
          ...progress,
        });
      }
    ).then((result) => {
      // Update final status
      syncStatuses.set(creatorId, {
        isCurrentlySyncing: false,
        stage: result.success ? "completed" : "error",
        message: result.success ? "Sync completed" : (result.error || "Sync failed"),
        progress: result.success ? 100 : 0,
        lastSyncAt: result.syncedAt,
        itemsSynced: result.itemsSynced,
      });
    });

    return NextResponse.json({
      success: true,
      message: "Sync started",
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to start sync" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { creatorId: string } }
) {
  try {
    const { creatorId } = params;

    // Get sync status from database
    // TODO: Replace with Supabase query
    const status = syncStatuses.get(creatorId) || {
      isCurrentlySyncing: false,
      stage: "pending",
      message: "Not synced yet",
      progress: 0,
      lastSyncAt: null,
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to get sync status" },
      { status: 500 }
    );
  }
}
