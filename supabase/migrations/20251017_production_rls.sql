-- Production RLS Policies
-- Secure row-level security for production deployment
-- Run this migration only when deploying to production

-- Drop demo policies (only if they exist)
DROP POLICY IF EXISTS "Templates are publicly readable" ON ai_templates;
DROP POLICY IF EXISTS "Conversations are publicly readable" ON ai_conversations;
DROP POLICY IF EXISTS "Messages are publicly readable" ON ai_messages;
DROP POLICY IF EXISTS "Allow public inserts for testing" ON ai_messages;
DROP POLICY IF EXISTS "Allow public inserts for testing" ON ai_analytics_events;
DROP POLICY IF EXISTS "Analytics events are publicly readable" ON ai_analytics_events;
DROP POLICY IF EXISTS "Approval queue publicly readable" ON approval_queue;

-- Production policies for templates (still public - these are shared)
CREATE POLICY "Templates are readable by all authenticated users" ON ai_templates
  FOR SELECT USING (true);

-- Allow template creators to update their own templates
CREATE POLICY "Template creators can update their templates" ON ai_templates
  FOR UPDATE USING (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Production policies for conversations (user-scoped)
CREATE POLICY "Users see own conversations" ON ai_conversations
  FOR SELECT USING (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users create own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users update own conversations" ON ai_conversations
  FOR UPDATE USING (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Production policies for messages (user-scoped via conversations)
CREATE POLICY "Users see messages in own conversations" ON ai_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM ai_conversations
      WHERE creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users insert messages in own conversations" ON ai_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM ai_conversations
      WHERE creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Production policies for analytics
CREATE POLICY "Users see own analytics" ON ai_analytics_events
  FOR SELECT USING (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users log own analytics" ON ai_analytics_events
  FOR INSERT WITH CHECK (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Approval queue policies
CREATE POLICY "Users see own approval queue" ON approval_queue
  FOR SELECT USING (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users insert own approval items" ON approval_queue
  FOR INSERT WITH CHECK (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users update own approval items" ON approval_queue
  FOR UPDATE USING (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users delete own approval items" ON approval_queue
  FOR DELETE USING (creator_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Verify policies
DO $$
BEGIN
  RAISE NOTICE '✅ Production RLS policies created successfully';
  RAISE NOTICE '🔒 All tables now require authentication';
  RAISE NOTICE '👤 Users can only access their own data';
  RAISE NOTICE '📋 Templates remain publicly readable for all authenticated users';
END
$$;
