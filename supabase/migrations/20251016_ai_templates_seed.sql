-- VaultCRM AI Chatter System - Seed Templates
-- Migration: 20251016_ai_templates_seed
-- Description: Pre-built message templates based on OnlyFans best practices research
-- Author: Claude Code
-- Date: 2025-10-16
-- Source: CHATTER_RESEARCH_FINDINGS.md

-- =============================================================================
-- GREETING TEMPLATES
-- =============================================================================

INSERT INTO ai_templates (name, category, template_text, variables, target_tiers, is_nsfw, metadata) VALUES

-- Whale Tier Greetings
('Greeting - Whale VIP Welcome', 'greeting',
'Hey {fanName}! 💎 I just saw you subscribed and I''m SO excited to have you here! You''re already one of my VIPs and I can''t wait to spoil you with exclusive content 😘',
ARRAY['fanName'], ARRAY['whale'], false,
'{"tone": "enthusiastic", "personalization": "high"}'),

('Greeting - Whale Personal Touch', 'greeting',
'omg {fanName} 🥰 been waiting for you to join! i have some really special content i think you''re gonna love... let me show you what i''ve been working on 🔥',
ARRAY['fanName'], ARRAY['whale'], false,
'{"tone": "intimate", "personalization": "high"}'),

-- High Tier Greetings
('Greeting - High Tier Flirty', 'greeting',
'hey {fanName}! 🔥 thanks for subscribing babe, you''re gonna love it here 😈 i post exclusive content daily and love chatting with my fans... what brings you to my page? 💋',
ARRAY['fanName'], ARRAY['high'], false,
'{"tone": "flirty", "engagement": "question"}'),

('Greeting - High Tier Casual', 'greeting',
'Hey {fanName}! So glad you''re here 😘 I try to respond to all my messages personally so don''t be shy... what kind of content are you most into? 🔥',
ARRAY['fanName'], ARRAY['high'], false,
'{"tone": "casual", "engagement": "question"}'),

-- Medium/Low Tier Greetings
('Greeting - Standard Welcome', 'greeting',
'Hey {fanName}! Thanks for subscribing 😊 Make sure to check out my pinned post for all my exclusive content. DM me anytime! 💕',
ARRAY['fanName'], ARRAY['medium', 'low'], false,
'{"tone": "friendly", "effort": "low"}'),

('Greeting - Quick Welcome', 'greeting',
'thanks for subbing babe! 😘 new content dropping tonight, you''re gonna love it 🔥',
ARRAY['fanName'], ARRAY['low'], false,
'{"tone": "casual", "effort": "minimal"}');

-- =============================================================================
-- PPV OFFER TEMPLATES
-- =============================================================================

INSERT INTO ai_templates (name, category, template_text, variables, target_tiers, min_price, max_price, is_nsfw, metadata) VALUES

-- Whale Tier PPV Offers
('PPV - Whale Custom Exclusive', 'ppv_offer',
'Hey {fanName} 💎 I just finished shooting something REALLY special that made me think of you... it''s {ppvDescription} and honestly some of my hottest work yet. It''s ${ppvPrice} but I know you appreciate quality 😈 Want me to send it over?',
ARRAY['fanName', 'ppvDescription', 'ppvPrice'], ARRAY['whale'], 50, 200, true,
'{"tone": "exclusive", "urgency": "medium", "personalization": "high"}'),

('PPV - Whale Premium Video', 'ppv_offer',
'{fanName} baby... i made this custom piece and you were the FIRST person i thought of 🥵 it''s {ppvDescription}, ${ppvPrice}. trust me, this one''s worth every penny... should i unlock it for you? 💦',
ARRAY['fanName', 'ppvDescription', 'ppvPrice'], ARRAY['whale'], 75, 250, true,
'{"tone": "intimate", "exclusivity": "high"}'),

-- High Tier PPV Offers
('PPV - High Value Tease', 'ppv_offer',
'hey babe 🔥 just dropped a new video that I think you''ll LOVE... {ppvDescription} for ${ppvPrice}. It''s one of my favorites and I''m only sending it to my best fans 😘 interested?',
ARRAY['ppvDescription', 'ppvPrice'], ARRAY['high'], 20, 100, true,
'{"tone": "flirty", "scarcity": "medium"}'),

('PPV - High Tier Direct', 'ppv_offer',
'baby i just made the hottest video 🥵 it''s {ppvDescription}... ${ppvPrice} and it''s all yours 💦 trust me you don''t wanna miss this one 😈',
ARRAY['ppvDescription', 'ppvPrice'], ARRAY['high'], 25, 75, true,
'{"tone": "direct", "confidence": "high"}'),

