# AI Chatting System - Architecture Diagram

**Visual Overview of System Components**

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         VAULTCRM AI CHATTING SYSTEM                      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  Chat Interface  │  │ Approval Queue   │  │ Template Manager │      │
│  │  (Existing + AI) │  │   Dashboard      │  │   (Optional)     │      │
│  │                  │  │                  │  │                  │      │
│  │ • Message list   │  │ • Pending queue  │  │ • Create/edit    │      │
│  │ • AI suggestions │  │ • Approve/reject │  │ • Performance    │      │
│  │ • Generate btn   │  │ • Edit messages  │  │ • A/B tests      │      │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘      │
│           │                     │                      │                 │
└───────────┼─────────────────────┼──────────────────────┼─────────────────┘
            │                     │                      │
            ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                               API LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  /api/ai/generate (POST)                                           │ │
│  │  • Receives: conversationId, fanId, creatorId, generationType     │ │
│  │  • Returns: Generated message, confidence, approval needed         │ │
│  └────────────────────────┬───────────────────────────────────────────┘ │
│                            │                                              │
│  ┌────────────────────────┴───────────────────────────────────────────┐ │
│  │  /api/ai/approve (POST)                                            │ │
│  │  • Receives: generationId, action (approve/reject), modifications │ │
│  │  • Returns: Success status, updated record                        │ │
│  └────────────────────────┬───────────────────────────────────────────┘ │
│                            │                                              │
│  ┌────────────────────────┴───────────────────────────────────────────┐ │
│  │  /api/ai/personality (GET/POST)                                    │ │
│  │  • Receives: creatorId, personality data                           │ │
│  │  • Returns: Creator personality profile                            │ │
│  └────────────────────────┬───────────────────────────────────────────┘ │
│                            │                                              │
└────────────────────────────┼──────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BUSINESS LOGIC LAYER                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │  Message Generator (message-generator.ts)                   │        │
│  │  ┌───────────────────────────────────────────────────────┐ │        │
│  │  │ 1. Load Creator Personality                           │ │        │
│  │  │ 2. Build System Prompt                                │ │        │
│  │  │ 3. Build User Prompt with Context                     │ │        │
│  │  │ 4. Call Anthropic Claude API                          │ │        │
│  │  │ 5. Run Content Safety Check                           │ │        │
│  │  │ 6. Determine Approval Required                        │ │        │
│  │  │ 7. Calculate Confidence Score                         │ │        │
│  │  │ 8. Return Generation Response                         │ │        │
│  │  └───────────────────────────────────────────────────────┘ │        │
│  └───────────────┬─────────────────────┬───────────────────────┘        │
│                  │                     │                                 │
│                  ▼                     ▼                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │ Personality Engine   │  │  Content Filter      │                    │
│  │                      │  │                      │                    │
│  │ • Load from DB       │  │ • Check forbidden    │                    │
│  │ • Default fallback   │  │ • Pattern matching   │                    │
│  │ • Cache profiles     │  │ • Personal info      │                    │
│  │ • Update from learn  │  │ • Safety scoring     │                    │
│  └──────────┬───────────┘  └──────────┬───────────┘                    │
│             │                          │                                 │
│             ▼                          ▼                                 │
│  ┌────────────────────────────────────────────┐                         │
│  │  Approval Logic (approval-logic.ts)        │                         │
│  │  ┌──────────────────────────────────────┐ │                         │
│  │  │ • Queue high-value messages          │ │                         │
│  │  │ • Auto-send simple replies           │ │                         │
│  │  │ • Priority determination             │ │                         │
│  │  │ • Record approvals/rejections        │ │                         │
│  │  └──────────────────────────────────────┘ │                         │
│  └────────────────────┬───────────────────────┘                         │
│                       │                                                  │
└───────────────────────┼──────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌───────────────────────────────────────────────────────────┐          │
│  │  Anthropic Claude API (anthropic-client.ts)               │          │
│  │  ┌─────────────────────────────────────────────────────┐ │          │
│  │  │ Model: claude-3-5-sonnet-20241022                   │ │          │
│  │  │ • generateMessage(system, user, options)            │ │          │
│  │  │ • analyzeMessage(message, context)                  │ │          │
│  │  │ • Temperature: 0.7-0.8 for variety                  │ │          │
│  │  │ • Max tokens: 512-1024 per message                  │ │          │
│  │  └─────────────────────────────────────────────────────┘ │          │
│  └───────────────────────────────────────────────────────────┘          │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                        Supabase PostgreSQL                               │
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │ ai_message_          │  │ ai_creator_          │                    │
│  │ generations          │  │ personalities        │                    │
│  │                      │  │                      │                    │
│  │ • id                 │  │ • id                 │                    │
│  │ • conversation_id    │  │ • creator_id         │                    │
│  │ • fan_id             │  │ • personality_type   │                    │
│  │ • creator_id         │  │ • tone_descriptors   │                    │
│  │ • generated_message  │  │ • forbidden_words    │                    │
│  │ • confidence_score   │  │ • preferred_phrases  │                    │
│  │ • status             │  │ • emoji_style        │                    │
│  │ • created_at         │  │ • system_prompt      │                    │
│  └──────────────────────┘  └──────────────────────┘                    │
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │ ai_message_          │  │ ai_message_          │                    │
│  │ templates            │  │ feedback             │                    │
│  │                      │  │                      │                    │
│  │ • id                 │  │ • id                 │                    │
│  │ • creator_id         │  │ • generation_id      │                    │
│  │ • category           │  │ • feedback_type      │                    │
│  │ • template_text      │  │ • original_message   │                    │
│  │ • performance_stats  │  │ • final_message      │                    │
│  │ • usage_count        │  │ • performance_data   │                    │
│  └──────────────────────┘  └──────────────────────┘                    │
│                                                                           │
│  ┌──────────────────────┐                                               │
│  │ ai_ab_tests          │                                               │
│  │                      │                                               │
│  │ • id                 │                                               │
│  │ • test_name          │                                               │
│  │ • creator_id         │                                               │
│  │ • variant_a/b        │                                               │
│  │ • results            │                                               │
│  └──────────────────────┘                                               │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Flow 1: AI Message Generation

