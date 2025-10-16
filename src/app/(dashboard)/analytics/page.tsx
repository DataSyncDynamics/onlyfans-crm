'use client';

/**
 * AI Analytics Dashboard
 * Performance tracking, revenue attribution, and optimization insights
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  Award,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  overview: {
    totalMessages: number;
    aiGenerated: number;
    humanWritten: number;
    approvalRate: number;
    avgConfidence: number;
    totalRevenue: number;
    aiRevenue: number;
    conversionRate: number;
  };
  performance: {
    byCategory: {
      category: string;
      sent: number;
      approved: number;
      revenue: number;
      conversionRate: number;
    }[];
    byTier: {
      tier: string;
      sent: number;
      revenue: number;
      avgRevenue: number;
      conversionRate: number;
    }[];
    byTime: {
      date: string;
      messages: number;
      revenue: number;
      approvalRate: number;
    }[];
  };
  topTemplates: {
    id: string;
    name: string;
    category: string;
    uses: number;
    successRate: number;
    revenue: number;
  }[];
  insights: {
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    action?: string;
  }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/ai/analytics?range=${timeRange}`);
      // const data = await response.json();

      // Mock data for now
      setAnalytics(getMockAnalytics());
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { overview, performance, topTemplates, insights } = analytics;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            AI Analytics
          </h1>
          <p className="text-slate-400 mt-1">
            Performance insights and optimization recommendations
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
            className={cn(
              timeRange === '7d'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'border-slate-700 bg-slate-800/50 text-slate-300'
            )}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
            className={cn(
              timeRange === '30d'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'border-slate-700 bg-slate-800/50 text-slate-300'
            )}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
            className={cn(
              timeRange === '90d'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'border-slate-700 bg-slate-800/50 text-slate-300'
            )}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Total Messages
              </p>
              <p className="text-3xl font-bold mt-2">{overview.totalMessages.toLocaleString()}</p>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-xs text-purple-400">AI Generated</p>
                  <p className="text-lg font-semibold text-purple-400">
                    {overview.aiGenerated.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Human</p>
                  <p className="text-lg font-semibold text-slate-300">
                    {overview.humanWritten.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <Sparkles className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Approval Rate
              </p>
              <p className="text-3xl font-bold mt-2 text-green-400">
                {overview.approvalRate.toFixed(1)}%
              </p>
              <div className="mt-3">
                <p className="text-xs text-slate-400">Avg Confidence</p>
                <p className="text-lg font-semibold text-blue-400">
                  {(overview.avgConfidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Revenue
              </p>
              <p className="text-3xl font-bold mt-2 text-green-400">
                ${overview.totalRevenue.toLocaleString()}
              </p>
              <div className="mt-3">
                <p className="text-xs text-slate-400">AI Attributed</p>
                <p className="text-lg font-semibold text-purple-400">
                  ${overview.aiRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Conversion Rate
              </p>
              <p className="text-3xl font-bold mt-2 text-yellow-400">
                {overview.conversionRate.toFixed(1)}%
              </p>
              <div className="mt-3 flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% vs last period</span>
              </div>
            </div>
            <Award className="w-8 h-8 text-yellow-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Insights Panel */}
      {insights.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-3">AI Insights</h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-800"
                  >
                    <div className="flex items-start gap-3">
                      {insight.type === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      )}
                      {insight.type === 'warning' && (
                        <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      )}
                      {insight.type === 'info' && (
                        <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white">{insight.title}</p>
                        <p className="text-sm text-slate-300 mt-1">{insight.description}</p>
                        {insight.action && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                          >
                            {insight.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Performance Breakdown */}
      <Tabs defaultValue="category" className="space-y-4">
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="tier">By Fan Tier</TabsTrigger>
          <TabsTrigger value="templates">Top Templates</TabsTrigger>
        </TabsList>

        {/* By Category */}
        <TabsContent value="category" className="space-y-4">
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Performance by Category</h3>
            <div className="space-y-3">
              {performance.byCategory.map((cat) => (
                <div
                  key={cat.category}
                  className="bg-slate-950/50 rounded-lg p-4 border border-slate-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white capitalize">
                        {cat.category.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-slate-400">{cat.sent} messages sent</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        cat.conversionRate >= 25
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : cat.conversionRate >= 15
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      )}
                    >
                      {cat.conversionRate.toFixed(1)}% CR
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Approved</p>
                      <p className="text-lg font-bold text-green-400">{cat.approved}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Revenue</p>
                      <p className="text-lg font-bold text-green-400">${cat.revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Avg Revenue</p>
                      <p className="text-lg font-bold text-blue-400">
                        ${(cat.revenue / cat.sent).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* By Tier */}
        <TabsContent value="tier" className="space-y-4">
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Performance by Fan Tier</h3>
            <div className="space-y-3">
              {performance.byTier.map((tier) => (
                <div
                  key={tier.tier}
                  className="bg-slate-950/50 rounded-lg p-4 border border-slate-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white uppercase">{tier.tier}</p>
                      <p className="text-sm text-slate-400">{tier.sent} messages sent</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs uppercase',
                        tier.tier === 'whale'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : tier.tier === 'high'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : tier.tier === 'medium'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      )}
                    >
                      {tier.tier}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Total Revenue</p>
                      <p className="text-lg font-bold text-green-400">${tier.revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Avg per Message</p>
                      <p className="text-lg font-bold text-blue-400">${tier.avgRevenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Conversion</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {tier.conversionRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Top Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Top Performing Templates</h3>
            <div className="space-y-3">
              {topTemplates.map((template, index) => (
                <div
                  key={template.id}
                  className="bg-slate-950/50 rounded-lg p-4 border border-slate-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{template.name}</p>
                        <p className="text-sm text-slate-400 capitalize">
                          {template.category.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      {template.successRate.toFixed(1)}% Success
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Times Used</p>
                      <p className="text-lg font-bold text-blue-400">{template.uses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Revenue</p>
                      <p className="text-lg font-bold text-green-400">${template.revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Avg per Use</p>
                      <p className="text-lg font-bold text-purple-400">
                        ${(template.revenue / template.uses).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Mock analytics data (temporary - replace with API call)
 */
function getMockAnalytics(): AnalyticsData {
  return {
    overview: {
      totalMessages: 1847,
      aiGenerated: 1324,
      humanWritten: 523,
      approvalRate: 87.3,
      avgConfidence: 0.82,
      totalRevenue: 18450,
      aiRevenue: 14280,
      conversionRate: 24.6,
    },
    performance: {
      byCategory: [
        {
          category: 'ppv_offer',
          sent: 487,
          approved: 425,
          revenue: 8640,
          conversionRate: 28.5,
        },
        {
          category: 'sexting',
          sent: 312,
          approved: 298,
          revenue: 3120,
          conversionRate: 35.7,
        },
        {
          category: 'greeting',
          sent: 234,
          approved: 234,
          revenue: 0,
          conversionRate: 24.5,
        },
        {
          category: 'upsell',
          sent: 156,
          approved: 142,
          revenue: 2975,
          conversionRate: 22.1,
        },
        {
          category: 'response',
          sent: 445,
          approved: 445,
          revenue: 0,
          conversionRate: 42.8,
        },
        {
          category: 'reengagement',
          sent: 213,
          approved: 203,
          revenue: 545,
          conversionRate: 18.3,
        },
      ],
      byTier: [
        {
          tier: 'whale',
          sent: 89,
          revenue: 5250,
          avgRevenue: 187,
          conversionRate: 45.2,
        },
        {
          tier: 'high',
          sent: 312,
          revenue: 7020,
          avgRevenue: 48,
          conversionRate: 31.2,
        },
        {
          tier: 'medium',
          sent: 645,
          revenue: 4860,
          avgRevenue: 23,
          conversionRate: 22.5,
        },
        {
          tier: 'low',
          sent: 801,
          revenue: 1320,
          avgRevenue: 8,
          conversionRate: 12.3,
        },
      ],
      byTime: [],
    },
    topTemplates: [
      {
        id: 'template_1',
        name: 'VIP Whale Greeting',
        category: 'greeting',
        uses: 28,
        successRate: 45.2,
        revenue: 5250,
      },
      {
        id: 'template_6',
        name: 'Thank You Response',
        category: 'response',
        uses: 198,
        successRate: 42.8,
        revenue: 0,
      },
      {
        id: 'template_4',
        name: 'Sexting Initiation',
        category: 'sexting',
        uses: 67,
        successRate: 35.7,
        revenue: 3015,
      },
      {
        id: 'template_7',
        name: 'PPV $50 Exclusive',
        category: 'ppv_offer',
        uses: 76,
        successRate: 31.2,
        revenue: 3648,
      },
      {
        id: 'template_2',
        name: 'PPV $25 Teaser',
        category: 'ppv_offer',
        uses: 142,
        successRate: 28.5,
        revenue: 3195,
      },
    ],
    insights: [
      {
        type: 'success',
        title: 'Whale Tier Performance Excellent',
        description:
          'Your AI-generated messages to whale tier fans have a 45.2% conversion rate, generating $5,250 in revenue. This is 13% above industry average.',
      },
      {
        type: 'warning',
        title: 'Low Tier Messages Need Optimization',
        description:
          'Conversion rate for low tier fans is only 12.3%. Consider creating more engaging greeting templates or adjusting pricing strategy.',
        action: 'Optimize Templates',
      },
      {
        type: 'info',
        title: 'PPV Offers Peak at 9-11 PM',
        description:
          'Analysis shows PPV offers sent between 9-11 PM have 34% higher conversion rates. Consider scheduling more messages during this window.',
        action: 'Adjust Schedule',
      },
    ],
  };
}
