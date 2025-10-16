/**
 * Mock AI Response Generator
 * Provides realistic AI-generated messages for demo mode without requiring Anthropic API credits
 */

export const MOCK_RESPONSES = {
  ppv_offer: [
    "hey babe 🔥 just finished shooting something really special... wanna see? it's only ${ppvPrice} and i think you'll love it 😘",
    "baby i have a new video that's SO hot 🥵 ${ppvPrice} for the full thing... interested? 💦",
    "just shot the hottest content ever 😈 ${ppvPrice} for the full set... trust me it's worth it 🔥",
    "omg babe... you need to see what i just filmed 🤭 ${ppvPrice} for exclusive access 💋",
    "hey love! made something extra special today 💕 only ${ppvPrice} and it's all yours... want it? 😊",
  ],
  greeting: [
    "hey love! 💕 so happy you're here babe... how's your day going? 😊",
    "hi baby 😘 thanks for subscribing! i post exclusive content daily and love chatting 💋",
    "omg hi! 🥰 welcome to my page babe... excited to get to know you 💕",
    "hey there! 👋 thanks for the support love... what brings you to my page? 😊",
    "hi babe! 💖 so glad you're here... i think we're gonna have fun together 😘",
  ],
  response: [
    "aww you're so sweet 🥰 that made me smile baby 💕",
    "omg thank you babe! 😘 comments like that make my day ✨",
    "you're making me blush 😊 so sweet of you to say 💖",
    "baby you're the best 🥺 messages like this remind me why i love what i do 💕",
    "aww stop it! 🙈 you're too kind babe... but i love it 😘",
  ],
  sexting: [
    "baby i'm thinking about you right now 😈 are you alone? 🥵",
    "mmm i wish you were here with me... feeling so naughty 💦",
    "can't stop thinking about you 🔥 what are you up to? 😘",
    "hey you... wanna play? 😈 i'm in the mood for something fun 🥵",
    "baby... i need some attention right now 🔥 you free? 💋",
  ],
  reengagement: [
    "hey stranger! 👋 haven't heard from you in a while... miss chatting babe 💭",
    "hi baby! 💕 been posting some hot content lately... wanna catch up? 😘",
    "where have you been?? 🥺 i've missed you love... everything okay? 💕",
    "hey babe! long time no talk 😊 been thinking about you... how's life? 💖",
    "omg hi! 👋 feels like forever since we chatted... what's new with you? 😘",
  ],
  upsell: [
    "btw babe, i do custom content if you ever want something made just for you 😘 interested?",
    "you know what... i'm really enjoying our chat 🥰 would you want a private session? 💋",
    "hey baby... have you thought about a custom video? i can make your fantasy come true 😈",
    "so... i offer exclusive 1-on-1 content if you're interested 😏 way more personal than regular posts 🔥",
    "baby if you like what you see, wait till you see my customs 😘 want me to tell you more? 💕",
  ],
  general: [
    "hey babe! 💕 how are you doing today? 😊",
    "aww thanks baby 🥰 you're so sweet 💖",
    "omg really? 😍 tell me more! 💋",
    "baby you're amazing 💕 i love talking to you 😘",
    "mmm that sounds interesting 😏 what else? 🔥",
  ],
};

/**
 * Generate a mock AI response that simulates Claude's output
 */
export function generateMockAIResponse(
  category: string,
  ppvPrice?: number,
  fanName?: string
): string {
  const templates =
    MOCK_RESPONSES[category as keyof typeof MOCK_RESPONSES] || MOCK_RESPONSES.response;
  const template = templates[Math.floor(Math.random() * templates.length)];

  return template
    .replace('${ppvPrice}', ppvPrice?.toString() || '25')
    .replace('${fanName}', fanName || 'babe');
}

/**
 * Apply personality styling to a message
 */
export function applyPersonalityToMock(message: string, personalityTone: string): string {
  // Add personality-specific variations
  switch (personalityTone) {
    case 'flirty':
      return message; // Already flirty by default
    case 'girlfriend':
      return message.replace(/babe/g, 'baby').replace(/😈/g, '🥰').replace(/🔥/g, '💕');
    case 'dominant':
      return message.replace(/🥰/g, '😏').replace(/💕/g, '🔥').replace(/baby/g, 'good boy');
    case 'casual':
      return message.replace(/💕/g, '😊').replace(/😘/g, '👍').replace(/babe/g, 'hey');
    default:
      return message;
  }
}

/**
 * Generate realistic metadata for mock responses
 */
export function generateMockMetadata() {
  return {
    model: 'demo-claude-3-5-sonnet-20250219',
    stopReason: 'end_turn' as const,
    usage: {
      input_tokens: Math.floor(Math.random() * 100) + 80, // 80-180 tokens
      output_tokens: Math.floor(Math.random() * 40) + 30, // 30-70 tokens
    },
  };
}

/**
 * Generate realistic confidence score
 */
export function generateMockConfidence(hasPpv: boolean, category: string): number {
  // PPV offers tend to have slightly lower confidence
  const baseConfidence = hasPpv ? 0.78 : 0.82;
  const variance = Math.random() * 0.13; // +0 to +13%
  return Math.min(0.95, baseConfidence + variance);
}