```
┌──────────┐
│ Chatter  │
│ clicks   │
│"Generate"│
└────┬─────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 1. Frontend sends POST to /api/ai/generate     │
│    {                                           │
│      conversationId: "conv_123",               │
│      fanId: "fan_456",                         │
│      creatorId: "creator_789",                 │
│      chatterId: "chatter_1",                   │
│      generationType: "ppv_offer"               │
│    }                                           │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 2. API loads context:                          │
│    • Recent messages (last 10)                 │
│    • Fan tier & LTV                            │
│    • Creator personality                       │
│    • Fan engagement score                      │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 3. Message Generator builds prompts:           │
│    • System: Creator personality + rules       │
│    • User: Fan context + recent messages       │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 4. Call Anthropic API:                         │
│    claude-3-5-sonnet-20241022                  │
│    Temperature: 0.7-0.8                        │
│    Max tokens: 512                             │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 5. Content Filter checks:                      │
│    • Forbidden terms                           │
│    • Personal info requests                    │
│    • Pattern matching                          │
│    ┌────────────────┐                          │
│    │ Safe? Yes/No   │                          │
│    └────┬───────────┘                          │
└─────────┼──────────────────────────────────────┘
          │
          ▼
     ┌────────┐
     │  Safe? │
     └─┬────┬─┘
  Yes  │    │  No
       │    │
       │    └──────> Reject & Log
       │
       ▼
┌────────────────────────────────────────────────┐
│ 6. Determine approval required:                │
│    • High-value offer ($50+)?      → Approve   │
│    • Whale/High tier PPV?          → Approve   │
│    • Simple reply to low tier?     → Auto-send │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 7. Save to database:                           │
│    INSERT INTO ai_message_generations          │
│    status: 'queued' or 'auto_sent'             │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 8. Return to frontend:                         │
│    {                                           │
│      message: "Generated text...",             │
│      confidence: 85,                           │
│      requiresApproval: true,                   │
│      suggestedPrice: 75                        │
│    }                                           │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌──────────────────┐
│ Display to       │
│ chatter:         │
│ • Show message   │
│ • Show confidence│
│ • If approval:   │
│   route to queue │
│ • If auto: send  │
└──────────────────┘
```

---

### Flow 2: Message Approval

