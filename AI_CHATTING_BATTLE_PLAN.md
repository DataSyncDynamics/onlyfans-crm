# AI Chatting System - Battle Plan & Implementation Strategy

**Project**: VaultCRM AI-Powered Chatting System
**Created**: 2025-10-15
**Target**: Production-ready AI integration with Anthropic Claude
**Status**: Pre-Implementation Analysis

---

## Executive Summary

### Current State Assessment
✅ **Existing Infrastructure (Strong Foundation)**:
- Complete type system for AI (`AISuggestion`, `Conversation`, `ChatMessage`, `MessageTemplate`, `KeywordAlert`)
- Working chat UI with 3-panel layout (conversations, messages, AI suggestions)
- Mock AI suggestions panel already implemented
- Campaign system with A/B testing infrastructure
- 1,050 fans, 3 creators, 5 chatters in mock data
- Supabase/PostgreSQL database ready
- Next.js 14 with TypeScript strict mode
- Comprehensive component library

⚠️ **Missing Components**:
- No Anthropic SDK installed
- No AI-specific database tables
- No API routes for AI generation/approval
- No actual Claude integration (currently mock data)
- No content filtering/safety layer
- No learning/feedback system

---

## Critical Risks & Dependencies

### HIGH PRIORITY RISKS

#### 1. Breaking Existing Functionality
**Risk**: AI system could interfere with current chat workflow
**Mitigation**:
- Implement AI as optional layer (feature flag)
- Create separate database tables (no schema changes to existing)
- Build parallel API routes (don't modify existing)
- Graceful degradation if AI fails

#### 2. NSFW Content Safety
**Risk**: Claude generating inappropriate content or refusing NSFW context
**Mitigation**:
- Claude 3.5 Sonnet supports adult content with proper prompting
- Implement pre-filtering layer (sanitize inputs before Claude)
- Post-filtering validation (check outputs)
- Human approval required for high-value messages
- Clear content policy in system prompts

#### 3. Cost Control
**Risk**: Uncontrolled API calls leading to high costs
**Mitigation**:
- Rate limiting per chatter/creator
- Cache common responses
- Batch message analysis
- Set daily/monthly spend limits
- Monitor token usage

#### 4. Database Performance
**Risk**: New AI tables slow down existing queries
**Mitigation**:
- Separate schema for AI data
- Indexed efficiently from day 1
- No foreign key cascades on critical tables
- Async processing for analytics

#### 5. Type Safety & Integration
**Risk**: New AI types conflict with existing system
**Mitigation**:
- Extend existing types (don't replace)
- Use namespaced AI types
- Strict TypeScript throughout
- Comprehensive integration tests

---

## Architecture Analysis

### What We Have (Existing)
```
/src
  /types/index.ts          ✅ AI types already defined
  /components/chat/        ✅ UI components ready
    ai-suggestion-panel.tsx
    keyword-detector.tsx
  /app/(dashboard)/chat/   ✅ Chat page working
  /lib/mock-data.ts        ✅ Mock AI suggestions
```

### What We Need (New)
```
/src
  /lib/ai/                 ❌ NEW - AI engine core
    anthropic-client.ts
    message-generator.ts
    personality-engine.ts
    content-filter.ts
    approval-logic.ts
  /app/api/ai/            ❌ NEW - AI API routes
    generate/route.ts
    approve/route.ts
    learn/route.ts
  /components/ai/         ❌ NEW - AI-specific components
    approval-queue.tsx
    template-manager.tsx
    analytics-dashboard.tsx
  /types/ai.types.ts      ❌ NEW - Extended AI types
```

---

## Phase Breakdown & Priority

### ✅ PHASE 0: Foundation (Do First - Week 1)
**Goal**: Set up infrastructure without breaking anything

**Tasks**:
1. Install Anthropic SDK: `npm install @anthropic-ai/sdk`
2. Add environment variable: `ANTHROPIC_API_KEY`
3. Create `/src/lib/ai/` directory structure
4. Set up feature flag: `NEXT_PUBLIC_ENABLE_AI_CHAT=false`
5. Create AI database schema (run migrations)
6. Add AI-specific types to `/src/types/ai.types.ts`

**Deliverable**: Infrastructure ready, zero impact on existing system

---

### 🔥 PHASE 1: Core AI System (Critical Path - Week 1-2)

#### 1.1 Database Schema
**Priority**: HIGHEST - Everything depends on this

```sql
-- Message generation history
CREATE TABLE ai_message_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  fan_id UUID NOT NULL,
  creator_id UUID NOT NULL,
  chatter_id UUID,
  prompt_template TEXT NOT NULL,
  generated_message TEXT NOT NULL,
  confidence_score DECIMAL(5,2),
  generation_metadata JSONB,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'auto_sent', 'queued')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  sent_at TIMESTAMPTZ
);

-- Creator personality profiles
CREATE TABLE ai_creator_personalities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL UNIQUE,
  personality_type TEXT NOT NULL,
  tone_descriptors TEXT[] NOT NULL,
  forbidden_words TEXT[],
  preferred_phrases TEXT[],
  emoji_style TEXT,
  nsfw_comfort_level TEXT CHECK (nsfw_comfort_level IN ('mild', 'moderate', 'explicit')),
  sample_messages TEXT[],
  system_prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message templates
CREATE TABLE ai_message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  template_text TEXT NOT NULL,
  variables JSONB,
  performance_stats JSONB,
  usage_count INTEGER DEFAULT 0,
  avg_conversion_rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning & feedback
CREATE TABLE ai_message_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generation_id UUID REFERENCES ai_message_generations(id),
  feedback_type TEXT CHECK (feedback_type IN ('approved', 'rejected', 'modified', 'auto_success')),
  original_message TEXT NOT NULL,
  final_message TEXT,
  modification_notes TEXT,
  performance_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B test tracking
CREATE TABLE ai_ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_name TEXT NOT NULL,
  creator_id UUID NOT NULL,
  variant_a_template TEXT NOT NULL,
  variant_b_template TEXT NOT NULL,
  traffic_split INTEGER DEFAULT 50,
  status TEXT CHECK (status IN ('active', 'paused', 'completed')),
  results JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_generations_conversation ON ai_message_generations(conversation_id);
CREATE INDEX idx_generations_creator ON ai_message_generations(creator_id);
CREATE INDEX idx_generations_status ON ai_message_generations(status);
CREATE INDEX idx_generations_created ON ai_message_generations(created_at DESC);
CREATE INDEX idx_feedback_generation ON ai_message_feedback(generation_id);
CREATE INDEX idx_templates_creator ON ai_message_templates(creator_id);
CREATE INDEX idx_templates_category ON ai_message_templates(category);
```

**Files to Create**:
- `/supabase/migrations/20251015_ai_system.sql`

**Why First**: All other components depend on this schema

---

#### 1.2 TypeScript Types Extension
**Priority**: HIGHEST

**File**: `/src/types/ai.types.ts`

```typescript
// Extended AI types for actual implementation
export interface AIGenerationRequest {
  conversationId: string;
  fanId: string;
  creatorId: string;
  chatterId: string;
  context: {
    recentMessages: ChatMessage[];
    fanTier: 'whale' | 'high' | 'medium' | 'low';
    fanLifetimeValue: number;
    fanEngagement: number;
    lastPurchase?: Date;
  };
  generationType: 'reply' | 'upsell' | 'ppv_offer' | 'reengagement';
  constraints?: {
    maxLength?: number;
    includePrice?: boolean;
    targetPrice?: number;
    tone?: string;
  };
}

export interface AIGenerationResponse {
  id: string;
  message: string;
  confidence: number;
  reasoning: string;
  suggestedPrice?: number;
  requiresApproval: boolean;
  metadata: {
    modelVersion: string;
    tokensUsed: number;
    generatedAt: Date;
  };
}

export interface CreatorPersonality {
  id: string;
  creatorId: string;
  personalityType: 'flirty' | 'friendly' | 'dominant' | 'submissive' | 'custom';
  toneDescriptors: string[];
  forbiddenWords: string[];
  preferredPhrases: string[];
  emojiStyle: 'heavy' | 'moderate' | 'minimal' | 'none';
  nsfwComfortLevel: 'mild' | 'moderate' | 'explicit';
  sampleMessages: string[];
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalQueueItem {
  id: string;
  generationId: string;
  conversation: Conversation;
  fan: Fan;
  generatedMessage: string;
  suggestedPrice?: number;
  reasoning: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
}

export interface LearningDataPoint {
  generationId: string;
  originalMessage: string;
  finalMessage: string;
  wasApproved: boolean;
  wasModified: boolean;
  performance: {
    replied: boolean;
    purchased: boolean;
    revenue: number;
  };
  feedback: string;
}
```

**Why Second**: Types needed before implementing business logic

---

#### 1.3 Anthropic Client Setup
**Priority**: HIGHEST

**File**: `/src/lib/ai/anthropic-client.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateMessage(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<{ message: string; tokensUsed: number }> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: options?.maxTokens || 1024,
      temperature: options?.temperature || 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const message = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return {
      message,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    };
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error('Failed to generate message');
  }
}

export async function analyzeMessage(
  message: string,
  context: string
): Promise<{ isSafe: boolean; reasoning: string }> {
  // Content safety check using Claude
  const systemPrompt = `You are a content safety analyzer. Analyze messages for compliance with OnlyFans terms of service. Allow adult content but flag illegal or harmful content.`;

  const userPrompt = `Analyze this message for safety:\n\n${message}\n\nContext: ${context}`;

  const response = await generateMessage(systemPrompt, userPrompt, {
    maxTokens: 512,
    temperature: 0.3,
  });

  // Parse Claude's response
  const isSafe = !response.message.toLowerCase().includes('unsafe');

  return {
    isSafe,
    reasoning: response.message,
  };
}
```

**Dependencies**: Anthropic SDK installed

---

#### 1.4 Message Generation Engine
**Priority**: HIGH

**File**: `/src/lib/ai/message-generator.ts`

```typescript
import { generateMessage } from './anthropic-client';
import { CreatorPersonality, AIGenerationRequest, AIGenerationResponse } from '@/types/ai.types';
import { getCreatorPersonality } from './personality-engine';
import { analyzeContentSafety } from './content-filter';

export async function generateChatMessage(
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  // 1. Get creator personality
  const personality = await getCreatorPersonality(request.creatorId);

  // 2. Build system prompt
  const systemPrompt = buildSystemPrompt(personality, request);

  // 3. Build user prompt with context
  const userPrompt = buildUserPrompt(request);

  // 4. Generate with Claude
  const { message, tokensUsed } = await generateMessage(systemPrompt, userPrompt, {
    maxTokens: 512,
    temperature: 0.8,
  });

  // 5. Safety check
  const safetyCheck = await analyzeContentSafety(message, request);

  // 6. Determine if needs approval
  const requiresApproval = determineApprovalRequired(request, message);

  // 7. Return response
  return {
    id: crypto.randomUUID(),
    message: safetyCheck.isSafe ? message : '[Content filtered - regenerate]',
    confidence: calculateConfidence(request),
    reasoning: `Generated ${request.generationType} for ${request.context.fanTier} tier fan (LTV: $${request.context.fanLifetimeValue})`,
    suggestedPrice: request.constraints?.targetPrice,
    requiresApproval,
    metadata: {
      modelVersion: 'claude-3-5-sonnet-20241022',
      tokensUsed,
      generatedAt: new Date(),
    },
  };
}

function buildSystemPrompt(personality: CreatorPersonality, request: AIGenerationRequest): string {
  return `${personality.systemPrompt}

**Personality Traits:**
${personality.toneDescriptors.map(t => `- ${t}`).join('\n')}

**Communication Style:**
- Emoji usage: ${personality.emojiStyle}
- NSFW comfort: ${personality.nsfwComfortLevel}

**Sample Messages:**
${personality.sampleMessages.map((s, i) => `${i + 1}. "${s}"`).join('\n')}

**Forbidden Words:** ${personality.forbiddenWords.join(', ')}
**Preferred Phrases:** ${personality.preferredPhrases.join(', ')}

**Your Task:** Generate a ${request.generationType} message that matches this personality exactly.
`;
}

function buildUserPrompt(request: AIGenerationRequest): string {
  const recentMessages = request.context.recentMessages
    .slice(-5)
    .map(m => `${m.sentBy}: ${m.content}`)
    .join('\n');

  return `**Fan Context:**
- Tier: ${request.context.fanTier}
- Lifetime Value: $${request.context.fanLifetimeValue}
- Engagement: ${request.context.fanEngagement}%
- Last Purchase: ${request.context.lastPurchase || 'Never'}

**Recent Conversation:**
${recentMessages}

**Generate:** A ${request.generationType} message ${request.constraints?.targetPrice ? `offering content for $${request.constraints.targetPrice}` : ''}.

**Requirements:**
${request.constraints?.maxLength ? `- Max ${request.constraints.maxLength} characters` : '- Keep it concise (under 300 chars)'}
- Match the creator's personality exactly
- Be natural and conversational
- ${request.generationType === 'ppv_offer' ? 'Include subtle upsell without being pushy' : 'Focus on engagement'}

**Output only the message text, nothing else.**`;
}

function determineApprovalRequired(request: AIGenerationRequest, message: string): boolean {
  // Auto-send simple replies
  if (request.generationType === 'reply' && request.context.fanTier === 'low') {
    return false;
  }

  // Require approval for high-value offers
  if (request.constraints?.targetPrice && request.constraints.targetPrice > 50) {
    return true;
  }

  // Require approval for whale/high tier PPV
  if (request.generationType === 'ppv_offer' && ['whale', 'high'].includes(request.context.fanTier)) {
    return true;
  }

  return false;
}

function calculateConfidence(request: AIGenerationRequest): number {
  let confidence = 70;

  // Higher confidence for whales (more data)
  if (request.context.fanTier === 'whale') confidence += 15;
  if (request.context.fanTier === 'high') confidence += 10;

  // Higher confidence with more message history
  if (request.context.recentMessages.length >= 10) confidence += 10;

  // Lower confidence for first-time interactions
  if (request.context.recentMessages.length < 3) confidence -= 20;

  return Math.min(95, Math.max(30, confidence));
}
```

**Dependencies**: anthropic-client.ts, personality-engine.ts, content-filter.ts

---

### 📊 PHASE 2: Message Generation Engine (Week 2)

#### 2.1 Personality Engine
**File**: `/src/lib/ai/personality-engine.ts`

```typescript
import { CreatorPersonality } from '@/types/ai.types';
import { createClient } from '@/lib/supabase/server';

export async function getCreatorPersonality(creatorId: string): Promise<CreatorPersonality> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('ai_creator_personalities')
    .select('*')
    .eq('creator_id', creatorId)
    .single();

  if (error || !data) {
    return getDefaultPersonality(creatorId);
  }

  return {
    id: data.id,
    creatorId: data.creator_id,
    personalityType: data.personality_type,
    toneDescriptors: data.tone_descriptors,
    forbiddenWords: data.forbidden_words || [],
    preferredPhrases: data.preferred_phrases || [],
    emojiStyle: data.emoji_style,
    nsfwComfortLevel: data.nsfw_comfort_level,
    sampleMessages: data.sample_messages || [],
    systemPrompt: data.system_prompt,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function getDefaultPersonality(creatorId: string): CreatorPersonality {
  return {
    id: crypto.randomUUID(),
    creatorId,
    personalityType: 'friendly',
    toneDescriptors: ['warm', 'engaging', 'fun', 'appreciative'],
    forbiddenWords: [],
    preferredPhrases: ['hey babe', 'thanks for your support', 'hope you enjoy'],
    emojiStyle: 'moderate',
    nsfwComfortLevel: 'moderate',
    sampleMessages: [
      "Hey babe! How's your day going? 💕",
      "Thanks so much for your support! Want to see something special? 😘",
      "Just posted something you might like... interested? 🔥",
    ],
    systemPrompt: `You are a friendly, engaging OnlyFans creator. You communicate warmly with your fans, appreciate their support, and occasionally make tasteful offers for exclusive content. Keep messages natural, conversational, and authentic.`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function savePersonality(personality: Omit<CreatorPersonality, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreatorPersonality> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('ai_creator_personalities')
    .upsert({
      creator_id: personality.creatorId,
      personality_type: personality.personalityType,
      tone_descriptors: personality.toneDescriptors,
      forbidden_words: personality.forbiddenWords,
      preferred_phrases: personality.preferredPhrases,
      emoji_style: personality.emojiStyle,
      nsfw_comfort_level: personality.nsfwComfortLevel,
      sample_messages: personality.sampleMessages,
      system_prompt: personality.systemPrompt,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return getCreatorPersonality(personality.creatorId);
}
```

---

#### 2.2 Content Filter
**File**: `/src/lib/ai/content-filter.ts`

```typescript
import { AIGenerationRequest } from '@/types/ai.types';

const FORBIDDEN_TERMS = [
  // Add terms that violate OF TOS
  'minor',
  'child',
  'under 18',
  // etc
];

const FLAGGED_PATTERNS = [
  /\b(meet|meetup|in person)\b/i,
  /\b(real name|address|phone)\b/i,
  // etc
];

export async function analyzeContentSafety(
  message: string,
  request: AIGenerationRequest
): Promise<{ isSafe: boolean; reasoning: string; flags: string[] }> {
  const flags: string[] = [];

  // Check forbidden terms
  for (const term of FORBIDDEN_TERMS) {
    if (message.toLowerCase().includes(term)) {
      flags.push(`Contains forbidden term: ${term}`);
    }
  }

  // Check patterns
  for (const pattern of FLAGGED_PATTERNS) {
    if (pattern.test(message)) {
      flags.push(`Matched restricted pattern: ${pattern.source}`);
    }
  }

  // Check for personal info requests
  if (containsPersonalInfoRequest(message)) {
    flags.push('Contains potential personal information request');
  }

  const isSafe = flags.length === 0;

  return {
    isSafe,
    reasoning: isSafe
      ? 'Message passes all safety checks'
      : `Message flagged: ${flags.join(', ')}`,
    flags,
  };
}

function containsPersonalInfoRequest(message: string): boolean {
  const personalInfoKeywords = ['real name', 'address', 'phone number', 'where do you live'];
  return personalInfoKeywords.some(keyword =>
    message.toLowerCase().includes(keyword)
  );
}

export function sanitizeInput(input: string): string {
  // Remove potentially harmful injection attempts
  return input
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}
```

---

### 🔐 PHASE 3: Approval & Learning System (Week 3)

#### 3.1 Approval Logic
**File**: `/src/lib/ai/approval-logic.ts`

```typescript
import { ApprovalQueueItem, AIGenerationResponse } from '@/types/ai.types';
import { createClient } from '@/lib/supabase/server';

export async function queueForApproval(
  generation: AIGenerationResponse,
  conversationId: string,
  chatterId: string
): Promise<void> {
  const supabase = createClient();

  await supabase.from('ai_message_generations').insert({
    id: generation.id,
    conversation_id: conversationId,
    chatter_id: chatterId,
    generated_message: generation.message,
    confidence_score: generation.confidence,
    generation_metadata: generation.metadata,
    status: generation.requiresApproval ? 'queued' : 'auto_sent',
    created_at: new Date().toISOString(),
  });
}

export async function getApprovalQueue(chatterId?: string): Promise<ApprovalQueueItem[]> {
  const supabase = createClient();

  let query = supabase
    .from('ai_message_generations')
    .select(`
      *,
      conversations(*),
      fans(*)
    `)
    .eq('status', 'queued')
    .order('created_at', { ascending: false });

  if (chatterId) {
    query = query.eq('chatter_id', chatterId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    generationId: item.id,
    conversation: item.conversations,
    fan: item.fans,
    generatedMessage: item.generated_message,
    suggestedPrice: item.generation_metadata?.suggestedPrice,
    reasoning: item.generation_metadata?.reasoning,
    confidence: item.confidence_score,
    priority: determinePriority(item),
    createdAt: new Date(item.created_at),
  }));
}

export async function approveMessage(
  generationId: string,
  approverId: string,
  modifications?: string
): Promise<void> {
  const supabase = createClient();

  const finalMessage = modifications || await getGeneratedMessage(generationId);

  await supabase
    .from('ai_message_generations')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: approverId,
    })
    .eq('id', generationId);

  // Record feedback
  await supabase
    .from('ai_message_feedback')
    .insert({
      generation_id: generationId,
      feedback_type: modifications ? 'modified' : 'approved',
      original_message: await getGeneratedMessage(generationId),
      final_message: finalMessage,
      modification_notes: modifications ? 'Modified by chatter' : null,
    });
}

async function getGeneratedMessage(generationId: string): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase
    .from('ai_message_generations')
    .select('generated_message')
    .eq('id', generationId)
    .single();
  return data?.generated_message || '';
}

function determinePriority(item: any): 'low' | 'medium' | 'high' | 'urgent' {
  const fanTier = item.fans?.tier;
  const suggestedPrice = item.generation_metadata?.suggestedPrice;

  if (fanTier === 'whale') return 'urgent';
  if (suggestedPrice && suggestedPrice > 100) return 'urgent';
  if (fanTier === 'high') return 'high';
  if (suggestedPrice && suggestedPrice > 50) return 'high';
  return 'medium';
}
```

---

### 🎨 PHASE 4: UI Components (Week 3-4)

#### 4.1 AI Chat Interface Enhancement
**File**: Update existing `/src/components/chat/ai-suggestion-panel.tsx`

Add button: "Generate AI Response" that calls API

#### 4.2 Approval Dashboard
**File**: `/src/components/ai/approval-queue.tsx`

Shows queued messages requiring approval with:
- Fan context
- Generated message
- Edit capability
- Approve/Reject buttons

#### 4.3 Template Manager
**File**: `/src/components/ai/template-manager.tsx`

Manage message templates:
- Create/edit templates
- Performance metrics
- A/B test setup

---

### 🚀 PHASE 5: API Routes (Week 4)

#### 5.1 Generation Endpoint
**File**: `/src/app/api/ai/generate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateChatMessage } from '@/lib/ai/message-generator';
import { queueForApproval } from '@/lib/ai/approval-logic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate message
    const generation = await generateChatMessage(body);

    // Queue for approval if needed
    if (generation.requiresApproval) {
      await queueForApproval(generation, body.conversationId, body.chatterId);
    }

    return NextResponse.json(generation);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
}
```

#### 5.2 Approval Endpoint
**File**: `/src/app/api/ai/approve/route.ts`

Handle approval/rejection of queued messages

---

### 🧪 PHASE 6: Testing & Safety (Week 5)

#### 6.1 Integration Tests
- Test message generation with various inputs
- Test approval flow
- Test content filtering

#### 6.2 Safety Validation
- NSFW content handling
- Compliance checks
- Rate limiting

---

## Implementation Order (Optimal Path)

### Week 1: Foundation
```
Day 1-2: Database schema + migrations
Day 3-4: Type system + Anthropic client
Day 5-7: Message generator core
```

### Week 2: Engine
```
Day 1-2: Personality engine
Day 3-4: Content filter
Day 5-7: Testing core generation
```

### Week 3: Approval System
```
Day 1-3: Approval logic
Day 4-7: Approval UI components
```

### Week 4: API & Polish
```
Day 1-2: API routes
Day 3-5: UI integration
Day 6-7: Testing
```

### Week 5: Launch Prep
```
Day 1-3: Safety validation
Day 4-5: Performance testing
Day 6-7: Documentation + handoff
```

---

## Dependencies Map

```
Phase 0 (Foundation)
  └─> Phase 1 (Core AI)
      ├─> 1.1 Database Schema [BLOCKER for all]
      │   └─> 1.2 Type System
      │       └─> 1.3 Anthropic Client
      │           └─> 1.4 Message Generator
      │               ├─> Phase 2 (Engine)
      │               └─> Phase 3 (Approval)
      └─> Phase 4 (UI) [Can start after Phase 1.2]
      └─> Phase 5 (API) [Needs Phase 1.4 + Phase 3]
      └─> Phase 6 (Testing) [Final phase]
```

---

## Code Protection Checklist

### DO NOT MODIFY:
- ✅ `/src/types/index.ts` - Only extend, never change existing types
- ✅ `/src/lib/mock-data.ts` - Keep existing data intact
- ✅ `/src/components/chat/ai-suggestion-panel.tsx` - Enhance, don't replace
- ✅ `/src/app/(dashboard)/chat/page.tsx` - Add features, don't refactor
- ✅ Database tables: `fans`, `chatters`, `creators`, `conversations` - Don't modify schemas

### SAFE TO CREATE (New Files):
- ✅ `/src/lib/ai/*` - All new
- ✅ `/src/app/api/ai/*` - All new
- ✅ `/src/components/ai/*` - All new
- ✅ `/src/types/ai.types.ts` - New namespace
- ✅ New database tables with `ai_` prefix

---

## Environment Variables Needed

```bash
# Add to .env.local
ANTHROPIC_API_KEY=sk-ant-xxx

# Feature flags
NEXT_PUBLIC_ENABLE_AI_CHAT=false  # Start disabled
NEXT_PUBLIC_AI_AUTO_SEND_THRESHOLD=20  # Min confidence for auto-send
NEXT_PUBLIC_AI_PPV_APPROVAL_THRESHOLD=50  # Min $ for approval

# Rate limiting
AI_RATE_LIMIT_PER_HOUR=100
AI_MAX_TOKENS_PER_DAY=100000
```

---

## Success Metrics

### Phase 1 Complete When:
- [ ] Database schema deployed
- [ ] Types compile without errors
- [ ] Anthropic client generates test message
- [ ] Message generator returns valid response

### Phase 2 Complete When:
- [ ] Personality engine loads creator profiles
- [ ] Content filter blocks unsafe content
- [ ] End-to-end generation works

### Phase 3 Complete When:
- [ ] Messages queue for approval correctly
- [ ] Approval/rejection persists to DB
- [ ] Learning feedback records created

### Full System Complete When:
- [ ] Chatter can generate AI message from UI
- [ ] High-value messages queue for approval
- [ ] Low-value messages auto-send
- [ ] A/B tests track results
- [ ] Analytics dashboard shows performance
- [ ] Zero errors in production for 48 hours

---

## Potential Blockers & Solutions

| Blocker | Solution |
|---------|----------|
| Anthropic API key not working | Test with sample key first, verify billing |
| Database migrations fail | Run on staging first, have rollback plan |
| Content filter too aggressive | Tune thresholds, add override for creators |
| Performance slow | Cache personalities, batch requests, add indexes |
| Existing code breaks | Feature flag system, gradual rollout |
| NSFW content rejected | Adjust system prompts, use explicit examples |

---

## Cost Estimates

### Anthropic API Costs:
- Claude 3.5 Sonnet: $3/M input tokens, $15/M output tokens
- Avg message generation: ~1K input + 500 output = $0.0105 per message
- 1000 messages/day = $10.50/day = $315/month
- With caching: ~$200/month

### Database Costs:
- Supabase: Included in existing plan (< 500MB for AI tables)

### Total Estimated: $200-400/month

---

## Rollout Strategy

### Stage 1: Internal Testing (Week 5)
- Enable for 1 creator only
- Manual approval for all messages
- Monitor for 7 days

### Stage 2: Limited Beta (Week 6)
- Enable for all creators
- Auto-send only low-value replies
- Approval required for PPV

### Stage 3: Full Launch (Week 7+)
- Auto-send based on confidence
- A/B testing enabled
- Analytics live

---

## Questions & Clarifications Needed

### From You (Before Starting):

1. **Anthropic API Access**: Do you have an API key ready? Need to verify billing?

2. **Database Access**: Do you have Supabase admin access to run migrations?

3. **NSFW Comfort Level**: What's the acceptable range for content? Do you have example messages?

4. **Auto-Send Thresholds**:
   - What $ amount should trigger approval? (Suggested: $50+)
   - What confidence % should auto-send? (Suggested: 80%+)

5. **Creator Personalities**: Do you have 3-5 sample messages per creator to train on?

6. **Priority**: Should we build this in 5 weeks (complete) or 2 weeks (MVP only)?

---

## MVP vs Full Build

### 2-Week MVP (If Urgent):
- ✅ Phase 1.1-1.4 only (Core generation)
- ✅ Simple approval UI
- ✅ Basic API route
- ❌ Skip A/B testing
- ❌ Skip learning system
- ❌ Skip analytics dashboard

### 5-Week Full Build (Recommended):
- ✅ All 6 phases
- ✅ Production-ready
- ✅ Comprehensive safety
- ✅ Learning from feedback
- ✅ A/B testing
- ✅ Analytics

**My Recommendation**: 5-week full build. The safety and learning systems are critical for OnlyFans content.

---

## Next Steps

### Immediate (You Decide):
1. ✅ Review this battle plan
2. ✅ Approve approach or request changes
3. ✅ Provide Anthropic API key
4. ✅ Answer clarification questions
5. ✅ Confirm timeline (2-week MVP or 5-week full)

### Then I Will:
1. Install Anthropic SDK
2. Create database migration file
3. Set up AI types
4. Build Anthropic client
5. Ship Phase 1 in 3-5 days

---

## Risk Mitigation Summary

✅ **No Breaking Changes**: All new code in separate namespaces
✅ **Feature Flagged**: Can disable instantly if issues
✅ **Database Safe**: New tables only, existing schemas untouched
✅ **Cost Controlled**: Rate limits + monitoring
✅ **Content Safe**: Multi-layer filtering
✅ **Production Ready**: Comprehensive error handling
✅ **Extensible**: Clean architecture for future features

---

**Ready to proceed? Let me know your answers to the clarification questions and I'll start building immediately.**
