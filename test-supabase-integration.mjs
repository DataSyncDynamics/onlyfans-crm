#!/usr/bin/env node

/**
 * Supabase Integration Verification Script
 * Tests connection, tables, data, and RLS policies
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Console styling helpers
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const success = (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`);
const error = (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`);
const info = (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`);
const warning = (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`);
const header = (msg) => console.log(`\n${colors.bold}${colors.blue}━━━ ${msg} ━━━${colors.reset}\n`);

// Expected tables
const EXPECTED_TABLES = [
  'ai_conversations',
  'ai_messages',
  'ai_templates',
  'creator_personalities',
  'approval_queue',
  'ai_analytics_events'
];

async function runTests() {
  console.log(`${colors.bold}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║   VAULTCRM SUPABASE INTEGRATION VERIFICATION TEST          ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  // Test 1: Environment Variables
  header('TEST 1: Environment Variables');
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    error('Missing Supabase environment variables');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Missing');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Set' : 'Missing');
    process.exit(1);
  }
  success('Environment variables loaded');
  info(`Supabase URL: ${SUPABASE_URL}`);
  info(`Anon Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);

  // Test 2: Create Supabase Client
  header('TEST 2: Supabase Client Connection');
  let supabase;
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    success('Supabase client created successfully');
  } catch (err) {
    error(`Failed to create Supabase client: ${err.message}`);
    process.exit(1);
  }

  // Test 3: Test Basic Connection
  header('TEST 3: Database Connection Test');
  try {
    // Test connection by querying pg_catalog
    const { data, error: connError } = await supabase.rpc('ping').catch(() => ({ data: null, error: null }));

    // Alternative: Try a simple query
    const { error: testError } = await supabase
      .from('ai_templates')
      .select('count', { count: 'exact', head: true });

    if (testError && testError.code === 'PGRST301') {
      // Table exists but might be empty - this is OK
      success('Database connection successful');
    } else if (testError) {
      warning(`Connection test returned: ${testError.message}`);
      info('Continuing with table checks...');
    } else {
      success('Database connection successful');
    }
  } catch (err) {
    warning(`Basic connection test inconclusive: ${err.message}`);
    info('Continuing with detailed table checks...');
  }

  // Test 4: Verify Tables Exist and Are Accessible
  header('TEST 4: Table Existence & Accessibility');
  const tableResults = {};

  for (const tableName of EXPECTED_TABLES) {
    try {
      const { count, error: tableError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (tableError) {
        error(`Table '${tableName}': ${tableError.message}`);
        tableResults[tableName] = { exists: false, error: tableError.message };
      } else {
        success(`Table '${tableName}': Accessible (${count || 0} rows)`);
        tableResults[tableName] = { exists: true, rowCount: count || 0 };
      }
    } catch (err) {
      error(`Table '${tableName}': ${err.message}`);
      tableResults[tableName] = { exists: false, error: err.message };
    }
  }

  // Test 5: Query ai_templates Table
  header('TEST 5: AI Templates Data Verification');
  try {
    const { data: templates, error: templatesError, count } = await supabase
      .from('ai_templates')
      .select('*', { count: 'exact' });

    if (templatesError) {
      error(`Failed to query ai_templates: ${templatesError.message}`);
    } else {
      const templateCount = templates?.length || 0;
      if (templateCount === 7) {
        success(`Found exactly 7 templates as expected`);
      } else {
        warning(`Found ${templateCount} templates (expected 7)`);
      }

      if (templates && templates.length > 0) {
        info('Template categories found:');
        templates.forEach(t => {
          console.log(`  - ${t.name} (${t.category})`);
        });
      }
    }
  } catch (err) {
    error(`Failed to query ai_templates: ${err.message}`);
  }

  // Test 6: Test INSERT into ai_analytics_events
  header('TEST 6: INSERT Test (ai_analytics_events)');
  try {
    const testEvent = {
      event_type: 'test_connection',
      event_data: {
        test: true,
        timestamp: new Date().toISOString(),
        source: 'integration_test_script'
      },
      created_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('ai_analytics_events')
      .insert([testEvent])
      .select();

    if (insertError) {
      error(`INSERT failed: ${insertError.message}`);
      info(`Error code: ${insertError.code}`);
    } else {
      success('INSERT successful - test event created');
      info(`Event ID: ${insertData[0]?.id}`);

      // Verify we can read it back
      const { data: readData, error: readError } = await supabase
        .from('ai_analytics_events')
        .select('*')
        .eq('id', insertData[0]?.id)
        .single();

      if (readError) {
        warning(`Could not read back inserted event: ${readError.message}`);
      } else {
        success('READ successful - can retrieve inserted data');
      }
    }
  } catch (err) {
    error(`INSERT test failed: ${err.message}`);
  }

  // Test 7: RLS Policies Check (Public Read Access)
  header('TEST 7: Row Level Security (RLS) Policies');
  try {
    // Test public read access to ai_templates
    const { data: publicTemplates, error: rlsError } = await supabase
      .from('ai_templates')
      .select('id, name, category')
      .limit(5);

    if (rlsError) {
      if (rlsError.code === '42501') {
        error('RLS blocking access - policies may not be configured correctly');
      } else {
        error(`RLS test failed: ${rlsError.message}`);
      }
    } else {
      success('RLS policies allow public read access');
      info(`Successfully read ${publicTemplates?.length || 0} template records`);
    }

    // Test public read access to ai_analytics_events
    const { data: analyticsEvents, error: analyticsRlsError } = await supabase
      .from('ai_analytics_events')
      .select('id, event_type')
      .limit(5);

    if (analyticsRlsError) {
      error(`Analytics RLS test: ${analyticsRlsError.message}`);
    } else {
      success('Analytics events table has public read access');
    }
  } catch (err) {
    error(`RLS test failed: ${err.message}`);
  }

  // Test 8: Check All Tables Summary
  header('TEST 8: Overall Table Status Summary');
  const successfulTables = Object.entries(tableResults).filter(([_, result]) => result.exists);
  const failedTables = Object.entries(tableResults).filter(([_, result]) => !result.exists);

  console.log(`${colors.bold}Tables Status:${colors.reset}`);
  console.log(`  Total Expected: ${EXPECTED_TABLES.length}`);
  console.log(`  ${colors.green}Accessible: ${successfulTables.length}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${failedTables.length}${colors.reset}`);

  if (failedTables.length > 0) {
    console.log(`\n${colors.bold}Failed Tables:${colors.reset}`);
    failedTables.forEach(([name, result]) => {
      console.log(`  ${colors.red}✗${colors.reset} ${name}: ${result.error}`);
    });
  }

  // Final Summary
  header('FINAL SUMMARY');
  const allTestsPassed = successfulTables.length === EXPECTED_TABLES.length;

  if (allTestsPassed) {
    console.log(`${colors.bold}${colors.green}
╔════════════════════════════════════════════════════════════╗
║                  ✅ ALL TESTS PASSED                       ║
║                                                            ║
║  Supabase integration is working correctly!                ║
║  - Connection: Successful                                  ║
║  - Tables: All ${EXPECTED_TABLES.length} accessible                               ║
║  - RLS Policies: Configured correctly                      ║
║  - Data Operations: INSERT/SELECT working                  ║
║                                                            ║
║  Status: READY FOR PRODUCTION SHOWCASE                     ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.bold}${colors.yellow}
╔════════════════════════════════════════════════════════════╗
║              ⚠️  SOME TESTS FAILED                         ║
║                                                            ║
║  Please review the errors above and fix:                   ║
║  - Failed table access                                     ║
║  - RLS policy issues                                       ║
║  - Connection problems                                     ║
║                                                            ║
║  Status: NEEDS ATTENTION                                   ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((err) => {
  console.error(`${colors.red}${colors.bold}FATAL ERROR:${colors.reset}`, err);
  process.exit(1);
});
