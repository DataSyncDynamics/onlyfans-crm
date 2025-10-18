-- Fix RLS Policies for Public Demo Access
-- Allows reading templates and other data without authentication for demo purposes

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Templates are viewable by authenticated users" ON ai_templates;
DROP POLICY IF EXISTS "Conversations viewable by owner" ON ai_conversations;
DROP POLICY IF EXISTS "Messages viewable by conversation owner" ON ai_messages;

-- Create permissive policies for demo mode
CREATE POLICY "Templates are publicly readable" ON ai_templates
  FOR SELECT USING (true);

CREATE POLICY "Conversations are publicly readable" ON ai_conversations
  FOR SELECT USING (true);

CREATE POLICY "Messages are publicly readable" ON ai_messages
  FOR SELECT USING (true);

CREATE POLICY "Analytics events are publicly readable" ON ai_analytics_events
  FOR SELECT USING (true);

CREATE POLICY "Approval queue publicly readable" ON approval_queue
  FOR SELECT USING (true);

-- Enable insert for testing (can be removed in production)
CREATE POLICY "Allow public inserts for testing" ON ai_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts for testing" ON ai_analytics_events
  FOR INSERT WITH CHECK (true);

-- Verify policies
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies updated for public demo access';
  RAISE NOTICE '📖 All tables now readable without authentication';
  RAISE NOTICE '⚠️  Remember to restrict access in production!';
END
$$;
