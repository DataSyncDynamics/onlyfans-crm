'use client';

/**
 * Template Manager Dashboard
 * Manage message templates with performance analytics
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Plus,
  Search,
  TrendingUp,
  DollarSign,
  Target,
  Edit,
  Trash2,
  BarChart3,
  Zap,
  Heart,
} from 'lucide-react';
import { AITemplate } from '@/types';
import { cn } from '@/lib/utils';
import { TemplateEditorModal } from '@/components/templates/template-editor-modal';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<AITemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AITemplate['category'] | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AITemplate | null>(null);

  // Fetch templates
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/ai/templates');
      // const data = await response.json();

      // Mock data for now
      setTemplates(getMockTemplates());
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.templateText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: AITemplate['category']) => {
    switch (category) {
      case 'greeting': return <Heart className="w-4 h-4" />;
      case 'ppv_offer': return <DollarSign className="w-4 h-4" />;
      case 'reengagement': return <Zap className="w-4 h-4" />;
      case 'response': return <MessageSquare className="w-4 h-4" />;
      case 'sexting': return <Heart className="w-4 h-4" />;
      case 'upsell': return <TrendingUp className="w-4 h-4" />;
      case 'custom': return <Edit className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: AITemplate['category']) => {
    switch (category) {
      case 'greeting': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ppv_offer': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'reengagement': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'response': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'sexting': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'upsell': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'custom': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'whale': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'high': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'medium': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'low': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getPerformanceColor = (successRate: number) => {
    if (successRate >= 30) return 'text-green-400';
    if (successRate >= 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleSaveTemplate = async (templateData: Partial<AITemplate>) => {
    try {
      const endpoint = editingTemplate
        ? '/api/ai/templates'
        : '/api/ai/templates';

      const method = editingTemplate ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingTemplate
            ? { id: editingTemplate.id, updates: templateData }
            : { creatorId: 'creator_1', ...templateData }
        ),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh templates
        fetchTemplates();
        setShowCreateModal(false);
        setEditingTemplate(null);
        console.log('✅ Template saved successfully');
      }
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleEditTemplate = (template: AITemplate) => {
    setEditingTemplate(template);
    setShowCreateModal(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/ai/templates?id=${templateId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchTemplates();
        console.log('✅ Template deleted');
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            Template Manager
          </h1>
          <p className="text-slate-400 mt-1">
            Manage message templates and track performance
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/50 border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Templates</p>
              <p className="text-2xl font-bold mt-1">{templates.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/50 border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Success Rate</p>
              <p className="text-2xl font-bold mt-1 text-green-400">
                {templates.length > 0
                  ? Math.round(templates.reduce((sum, t) => sum + t.successRate, 0) / templates.length)
                  : 0}%
              </p>
            </div>
            <Target className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/50 border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Revenue</p>
              <p className="text-2xl font-bold mt-1 text-green-400">
                ${templates.reduce((sum, t) => sum + t.avgRevenue * t.timesUsed, 0).toFixed(0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/50 border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Uses</p>
              <p className="text-2xl font-bold mt-1">
                {templates.reduce((sum, t) => sum + t.timesUsed, 0)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 bg-slate-900/50 border-slate-800 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="all">
            All ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="greeting">
            Greeting ({templates.filter(t => t.category === 'greeting').length})
          </TabsTrigger>
          <TabsTrigger value="ppv_offer">
            PPV ({templates.filter(t => t.category === 'ppv_offer').length})
          </TabsTrigger>
          <TabsTrigger value="response">
            Response ({templates.filter(t => t.category === 'response').length})
          </TabsTrigger>
          <TabsTrigger value="sexting">
            Sexting ({templates.filter(t => t.category === 'sexting').length})
          </TabsTrigger>
          <TabsTrigger value="upsell">
            Upsell ({templates.filter(t => t.category === 'upsell').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {/* Template Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-slate-400 mt-4">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <Card className="p-12 bg-slate-900/50 border-slate-800 text-center">
              <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Templates Found</h3>
              <p className="text-slate-400">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first template to get started'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "p-6 border-2 transition-all hover:border-purple-500/50",
                    template.isActive ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-900/30 border-slate-800/50 opacity-60'
                  )}
                >
                  <div className="space-y-4">
                    {/* Template Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                          {!template.isActive && (
                            <Badge variant="outline" className="text-xs text-slate-500">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={cn('text-xs border', getCategoryColor(template.category))}
                          >
                            {getCategoryIcon(template.category)}
                            <span className="ml-1">{template.category.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTemplate(template)}
                          className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="border-red-700/50 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Template Preview */}
                    <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                      <p className="text-sm leading-relaxed text-slate-300 line-clamp-3">
                        {template.templateText}
                      </p>
                    </div>

                    {/* Target Tiers */}
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">Target:</span>
                      <div className="flex gap-1">
                        {template.targetTiers.map((tier) => (
                          <Badge
                            key={tier}
                            variant="outline"
                            className={cn('text-xs uppercase', getTierBadgeColor(tier))}
                          >
                            {tier}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/50">
                      <div>
                        <p className="text-xs text-slate-400">Success Rate</p>
                        <p className={cn('text-lg font-bold mt-1', getPerformanceColor(template.successRate))}>
                          {template.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Avg Revenue</p>
                        <p className="text-lg font-bold text-green-400 mt-1">
                          ${template.avgRevenue.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Times Used</p>
                        <p className="text-lg font-bold text-blue-400 mt-1">
                          {template.timesUsed}
                        </p>
                      </div>
                    </div>

                    {/* Price Range (if applicable) */}
                    {template.minPrice && template.maxPrice && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <DollarSign className="w-4 h-4" />
                        <span>Price Range: ${template.minPrice} - ${template.maxPrice}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Template Editor Modal */}
      <TemplateEditorModal
        template={editingTemplate}
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}

/**
 * Mock templates (temporary - replace with API call)
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
  ];
}
