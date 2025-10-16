/**
 * Test script for Anthropic API connection
 * Run with: npx tsx scripts/test-anthropic.ts
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { testAnthropicConnection, getAPIConfig } from '../src/lib/ai-chatter/client';

async function main() {
  console.log('='.repeat(60));
  console.log('🤖 VaultCRM AI System - Anthropic Connection Test');
  console.log('='.repeat(60));
  console.log('');

  // Show configuration
  console.log('📋 Current AI Configuration:');
  const config = getAPIConfig();
  console.log(JSON.stringify(config, null, 2));
  console.log('');

  // Test connection
  const connected = await testAnthropicConnection();

  console.log('');
  console.log('='.repeat(60));

  if (connected) {
    console.log('✅ SUCCESS: AI system is ready to use!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Create database migrations');
    console.log('2. Update type definitions');
    console.log('3. Build message generation engine');
  } else {
    console.log('❌ FAILED: Please check your API key and try again');
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Verify ANTHROPIC_API_KEY in .env.local');
    console.log('2. Check API key at https://console.anthropic.com/settings/keys');
    console.log('3. Ensure you have API credits available');
    process.exit(1);
  }

  console.log('='.repeat(60));
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