```
┌──────────┐
│ Chatter  │
│ opens    │
│ Approval │
│ Queue    │
└────┬─────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 1. Load approval queue:                        │
│    GET ai_message_generations                  │
│    WHERE status = 'queued'                     │
│    ORDER BY priority DESC, created_at ASC      │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 2. Display queued messages:                    │
│    For each message show:                      │
│    • Generated text                            │
│    • Fan context (tier, LTV)                   │
│    • Conversation history                      │
│    • Confidence score                          │
│    • Reasoning                                 │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 3. Chatter decides:                            │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│    │ Approve  │  │ Modify   │  │ Reject   │   │
│    └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└─────────┼─────────────┼─────────────┼──────────┘
          │             │             │
          ▼             ▼             ▼
┌─────────────┐  ┌────────────┐  ┌─────────┐
│ POST        │  │ POST       │  │ POST    │
│ /api/ai/    │  │ /api/ai/   │  │ /api/ai/│
│ approve     │  │ approve    │  │ approve │
│             │  │            │  │         │
│ action:     │  │ action:    │  │ action: │
│ "approve"   │  │ "modify"   │  │ "reject"│
│             │  │ modified:  │  │         │
│             │  │ "new text" │  │ reason: │
└─────┬───────┘  └─────┬──────┘  └────┬────┘
      │                │               │
      ▼                ▼               ▼
┌────────────────────────────────────────────────┐
│ 4. Update database:                            │
│    UPDATE ai_message_generations               │
│    SET status = 'approved'/'rejected'          │
│        approved_at = NOW()                     │
│        approved_by = chatter_id                │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 5. Record feedback:                            │
│    INSERT INTO ai_message_feedback             │
│    • Original message                          │
│    • Final message (if modified)               │
│    • Feedback type                             │
│    • Modification notes                        │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ 6. Send message (if approved):                 │
│    • Post to conversation                      │
│    • Update conversation state                 │
│    • Track performance                         │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌──────────────────┐
│ Update UI:       │
│ • Remove from    │
│   queue          │
│ • Show success   │
│ • Load next msg  │
└──────────────────┘
```

---

### Flow 3: Learning from Feedback

```
┌────────────────────────────────────────────────┐
│ Message sent (approved or auto-sent)           │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ Track performance over time:                   │
│ • Did fan reply? (engagement)                  │
│ • Did fan purchase? (conversion)               │
│ • Revenue generated                            │
│ • Time to reply                                │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ Update ai_message_feedback:                    │
│ SET performance_data = {                       │
│   replied: true,                               │
│   purchased: true,                             │
│   revenue: 75,                                 │
│   timeToReply: 120 // seconds                  │
│ }                                              │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ Analyze patterns (weekly batch job):           │
│ • Which personality traits worked best?        │
│ • Which phrases got best response?             │
│ • Which offer types converted?                 │
│ • Which fan tiers responded to what?           │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────┐
│ Update creator personality:                    │
│ • Add successful phrases to preferred          │
│ • Remove unsuccessful patterns                 │
│ • Adjust tone descriptors                      │
│ • Update system prompt                         │
└────┬───────────────────────────────────────────┘
     │
     ▼
┌──────────────────┐
│ Continuous       │
│ improvement      │
│ loop:            │
│ Better messages  │
│ over time        │
└──────────────────┘
```

---

## Component Dependencies

```
anthropic-client.ts
       ↑
       │ imports
       │
message-generator.ts ─────> personality-engine.ts
       ↑                           ↑
       │                           │
       │                    ┌──────┴──────┐
       │                    │             │
       ├──────────> content-filter.ts    │
       │                                  │
       │                                  │
   API Routes                       Database
   (generate)                       (Supabase)
       ↑                                  ↑
       │                                  │
       │                                  │
   Frontend                         approval-logic.ts
   Components                             ↑
   (chat interface)                       │
                                          │
                                     API Routes
                                     (approve)
                                          ↑
                                          │
                                     Frontend
                                     (approval queue)
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Input Validation                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Sanitize all user inputs                             │ │
│  │ • Validate request schemas                             │ │
│  │ • Check authentication tokens                          │ │
│  │ • Verify user permissions                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                   │
│  Layer 2: Content Filtering                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Check forbidden terms                                │ │
│  │ • Pattern matching for violations                      │ │
│  │ • Personal info detection                              │ │
│  │ • NSFW compliance check                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                   │
│  Layer 3: Human Approval                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • High-value messages queued                           │ │
│  │ • Whale/high tier requires approval                    │ │
│  │ • Chatter can edit before sending                      │ │
│  │ • Rejection feedback recorded                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                   │
│  Layer 4: Rate Limiting                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Max requests per hour per user                       │ │
│  │ • Max tokens per day global                            │ │
│  │ • Cost monitoring & alerts                             │ │
│  │ • Automatic throttling                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                   │
│  Layer 5: Audit Logging                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • All generations logged                               │ │
│  │ • All approvals/rejections logged                      │ │
│  │ • Performance tracked                                  │ │
│  │ • Compliance audit trail                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION DEPLOYMENT                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Vercel (Next.js App)                                │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │ Frontend (React Components)                    │ │   │
│  │  │ • Chat interface                               │ │   │
│  │  │ • Approval dashboard                           │ │   │
│  │  │ • Template manager                             │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │ API Routes (Serverless Functions)             │ │   │
│  │  │ • /api/ai/generate                             │ │   │
│  │  │ • /api/ai/approve                              │ │   │
│  │  │ • /api/ai/personality                          │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │ Business Logic                                 │ │   │
│  │  │ • Message generator                            │ │   │
│  │  │ • Personality engine                           │ │   │
│  │  │ • Content filter                               │ │   │
│  │  │ • Approval logic                               │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│                     ├────────────────────────────┐           │
│                     ▼                            ▼           │
│  ┌─────────────────────────────┐  ┌──────────────────────┐ │
│  │  Anthropic API              │  │  Supabase            │ │
│  │  (External Service)         │  │  (Database + Auth)   │ │
│  │  • Claude 3.5 Sonnet        │  │  • PostgreSQL        │ │
│  │  • Message generation       │  │  • AI tables         │ │
│  │  • Content analysis         │  │  • Real-time         │ │
│  └─────────────────────────────┘  └──────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Environment Variables:
• ANTHROPIC_API_KEY (Vercel secret)
• NEXT_PUBLIC_SUPABASE_URL
• NEXT_PUBLIC_SUPABASE_ANON_KEY
• NEXT_PUBLIC_ENABLE_AI_CHAT (feature flag)
```

