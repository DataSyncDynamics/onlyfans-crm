/**
 * Data Sync Orchestration Service
 * Coordinates syncing data from OnlyFans API to our database
 */

import { OnlyFansAPI, mapOFTransactionToTransaction, mapOFSubscriberToFan, calculateCreatorMetrics } from "@/lib/integrations/onlyfans-api";
import { Creator, Fan, Transaction } from "@/types";

export interface SyncProgress {
  stage: "authenticating" | "fetching_stats" | "fetching_transactions" | "fetching_fans" | "processing" | "completed" | "error";
  message: string;
  progress: number; // 0-100
  itemsSynced?: {
    transactions: number;
    fans: number;
  };
}

export interface SyncResult {
  success: boolean;
  creatorId: string;
  itemsSynced: {
    transactions: number;
    fans: number;
  };
  updatedMetrics: Pick<Creator, "totalRevenue" | "totalFans" | "activeFans">;
  error?: string;
  syncedAt: Date;
}

export class DataSyncService {
  /**
   * Perform initial sync for a newly connected creator
   * Pulls last 90 days of data
   */
  static async performInitialSync(
    creatorId: string,
    ofUsername: string,
    accessToken: string,
    onProgress?: (progress: SyncProgress) => void
  ): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      creatorId,
      itemsSynced: {
        transactions: 0,
        fans: 0,
      },
      updatedMetrics: {
        totalRevenue: 0,
        totalFans: 0,
        activeFans: 0,
      },
      syncedAt: new Date(),
    };

    try {
      // Stage 1: Authenticate
      onProgress?.({
        stage: "authenticating",
        message: "Verifying OnlyFans connection...",
        progress: 10,
      });

      const authResult = await OnlyFansAPI.authenticateCreator(ofUsername, accessToken);
      if (!authResult.valid) {
        throw new Error("Invalid OnlyFans credentials");
      }

      // Stage 2: Fetch creator stats
      onProgress?.({
        stage: "fetching_stats",
        message: "Fetching creator statistics...",
        progress: 25,
      });

      const stats = await OnlyFansAPI.getCreatorStats(ofUsername, accessToken);
      if (stats) {
        result.updatedMetrics = calculateCreatorMetrics(stats);
      }

      // Stage 3: Fetch transactions (last 90 days)
      onProgress?.({
        stage: "fetching_transactions",
        message: "Syncing transaction history...",
        progress: 40,
      });

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90); // 90 days ago

      const ofTransactions = await OnlyFansAPI.getTransactionHistory(
        ofUsername,
        accessToken,
        startDate
      );

      onProgress?.({
        stage: "fetching_transactions",
        message: `Found ${ofTransactions.length} transactions...`,
        progress: 55,
      });

      // Stage 4: Fetch subscribers/fans
      onProgress?.({
        stage: "fetching_fans",
        message: "Syncing subscriber data...",
        progress: 70,
      });

      const ofSubscribers = await OnlyFansAPI.getSubscribers(ofUsername, accessToken);

      onProgress?.({
        stage: "fetching_fans",
        message: `Found ${ofSubscribers.length} fans...`,
        progress: 85,
      });

      // Stage 5: Process and store data
      onProgress?.({
        stage: "processing",
        message: "Processing and storing data...",
        progress: 90,
      });

      // Map OF subscribers to our Fan model
      const fans = ofSubscribers.map(ofSub => ({
        id: `fan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...mapOFSubscriberToFan(ofSub, creatorId),
      }));

      // Create a map of OF user ID to our fan ID for transaction mapping
      const fanIdMap = new Map<string, string>();
      ofSubscribers.forEach((ofSub, index) => {
        const fan = fans[index];
        if (fan) {
          fanIdMap.set(ofSub.id, fan.id);
        }
      });

      // Map OF transactions to our Transaction model
      const transactions = ofTransactions
        .filter(ofTxn => fanIdMap.has(ofTxn.userId)) // Only include transactions for known fans
        .map(ofTxn => ({
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...mapOFTransactionToTransaction(
            ofTxn,
            creatorId,
            fanIdMap.get(ofTxn.userId)!
          ),
        }));

      // Store in database (currently in mock data)
      // TODO: Replace with Supabase storage
      await this.storeTransactions(transactions);
      await this.storeFans(fans);
      await this.updateCreatorMetrics(creatorId, result.updatedMetrics);

      result.itemsSynced = {
        transactions: transactions.length,
        fans: fans.length,
      };

      // Stage 6: Complete
      onProgress?.({
        stage: "completed",
        message: "Sync completed successfully!",
        progress: 100,
        itemsSynced: result.itemsSynced,
      });

      result.success = true;
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      onProgress?.({
        stage: "error",
        message: `Sync failed: ${errorMessage}`,
        progress: 0,
      });

      result.error = errorMessage;
      return result;
    }
  }

  /**
   * Perform incremental sync (only new data since last sync)
   */
  static async performIncrementalSync(
    creatorId: string,
    ofUsername: string,
    accessToken: string,
    lastSyncDate: Date
  ): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      creatorId,
      itemsSynced: {
        transactions: 0,
        fans: 0,
      },
      updatedMetrics: {
        totalRevenue: 0,
        totalFans: 0,
        activeFans: 0,
      },
      syncedAt: new Date(),
    };

    try {
      // Fetch only new transactions since last sync
      await OnlyFansAPI.getTransactionHistory(
        ofUsername,
        accessToken,
        lastSyncDate
      );

      // Fetch updated stats
      const stats = await OnlyFansAPI.getCreatorStats(ofUsername, accessToken);
      if (stats) {
        result.updatedMetrics = calculateCreatorMetrics(stats);
      }

      // Process new transactions (simplified for incremental)
      // In production, this would need to handle fan lookup/creation
      const transactions: Transaction[] = []; // TODO: Implement mapping

      await this.storeTransactions(transactions);
      await this.updateCreatorMetrics(creatorId, result.updatedMetrics);

      result.itemsSynced = {
        transactions: transactions.length,
        fans: 0, // Incremental sync doesn't re-fetch all fans
      };

      result.success = true;
      return result;

    } catch (error) {
      result.error = error instanceof Error ? error.message : "Unknown error";
      return result;
    }
  }

  /**
   * Store transactions in database
   * TODO: Replace with Supabase insert
   */
  private static async storeTransactions(transactions: Transaction[]): Promise<void> {
    // For now, we'll add to mock data
    const { TRANSACTIONS } = await import("@/lib/mock-data");
    TRANSACTIONS.push(...transactions);
  }

  /**
   * Store fans in database
   * TODO: Replace with Supabase insert
   */
  private static async storeFans(fans: Fan[]): Promise<void> {
    // For now, we'll add to mock data
    const { FANS } = await import("@/lib/mock-data");
    FANS.push(...fans);
  }

  /**
   * Update creator metrics
   * TODO: Replace with Supabase update
   */
  private static async updateCreatorMetrics(
    creatorId: string,
    metrics: Pick<Creator, "totalRevenue" | "totalFans" | "activeFans">
  ): Promise<void> {
    // For now, we'll update mock data
    const { CREATORS } = await import("@/lib/mock-data");
    const creator = CREATORS.find(c => c.id === creatorId);
    if (creator) {
      creator.totalRevenue = metrics.totalRevenue;
      creator.totalFans = metrics.totalFans;
      creator.activeFans = metrics.activeFans;
    }
  }

  /**
   * Get sync status for a creator
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getSyncStatus(_creatorId: string): Promise<{
    lastSyncAt: Date | null;
    syncEnabled: boolean;
    isCurrentlySyncing: boolean;
    error?: string;
  }> {
    // TODO: Fetch from database
    return {
      lastSyncAt: null,
      syncEnabled: false,
      isCurrentlySyncing: false,
    };
  }

  /**
   * Enable/disable auto-sync for creator
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async setSyncEnabled(_creatorId: string, _enabled: boolean): Promise<void> {
    // TODO: Update in database
  }
}
