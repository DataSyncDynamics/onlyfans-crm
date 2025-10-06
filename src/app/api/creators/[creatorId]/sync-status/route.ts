import { NextResponse } from "next/server";
import { SyncProgress } from "@/lib/services/data-sync";

interface SyncStatus extends SyncProgress {
  isCurrentlySyncing: boolean;
  lastSyncAt?: Date | null;
  itemsSynced?: {
    transactions: number;
    fans: number;
  };
}

// Import the same sync status storage from sync route
// In production, this would query the database
const syncStatuses = new Map<string, SyncStatus>();

export async function GET(
  request: Request,
  { params }: { params: { creatorId: string } }
) {
  try {
    const { creatorId } = params;

    // Get current sync status
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