---

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                    MONITORING STACK                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Application Metrics (Vercel Analytics)                │ │
│  │  • Request latency                                     │ │
│  │  • Error rate                                          │ │
│  │  • API endpoint performance                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AI-Specific Metrics (Custom Dashboard)                │ │
│  │  • Messages generated per hour                         │ │
│  │  • Approval rate                                       │ │
│  │  • Modification rate                                   │ │
│  │  • Auto-send rate                                      │ │
│  │  • Average confidence score                            │ │
│  │  • Content filter hits                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Cost Tracking (Anthropic + Database)                  │ │
│  │  • API calls per day                                   │ │
│  │  • Tokens consumed                                     │ │
│  │  • $ spent on AI                                       │ │
│  │  • Database storage growth                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Business Metrics (Revenue Impact)                     │ │
│  │  • Revenue per AI message                              │ │
│  │  • Conversion rate (AI vs manual)                      │ │
│  │  • Time saved per chatter                              │ │
│  │  • Fan engagement increase                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Alert Triggers:
• API error rate > 5%
• Daily cost > $100
• Content filter rate > 20%
• Average latency > 5s
• Database connection errors
```

---

## Feature Flag System

```
┌─────────────────────────────────────────────────────────────┐
│                      FEATURE FLAGS                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Global Enable/Disable                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ NEXT_PUBLIC_ENABLE_AI_CHAT                             │ │
│  │ • true: AI features visible                            │ │
│  │ • false: AI features hidden (graceful degradation)     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Auto-Send Control                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ NEXT_PUBLIC_AI_AUTO_SEND_THRESHOLD                     │ │
│  │ • Minimum confidence % to auto-send                    │ │
│  │ • Default: 80                                          │ │
│  │ • Range: 0-100                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Approval Threshold                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ NEXT_PUBLIC_AI_PPV_APPROVAL_THRESHOLD                  │ │
│  │ • Minimum $ amount to require approval                 │ │
│  │ • Default: 50                                          │ │
│  │ • PPV offers >= this amount need human review          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Rate Limiting                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ AI_RATE_LIMIT_PER_HOUR                                 │ │
│  │ • Max API calls per user per hour                      │ │
│  │ • Default: 100                                         │ │
│  │ • Prevents abuse                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Cost Control                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ AI_MAX_TOKENS_PER_DAY                                  │ │
│  │ • Global daily token limit                             │ │
│  │ • Default: 100,000                                     │ │
│  │ • Prevents runaway costs                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Gradual Rollout Strategy:
1. Week 1: Enable for 1 creator (internal testing)
2. Week 2: Enable for all creators, manual approval only
3. Week 3: Enable auto-send for low-value messages
4. Week 4+: Full auto-send based on confidence
```

---

**This architecture ensures:**
- ✅ Clean separation of concerns
- ✅ Scalable design
- ✅ Comprehensive safety
- ✅ Easy monitoring
- ✅ Gradual rollout capability
- ✅ Cost control
- ✅ Production-ready from day 1
