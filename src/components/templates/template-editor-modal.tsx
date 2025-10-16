'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AITemplate } from '@/types';
import { X, Save, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateEditorModalProps {
  template?: AITemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Partial<AITemplate>) => void;
}

export function TemplateEditorModal({
  template,
  isOpen,
  onClose,
  onSave,
}: TemplateEditorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    templateText: '',
    category: 'response' as AITemplate['category'],
    targetTiers: [] as string[],
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    isNsfw: false,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        templateText: template.templateText,
        category: template.category,
        targetTiers: template.targetTiers,
        minPrice: template.minPrice,
        maxPrice: template.maxPrice,
        isNsfw: template.isNsfw,
      });
    } else {
      // Reset for new template
      setFormData({
        name: '',
        templateText: '',
        category: 'response',
        targetTiers: [],
        minPrice: undefined,
        maxPrice: undefined,
        isNsfw: false,
      });
    }
  }, [template, isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleTier = (tier: string) => {
    setFormData((prev) => ({
      ...prev,
      targetTiers: prev.targetTiers.includes(tier)
        ? prev.targetTiers.filter((t) => t !== tier)
        : [...prev.targetTiers, tier],
    }));
  };

  const categories: AITemplate['category'][] = [
    'greeting',
    'ppv_offer',
    'response',
    'sexting',
    'upsell',
    'reengagement',
    'custom',
  ];

  const tiers = ['whale', 'high', 'medium', 'low'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 m-4">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">
                {template ? 'Edit Template' : 'Create Template'}
              </h2>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Template Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., PPV $25 Teaser"
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={formData.category === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, category })}
                    className={cn(
                      'transition-all',
                      formData.category === category
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    {category.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Template Text */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Message Template
              </label>
              <textarea
                value={formData.templateText}
                onChange={(e) => setFormData({ ...formData, templateText: e.target.value })}
                placeholder="Write your message template here... Use {fanName}, {creatorName}, {price} as variables"
                rows={6}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
              />
              <p className="text-xs text-slate-400 mt-2">
                Available variables: {'{fanName}'}, {'{creatorName}'}, {'{price}'}, {'{content}'}
              </p>
            </div>

            {/* Target Tiers */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Target Tiers
              </label>
              <div className="flex gap-2">
                {tiers.map((tier) => (
                  <Button
                    key={tier}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTier(tier)}
                    className={cn(
                      'uppercase transition-all',
                      formData.targetTiers.includes(tier)
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    {tier}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range (for PPV/Upsell) */}
            {(formData.category === 'ppv_offer' || formData.category === 'upsell') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Min Price ($)
                  </label>
                  <Input
                    type="number"
                    value={formData.minPrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, minPrice: Number(e.target.value) || undefined })
                    }
                    placeholder="5"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Max Price ($)
                  </label>
                  <Input
                    type="number"
                    value={formData.maxPrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPrice: Number(e.target.value) || undefined })
                    }
                    placeholder="50"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>
            )}

            {/* NSFW Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isNsfw"
                checked={formData.isNsfw}
                onChange={(e) => setFormData({ ...formData, isNsfw: e.target.checked })}
                className="w-4 h-4 text-purple-500 bg-slate-800 border-slate-700 rounded focus:ring-purple-500"
              />
              <label htmlFor="isNsfw" className="text-sm text-slate-300">
                NSFW Content (Explicit/Adult)
              </label>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">
              Preview
            </label>
            <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
              <p className="text-sm text-slate-300 leading-relaxed">
                {formData.templateText || 'Your message preview will appear here...'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.templateText || formData.targetTiers.length === 0 || saving}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {template ? 'Update Template' : 'Create Template'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