-- Medium Tier PPV Offers
('PPV - Medium Bundle Deal', 'ppv_offer',
'Hey! I have a special bundle for you 😘 {ppvDescription} - normally ${ppvPrice} but I''m giving you a deal today. Want it? 🔥',
ARRAY['ppvDescription', 'ppvPrice'], ARRAY['medium'], 10, 50, true,
'{"tone": "friendly", "discount_implied": true}'),

('PPV - Medium Standard Offer', 'ppv_offer',
'new content alert! 🔥 just posted {ppvDescription} for ${ppvPrice}... been getting amazing feedback on this one 😈',
ARRAY['ppvDescription', 'ppvPrice'], ARRAY['medium'], 15, 40, true,
'{"tone": "casual", "social_proof": true}'),

-- Low Tier PPV Offers
('PPV - Low Tier Budget', 'ppv_offer',
'special deal today babe! 🔥 {ppvDescription} for just ${ppvPrice}. limited time only 😘',
ARRAY['ppvDescription', 'ppvPrice'], ARRAY['low'], 5, 20, true,
'{"tone": "promotional", "urgency": "high"}');

-- =============================================================================
-- RE-ENGAGEMENT TEMPLATES
-- =============================================================================

INSERT INTO ai_templates (name, category, template_text, variables, target_tiers, is_nsfw, metadata) VALUES

-- Whale Re-engagement
('Reengagement - Whale Miss You', 'reengagement',
'{fanName}! 💎 I noticed you''ve been quiet lately and I genuinely miss chatting with you... is everything okay? I have some new exclusive content I think you''d love to see 😘',
ARRAY['fanName'], ARRAY['whale'], false,
'{"tone": "personal", "concern": "genuine", "days_inactive": 7}'),

-- High Tier Re-engagement
('Reengagement - High Tier Comeback', 'reengagement',
'hey {fanName}! haven''t heard from you in a while babe 🥺 been posting some 🔥 content lately... want me to catch you up? 😘',
ARRAY['fanName'], ARRAY['high'], false,
'{"tone": "friendly", "fomo": true, "days_inactive": 10}'),

-- Medium/Low Tier Re-engagement
('Reengagement - Standard Comeback', 'reengagement',
'hey stranger! 😊 noticed you haven''t been around... I''ve posted some great new stuff. come check it out! 💕',
ARRAY[]::text[], ARRAY['medium', 'low'], false,
'{"tone": "casual", "effort": "low", "days_inactive": 14}'),

-- Expired Subscriber Re-engagement
('Reengagement - Expired Sub Offer', 'reengagement',
'hey babe! your subscription expired but I''d love to have you back 😘 I''m running a special deal right now... interested? 🔥',
ARRAY[]::text[], ARRAY['whale', 'high', 'medium'], false,
'{"tone": "promotional", "target": "expired_sub"}');

-- =============================================================================
-- RESPONSE TEMPLATES (Conversational)
-- =============================================================================

INSERT INTO ai_templates (name, category, template_text, variables, target_tiers, is_nsfw, metadata) VALUES

-- Compliment Responses
('Response - Thank You Flirty', 'response',
'aww baby you''re making me blush 🥰 that''s so sweet of you to say 💕',
ARRAY[]::text[], ARRAY['whale', 'high', 'medium', 'low'], false,
'{"trigger": "compliment", "tone": "appreciative"}'),

('Response - Compliment Flirty', 'response',
'omg you''re too sweet 😘 comments like that make my day... and turn me on a little 😈',
ARRAY[]::text[], ARRAY['whale', 'high'], true,
'{"trigger": "compliment", "tone": "flirty", "escalation": "mild"}'),

-- Question Responses
('Response - What Do You Like', 'response',
'i love making all kinds of content 😊 solo, b/g, customs... what are you most interested in? i want to make sure you get exactly what you''re looking for 🔥',
ARRAY[]::text[], ARRAY['whale', 'high', 'medium'], true,
'{"trigger": "content_question", "engagement": "high"}'),

-- General Chat
('Response - Good Morning', 'response',
'good morning babe! 🌅 hope you slept well... i''ve been thinking about you 😘',
ARRAY[]::text[], ARRAY['whale', 'high'], false,
'{"trigger": "greeting", "tone": "intimate"}'),

