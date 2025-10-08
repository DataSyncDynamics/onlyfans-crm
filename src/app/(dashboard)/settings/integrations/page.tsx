"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ConnectionStatusCard } from "@/components/integrations/connection-status-card";
import { ConnectionHealthDashboard } from "@/components/integrations/connection-health-dashboard";
import { SyncActivityLog } from "@/components/integrations/sync-activity-log";
import { ConnectOnlyFansWizard } from "@/components/integrations/connect-onlyfans-wizard";
import { SyncPreviewModal } from "@/components/integrations/sync-preview-modal";

// Mock data - will be replaced with actual API calls
const mockConnections = [
  {
    id: "1",
    creatorName: "Bella Rose",
    ofUsername: "bellarose",
    status: "connected" as const,
    lastSync: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    nextSync: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    autoSync: true,
    health: 98,
  },
  {
    id: "2",
    creatorName: "Scarlett Moon",
    ofUsername: "scarlettmoon",
    status: "warning" as const,
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    nextSync: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
    autoSync: true,
    health: 72,
  },
  {
    id: "3",
    creatorName: "Luna Star",
    ofUsername: "lunastar",
    status: "error" as const,
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    nextSync: undefined,
    autoSync: false,
    health: 45,
  },
];

const mockActivities = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: "auto" as const,
    status: "success" as const,
    creatorName: "Bella Rose",
    itemsSynced: {
      messages: 45,
      subscribers: 12,
      transactions: 8,
      content: 3,
    },
    duration: 23,
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: "manual" as const,
    status: "success" as const,
    creatorName: "Scarlett Moon",
    itemsSynced: {
      messages: 32,
      subscribers: 8,
      transactions: 15,
      content: 5,
    },
    duration: 18,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    type: "auto" as const,
    status: "partial" as const,
    creatorName: "Luna Star",
    itemsSynced: {
      messages: 12,
      subscribers: 0,
      transactions: 3,
      content: 1,
    },
    error: "Subscriber sync failed due to API timeout",
    duration: 45,
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    type: "auto" as const,
    status: "success" as const,
    creatorName: "Bella Rose",
    itemsSynced: {
      messages: 28,
      subscribers: 6,
      transactions: 11,
      content: 2,
    },
    duration: 19,
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    type: "manual" as const,
    status: "failed" as const,
    creatorName: "Luna Star",
    itemsSynced: {
      messages: 0,
      subscribers: 0,
      transactions: 0,
      content: 0,
    },
    error: "Authentication failed. Please check your API key.",
    duration: 5,
  },
];

const mockHealth = {
  totalConnections: 3,
  connectedCount: 1,
  warningCount: 1,
  errorCount: 1,
  syncSuccessRate: 85,
  totalItemsSynced: 45234,
  last24Hours: {
    syncs: 12,
    items: 456,
  },
};

const mockSyncPreview = {
  newMessages: 23,
  newSubscribers: 5,
  newTransactions: 12,
  newContent: 3,
  estimatedDuration: 15,
};

export default function IntegrationsPage() {
  const [connections, setConnections] = React.useState(mockConnections);
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [syncPreviewOpen, setSyncPreviewOpen] = React.useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = React.useState<
    string | null
  >(null);

  const handleSync = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setSyncPreviewOpen(true);
  };

  const handleConfirmSync = () => {
    console.log("Starting sync for connection:", selectedConnectionId);
    // In production, this would trigger the actual sync
  };

  const handleDisconnect = (connectionId: string) => {
    if (
      confirm(
        "Are you sure you want to disconnect this OnlyFans account? This action cannot be undone."
      )
    ) {
      setConnections(connections.filter((c) => c.id !== connectionId));
    }
  };

  const handleSettings = (connectionId: string) => {
    console.log("Opening settings for connection:", connectionId);
    // In production, this would open a settings modal/page
  };

  const handleToggleAutoSync = (connectionId: string, enabled: boolean) => {
    setConnections(
      connections.map((c) =>
        c.id === connectionId ? { ...c, autoSync: enabled } : c
      )
    );
  };

  const handleWizardComplete = (config: any) => {
    console.log("New connection configured:", config);
    // In production, this would create the connection via API
    const newConnection = {
      id: `${connections.length + 1}`,
      creatorName: config.username,
      ofUsername: config.username,
      status: "connected" as const,
      lastSync: new Date(),
      nextSync: new Date(
        Date.now() +
          parseInt(config.syncInterval) * 60 * 60 * 1000
      ),
      autoSync: true,
      health: 100,
    };
    setConnections([...connections, newConnection]);
  };

  const selectedConnection = connections.find(
    (c) => c.id === selectedConnectionId
  );

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            OnlyFans Integrations
          </h1>
          <p className="text-slate-400">
            Connect and manage your OnlyFans creator accounts
          </p>
        </div>
        <Button
          onClick={() => setWizardOpen(true)}
          className="min-h-[44px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Connect New Account
        </Button>
      </div>

      {/* Connection Health Dashboard */}
      <div className="mb-8">
        <ConnectionHealthDashboard health={mockHealth} />
      </div>

      {/* Connection Status Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Connected Accounts
        </h2>
        {connections.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-8 text-center">
            <p className="text-slate-400 mb-4">
              No OnlyFans accounts connected yet
            </p>
            <Button
              onClick={() => setWizardOpen(true)}
              variant="outline"
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Your First Account
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {connections.map((connection) => (
              <ConnectionStatusCard
                key={connection.id}
                connection={connection}
                onSync={() => handleSync(connection.id)}
                onDisconnect={() => handleDisconnect(connection.id)}
                onSettings={() => handleSettings(connection.id)}
                onToggleAutoSync={(enabled) =>
                  handleToggleAutoSync(connection.id, enabled)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Sync Activity Log */}
      <div>
        <SyncActivityLog activities={mockActivities} maxItems={10} />
      </div>

      {/* Modals */}
      <ConnectOnlyFansWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onComplete={handleWizardComplete}
      />

      {selectedConnection && (
        <SyncPreviewModal
          open={syncPreviewOpen}
          onOpenChange={setSyncPreviewOpen}
          creatorName={selectedConnection.creatorName}
          preview={mockSyncPreview}
          onConfirm={handleConfirmSync}
        />
      )}
    </div>
  );
}
