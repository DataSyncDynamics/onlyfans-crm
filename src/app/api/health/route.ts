import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    checks: {
      database: 'unknown',
      ai: 'unknown',
      templates: 'unknown',
    },
  };

  try {
    // Check Supabase database connection
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('ai_templates')
        .select('id')
        .limit(1);

      checks.checks.database = error ? 'unhealthy' : 'healthy';
      checks.checks.templates = data && data.length > 0 ? 'healthy' : 'unhealthy';
    } else {
      checks.checks.database = 'not_configured';
      checks.checks.templates = 'not_configured';
    }

    // Check AI service
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    const useMockAI = process.env.USE_MOCK_AI === 'true';
    checks.checks.ai = hasApiKey ? 'healthy' : useMockAI ? 'degraded' : 'unhealthy';

    // Determine overall health
    const isHealthy = Object.values(checks.checks).every(
      status => status === 'healthy' || status === 'degraded'
    );

    checks.status = isHealthy ? 'healthy' : 'unhealthy';

    return NextResponse.json(checks, {
      status: isHealthy ? 200 : 503,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ...checks,
        status: 'unhealthy',
        error: error.message,
      },
      { status: 503 }
    );
  }
}