('Response - How Are You', 'response',
'doing great now that i''m chatting with you 😊 how''s your day going? 💕',
ARRAY[]::text[], ARRAY['whale', 'high', 'medium'], false,
'{"trigger": "how_are_you", "engagement": true}');

-- =============================================================================
-- SEXTING TEMPLATES
-- =============================================================================

INSERT INTO ai_templates (name, category, template_text, variables, target_tiers, is_nsfw, metadata) VALUES

('Sexting - Initiation Soft', 'sexting',
'baby i can''t stop thinking about you 🥵 are you alone right now? 😈',
ARRAY[]::text[], ARRAY['whale', 'high'], true,
'{"intensity": "soft", "consent_check": true}'),

('Sexting - Tease Medium', 'sexting',
'just got out of the shower and i''m still all wet 💦 wish you were here with me... 😘',
ARRAY[]::text[], ARRAY['whale', 'high'], true,
'{"intensity": "medium", "descriptive": true}'),

('Sexting - Escalation', 'sexting',
'mmm i love when you talk to me like that 🥵 you''re getting me so turned on right now... what else would you do to me? 😈',
ARRAY[]::text[], ARRAY['whale', 'high'], true,
'{"intensity": "high", "engagement": "question"}');

-- =============================================================================
-- UPSELL TEMPLATES
-- =============================================================================

INSERT INTO ai_templates (name, category, template_text, variables, target_tiers, min_price, max_price, is_nsfw, metadata) VALUES

('Upsell - Custom Content Offer', 'upsell',
'btw babe, i do customs if you ever want something made just for you 😘 i can do pretty much anything you''re into... pricing starts at ${ppvPrice}. interested? 🔥',
ARRAY['ppvPrice'], ARRAY['whale', 'high'], 50, 200, true,
'{"service": "custom_content", "flexibility": "high"}'),

('Upsell - Sexting Session', 'upsell',
'you know what... i''m really enjoying chatting with you 😊 would you be interested in a private sexting session? i can send pics/vids in real time 🥵 ${ppvPrice} for 30 mins?',
ARRAY['ppvPrice'], ARRAY['whale', 'high'], 30, 100, true,
'{"service": "sexting", "time_based": true}'),

('Upsell - Dick Rating', 'upsell',
'i do dick ratings too if you''re interested 😈 i can be honest, worship, or humiliation style... ${ppvPrice} for a detailed video rating. want one? 🔥',
ARRAY['ppvPrice'], ARRAY['whale', 'high', 'medium'], 10, 50, true,
'{"service": "dick_rating", "options": ["honest", "worship", "humiliation"]}');

-- =============================================================================
-- CUSTOM TEMPLATES
-- =============================================================================

INSERT INTO ai_templates (name, category, template_text, variables, target_tiers, is_nsfw, metadata) VALUES

('Custom - Birthday Wish', 'custom',
'HAPPY BIRTHDAY {fanName}! 🎉🎂 hope you have an amazing day babe! i have a special surprise for you 😘💕',
ARRAY['fanName'], ARRAY['whale', 'high', 'medium', 'low'], false,
'{"occasion": "birthday", "personalization": "high"}'),

('Custom - Thank You Big Tipper', 'custom',
'omg {fanName}! 💎 thank you SO much for the tip baby! you''re seriously the best 🥰 you just made my day... let me make yours 😘',
ARRAY['fanName'], ARRAY['whale', 'high'], false,
'{"trigger": "tip_received", "gratitude": "high"}'),

('Custom - Apology Late Response', 'custom',
'hey babe! so sorry for the late reply, i''ve been crazy busy 😅 but you''re always worth the wait right? 😘 what were you saying? 💕',
ARRAY[]::text[], ARRAY['whale', 'high', 'medium'], false,
'{"trigger": "delayed_response", "tone": "apologetic"}');

-- =============================================================================
-- ANALYTICS & REPORTING
-- =============================================================================

-- Log template seeding
DO $$
DECLARE
  template_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO template_count FROM ai_templates;

  RAISE NOTICE '✅ AI Templates seed completed successfully';
  RAISE NOTICE '📊 Total templates loaded: %', template_count;
  RAISE NOTICE '📋 Categories: greeting, ppv_offer, reengagement, response, sexting, upsell, custom';
  RAISE NOTICE '🎯 Templates optimized for all fan tiers (whale, high, medium, low)';
  RAISE NOTICE '💰 Price ranges: $5 - $250 based on tier and content type';
  RAISE NOTICE '🔥 NSFW-enabled templates ready for adult content';
END $$;
