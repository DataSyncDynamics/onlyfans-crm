'use client';

/**
 * AI Approval Dashboard
 * Manages approval queue for AI-generated messages
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, DollarSign, AlertCircle, User, Zap, TrendingUp } from 'lucide-react';
import { ApprovalQueueItem } from '@/types';

export default function ApprovalsPage() {
  const [queue, setQueue] = useState<ApprovalQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalPending: number;
    byPriority: {
      urgent: number;
      high: number;
      normal: number;
      low: number;
    };
    totalEstimatedRevenue: number;
    avgWaitTimeMinutes: number;
  } | null>(null);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'high' | 'normal' | 'low'>('all');

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'pending');

      if (filter !== 'all') {
        params.append('priority', filter);
      }

      const response = await fetch(`/api/ai/approve?${params}`);
      const data = await response.json();

      if (data.success) {
        setQueue(data.data.items);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch approval queue:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch approval queue
  useEffect(() => {
    fetchQueue();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const handleApprove = async (item: ApprovalQueueItem) => {
    try {
      const response = await fetch('/api/ai/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: item.messageId,
          action: 'approve',
          chatterId: 'current_chatter', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        // Remove from queue
        setQueue((prev) => prev.filter((i) => i.id !== item.id));
        // Show success toast
        console.log('✅ Message approved');
      }
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (item: ApprovalQueueItem) => {
    try {
      const response = await fetch('/api/ai/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: item.messageId,
          action: 'reject',
          chatterId: 'current_chatter', // TODO: Get from auth context
          reviewNotes: 'Rejected from dashboard',
        }),
      });

      if (response.ok) {
        // Remove from queue
        setQueue((prev) => prev.filter((i) => i.id !== item.id));
        // Show success toast
        console.log('❌ Message rejected');
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const getPriorityColor = (priority: ApprovalQueueItem['priority']) => {
    const colors = {
      urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
      high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      normal: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: ApprovalQueueItem['priority']) => {
    if (priority === 'urgent') return '🚨';
    if (priority === 'high') return '⚡';
    if (priority === 'normal') return '📋';
    return '📝';
  };

  const formatTimeAgo = (date: Date) => {
    const now = Date.now();
    const diff = now - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-400" />
            AI Approval Queue
          </h1>
          <p className="text-slate-400 mt-1">
            Review AI-generated messages before sending
          </p>
        </div>

        <Button variant="outline" onClick={fetchQueue}>
          <Clock className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-2xl font-bold mt-1">{stats.totalPending}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Urgent</p>
                <p className="text-2xl font-bold mt-1 text-red-400">
                  {stats.byPriority.urgent}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Est. Revenue</p>
                <p className="text-2xl font-bold mt-1 text-green-400">
                  ${stats.totalEstimatedRevenue.toFixed(0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Wait</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.avgWaitTimeMinutes}m
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400 opacity-50" />
            </div>
          </Card>
        </div>
      )}

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="all">
            All ({stats?.totalPending || 0})
          </TabsTrigger>
          <TabsTrigger value="urgent" className="text-red-400">
            🚨 Urgent ({stats?.byPriority.urgent || 0})
          </TabsTrigger>
          <TabsTrigger value="high" className="text-orange-400">
            ⚡ High ({stats?.byPriority.high || 0})
          </TabsTrigger>
          <TabsTrigger value="normal">
            Normal ({stats?.byPriority.normal || 0})
          </TabsTrigger>
          <TabsTrigger value="low" className="text-slate-400">
            Low ({stats?.byPriority.low || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {/* Approval Queue Items */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-slate-400 mt-4">Loading approvals...</p>
            </div>
          ) : queue.length === 0 ? (
            <Card className="p-12 bg-slate-900/50 border-slate-800 text-center">
              <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
              <p className="text-slate-400">No messages pending approval</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {queue.map((item) => (
                <Card
                  key={item.id}
                  className={`p-6 border-2 transition-all hover:border-purple-500/50 ${
                    getPriorityColor(item.priority)
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Message Content */}
                    <div className="flex-1 space-y-3">
                      {/* Priority & Metadata */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge
                          variant="outline"
                          className={getPriorityColor(item.priority)}
                        >
                          {getPriorityIcon(item.priority)} {item.priority.toUpperCase()}
                        </Badge>

                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <User className="w-4 h-4" />
                          <span>Fan ID: {item.fanId.substring(0, 8)}...</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(item.createdAt)}</span>
                        </div>

                        {item.ppvPrice && (
                          <div className="flex items-center gap-2 text-sm text-green-400 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            <span>${item.ppvPrice}</span>
                          </div>
                        )}

                        {item.estimatedRevenue && (
                          <div className="text-sm text-slate-400">
                            Est. Revenue: ${item.estimatedRevenue.toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Message Preview */}
                      {item.message && (
                        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                          <p className="text-base leading-relaxed">
                            {item.message.messageText}
                          </p>
                        </div>
                      )}

                      {/* Reason */}
                      {item.reason && (
                        <div className="flex items-start gap-2 text-sm text-slate-400">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{item.reason}</span>
                        </div>
                      )}

                      {/* Expiration */}
                      {item.expiresAt && (
                        <div className="text-sm text-orange-400">
                          ⏰ Expires:{' '}
                          {new Date(item.expiresAt).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button
                        onClick={() => handleApprove(item)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(item)}
                        variant="destructive"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
