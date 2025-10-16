import Anthropic from '@anthropic-ai/sdk';

// Singleton instance
let anthropicClient: Anthropic | null = null;

/**
 * Get or create Anthropic client instance
 * Uses singleton pattern to avoid creating multiple clients
 */
export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY environment variable is not set. ' +
        'Please add it to your .env.local file.'
      );
    }

    if (!apiKey.startsWith('sk-ant-')) {
      throw new Error(
        'Invalid ANTHROPIC_API_KEY format. ' +
        'API key should start with "sk-ant-"'
      );
    }

    anthropicClient = new Anthropic({
      apiKey,
    });

    console.log('✅ Anthropic client initialized successfully');
  }

  return anthropicClient;
}

/**
 * Test Anthropic API connection
 * Makes a minimal API call to verify credentials work
 * @returns true if connection successful, false otherwise
 */
export async function testAnthropicConnection(): Promise<boolean> {
  try {
    console.log('🔄 Testing Anthropic API connection...');

    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20250219',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hello' }],
    });

    const success = message.content.length > 0;

    if (success) {
      console.log('✅ Anthropic API connection successful!');
      console.log('📊 Model:', message.model);
      console.log('📊 Response:', message.content[0]);
    }

    return success;
  } catch (error) {
    console.error('❌ Anthropic connection test failed:', error);

    if (error instanceof Error) {
      if (error.message.includes('invalid_api_key')) {
        console.error('🔑 Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local');
      } else if (error.message.includes('rate_limit')) {
        console.error('⏱️  Rate limit exceeded. Please try again later.');
      } else {
        console.error('Error details:', error.message);
      }
    }

    return false;
  }
}

/**
 * Get current API configuration
 * Useful for debugging and monitoring
 */
export function getAPIConfig() {
  return {
    autoSendThreshold: parseFloat(process.env.AI_AUTO_SEND_THRESHOLD || '50'),
    minConfidence: parseFloat(process.env.AI_MIN_CONFIDENCE || '0.7'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '500'),
    contentFilterEnabled: process.env.AI_CONTENT_FILTER_ENABLED === 'true',
    requireApprovalForNewFans: process.env.AI_REQUIRE_APPROVAL_FOR_NEW_FANS === 'true',
    requireApprovalForAll: process.env.AI_REQUIRE_APPROVAL_FOR_ALL === 'true',
  };
}
