import { createClient } from '@supabase/supabase-js';

let cachedTemplates: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 3600000; // 1 hour

export async function getCachedTemplates() {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedTemplates && (now - cacheTimestamp < CACHE_DURATION)) {
    return cachedTemplates;
  }

  // Fetch fresh data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('ai_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (!error && data) {
    cachedTemplates = data;
    cacheTimestamp = now;
  }

  return cachedTemplates || [];
}

export function invalidateTemplateCache() {
  cachedTemplates = null;
  cacheTimestamp = 0;
}
