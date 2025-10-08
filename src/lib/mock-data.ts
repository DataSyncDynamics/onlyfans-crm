import {
  Creator,
  Fan,
  Chatter,
  Transaction,
  Message,
  AgencyMetrics,
  Alert,
  Campaign,
  Shift,
  ShiftHandoff,
  ShiftTemplate,
  Conversation,
  ChatMessage,
  AISuggestion,
  KeywordAlert,
  MessageTemplate,
  ContentItem,
  ContentCollection,
  ContentAnalytics,
  OnlyFansConnection,
  SyncActivity,
  SyncPreview,
} from "@/types";

// ============================================================================
// SEEDED RANDOM NUMBER GENERATOR (for consistent server/client rendering)
// ============================================================================

let seed = 12345;

function seededRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// ============================================================================
// MOCK DATA STORAGE
// ============================================================================

export const CREATORS: Creator[] = [
  {
    id: "creator_1",
    username: "stellarose",
    displayName: "Stella Rose",
    ofUsername: "@StellaRose",
    avatarUrl: "/avatars/stella.jpg",
    bio: "Top performer. Luxury lifestyle & exclusive content.",
    subscriptionPrice: 9.99,
    totalRevenue: 150000, // $50k/month x 3 months
    totalFans: 450,
    activeFans: 380,
    joinedAt: new Date("2023-01-15"),
    status: "active",
    tags: ["luxury", "top-performer", "exclusive"],
  },
  {
    id: "creator_2",
    username: "lunavibe",
    displayName: "Luna Vibe",
    ofUsername: "@LunaVibe",
    avatarUrl: "/avatars/luna.jpg",
    bio: "Artistic content creator. Daily posts & personalized messages.",
    subscriptionPrice: 9.99,
    totalRevenue: 90000, // $30k/month x 3 months
    totalFans: 350,
    activeFans: 290,
    joinedAt: new Date("2023-03-20"),
    status: "active",
    tags: ["artistic", "daily-posts", "engaging"],
  },
  {
    id: "creator_3",
    username: "novanight",
    displayName: "Nova Night",
    ofUsername: "@NovaNight",
    avatarUrl: "/avatars/nova.jpg",
    bio: "Rising star. Interactive content & gaming streams.",
    subscriptionPrice: 9.99,
    totalRevenue: 45000, // $15k/month x 3 months
    totalFans: 250,
    activeFans: 210,
    joinedAt: new Date("2023-06-10"),
    status: "active",
    tags: ["gaming", "interactive", "rising-star"],
  },
];

export const CHATTERS: Chatter[] = [
  {
    id: "chatter_1",
    name: "Sarah Martinez",
    email: "sarah@agency.com",
    role: "lead",
    assignedCreators: ["creator_1", "creator_2", "creator_3"],
    messageCount: 4500,
    revenueGenerated: 95000,
    avgResponseTime: 2.5,
    conversionRate: 42,
    performanceScore: 95, // A
    status: "active",
    shiftsThisWeek: 5,
    hoursWorked: 38,
    joinedAt: new Date("2023-01-01"),
  },
  {
    id: "chatter_2",
    name: "Alex Chen",
    email: "alex@agency.com",
    role: "senior",
    assignedCreators: ["creator_1", "creator_2"],
    messageCount: 3800,
    revenueGenerated: 72000,
    avgResponseTime: 3.8,
    conversionRate: 36,
    performanceScore: 85, // B
    status: "active",
    shiftsThisWeek: 5,
    hoursWorked: 40,
    joinedAt: new Date("2023-02-15"),
  },
  {
    id: "chatter_3",
    name: "Jamie Wilson",
    email: "jamie@agency.com",
    role: "senior",
    assignedCreators: ["creator_2", "creator_3"],
    messageCount: 3500,
    revenueGenerated: 68000,
    avgResponseTime: 4.2,
    conversionRate: 34,
    performanceScore: 82, // B
    status: "active",
    shiftsThisWeek: 5,
    hoursWorked: 37,
    joinedAt: new Date("2023-03-01"),
  },
  {
    id: "chatter_4",
    name: "Chris Taylor",
    email: "chris@agency.com",
    role: "junior",
    assignedCreators: ["creator_3"],
    messageCount: 2200,
    revenueGenerated: 38000,
    avgResponseTime: 6.5,
    conversionRate: 24,
    performanceScore: 70, // C
    status: "active",
    shiftsThisWeek: 4,
    hoursWorked: 32,
    joinedAt: new Date("2023-08-15"),
  },
  {
    id: "chatter_5",
    name: "Taylor Brooks",
    email: "taylor@agency.com",
    role: "junior",
    assignedCreators: ["creator_1"],
    messageCount: 1900,
    revenueGenerated: 32000,
    avgResponseTime: 7.2,
    conversionRate: 22,
    performanceScore: 65, // D
    status: "active",
    shiftsThisWeek: 4,
    hoursWorked: 30,
    joinedAt: new Date("2023-09-01"),
  },
];

// ============================================================================
// FAN GENERATION (1050+ fans following Pareto principle)
// ============================================================================

const FAN_FIRST_NAMES = [
  "Mike",
  "John",
  "David",
  "James",
  "Robert",
  "Chris",
  "Daniel",
  "Matthew",
  "Ryan",
  "Jason",
  "Kevin",
  "Brian",
  "Eric",
  "Tyler",
  "Mark",
  "Steven",
  "Andrew",
  "Thomas",
  "Josh",
  "Alex",
];

function generateRandomFanName(): string {
  const first =
    FAN_FIRST_NAMES[Math.floor(seededRandom() * FAN_FIRST_NAMES.length)] || "user";
  const num = Math.floor(seededRandom() * 9999);
  return `${first.toLowerCase()}${num}`;
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + seededRandom() * (end.getTime() - start.getTime())
  );
}

function generateFansForCreator(
  creatorId: string,
  totalCount: number
): Fan[] {
  const fans: Fan[] = [];
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);

  // Tier distribution (Pareto principle)
  const whaleCount = Math.floor(totalCount * 0.05); // 5% whales
  const highCount = Math.floor(totalCount * 0.15); // 15% high
  const mediumCount = Math.floor(totalCount * 0.3); // 30% medium
  const lowCount = totalCount - whaleCount - highCount - mediumCount; // 50% low

  // Generate whales (5% = 80% of revenue potential)
  for (let i = 0; i < whaleCount; i++) {
    const joinedAt = generateRandomDate(twoYearsAgo, now);
    const totalSpent =
      2000 + seededRandom() * 8000 + seededRandom() * 5000 * (i % 3); // $2k-$15k
    const messageCount = Math.floor(50 + seededRandom() * 150);
    const tipCount = Math.floor(20 + seededRandom() * 80);
    const ppvPurchases = Math.floor(10 + seededRandom() * 40);

    fans.push({
      id: `fan_${creatorId}_whale_${i}`,
      username: `@${generateRandomFanName()}`,
      displayName: generateRandomFanName(),
      email: `fan${i}@example.com`,
      creatorId,
      tier: "whale",
      totalSpent: Math.round(totalSpent),
      messageCount,
      tipCount,
      ppvPurchases,
      subscriptionStatus: "active",
      subscriptionRenewsAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      joinedAt,
      lastActiveAt: new Date(
        now.getTime() - seededRandom() * 48 * 60 * 60 * 1000
      ), // Within 48h
      tags: ["vip", "whale", "high-value"],
      riskScore: Math.floor(seededRandom() * 20), // Low churn risk
    });
  }

  // Generate high tier (15%)
  for (let i = 0; i < highCount; i++) {
    const joinedAt = generateRandomDate(twoYearsAgo, now);
    const totalSpent = 500 + seededRandom() * 1500; // $500-$2k
    const messageCount = Math.floor(20 + seededRandom() * 60);
    const tipCount = Math.floor(10 + seededRandom() * 30);
    const ppvPurchases = Math.floor(5 + seededRandom() * 20);

    fans.push({
      id: `fan_${creatorId}_high_${i}`,
      username: `@${generateRandomFanName()}`,
      displayName: generateRandomFanName(),
      email: `fan${whaleCount + i}@example.com`,
      creatorId,
      tier: "high",
      totalSpent: Math.round(totalSpent),
      messageCount,
      tipCount,
      ppvPurchases,
      subscriptionStatus: seededRandom() > 0.1 ? "active" : "expired",
      subscriptionRenewsAt:
        seededRandom() > 0.1
          ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          : undefined,
      joinedAt,
      lastActiveAt: new Date(
        now.getTime() - seededRandom() * 5 * 24 * 60 * 60 * 1000
      ), // Within 5 days
      tags: ["high-value"],
      riskScore: Math.floor(20 + seededRandom() * 30), // Medium churn risk
    });
  }

  // Generate medium tier (30%)
  for (let i = 0; i < mediumCount; i++) {
    const joinedAt = generateRandomDate(twoYearsAgo, now);
    const totalSpent = 100 + seededRandom() * 400; // $100-$500
    const messageCount = Math.floor(5 + seededRandom() * 25);
    const tipCount = Math.floor(2 + seededRandom() * 15);
    const ppvPurchases = Math.floor(1 + seededRandom() * 10);

    fans.push({
      id: `fan_${creatorId}_med_${i}`,
      username: `@${generateRandomFanName()}`,
      displayName: generateRandomFanName(),
      creatorId,
      tier: "medium",
      totalSpent: Math.round(totalSpent),
      messageCount,
      tipCount,
      ppvPurchases,
      subscriptionStatus: seededRandom() > 0.2 ? "active" : "expired",
      subscriptionRenewsAt:
        seededRandom() > 0.2
          ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          : undefined,
      joinedAt,
      lastActiveAt: new Date(
        now.getTime() - seededRandom() * 10 * 24 * 60 * 60 * 1000
      ), // Within 10 days
      riskScore: Math.floor(40 + seededRandom() * 30), // Higher churn risk
    });
  }

  // Generate low tier (50%)
  for (let i = 0; i < lowCount; i++) {
    const joinedAt = generateRandomDate(twoYearsAgo, now);
    const totalSpent = 20 + seededRandom() * 80; // $20-$100
    const messageCount = Math.floor(seededRandom() * 10);
    const tipCount = Math.floor(seededRandom() * 5);
    const ppvPurchases = Math.floor(seededRandom() * 3);

    fans.push({
      id: `fan_${creatorId}_low_${i}`,
      username: `@${generateRandomFanName()}`,
      displayName: generateRandomFanName(),
      creatorId,
      tier: "low",
      totalSpent: Math.round(totalSpent),
      messageCount,
      tipCount,
      ppvPurchases,
      subscriptionStatus: seededRandom() > 0.4 ? "active" : "expired",
      subscriptionRenewsAt:
        seededRandom() > 0.4
          ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          : undefined,
      joinedAt,
      lastActiveAt: new Date(
        now.getTime() - seededRandom() * 30 * 24 * 60 * 60 * 1000
      ), // Within 30 days
      riskScore: Math.floor(60 + seededRandom() * 40), // High churn risk
    });
  }

  return fans;
}

// Temporary storage for fans before transactions are generated
const TEMP_FANS: Fan[] = [
  ...generateFansForCreator("creator_1", 450), // Stella Rose
  ...generateFansForCreator("creator_2", 350), // Luna Vibe
  ...generateFansForCreator("creator_3", 250), // Nova Night
];

// ============================================================================
// TRANSACTION GENERATION (180 days, ~6000+ transactions)
// ============================================================================

function generateTransactionsForFan(fan: Fan): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();
  const oneEightyDaysAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const startDate =
    fan.joinedAt > oneEightyDaysAgo ? fan.joinedAt : oneEightyDaysAgo;

  // Get assigned chatter for this creator
  const assignedChatters = CHATTERS.filter((c) =>
    c.assignedCreators.includes(fan.creatorId)
  );
  const randomChatter =
    assignedChatters[Math.floor(seededRandom() * assignedChatters.length)];

  let transactionCounter = 0;

  // Subscription renewals (monthly on 1st)
  const currentMonth = new Date(startDate);
  while (currentMonth <= now) {
    const renewalDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    if (renewalDate >= startDate && renewalDate <= now) {
      transactions.push({
        id: `txn_${fan.id}_sub_${transactionCounter++}`,
        fanId: fan.id,
        creatorId: fan.creatorId,
        type: "subscription",
        amount: 9.99,
        description: "Monthly subscription renewal",
        createdAt: renewalDate,
        status: "completed",
      });
    }
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  // Tips based on tier
  const tipAmounts = [5, 10, 20, 50, 100, 200, 500];
  for (let i = 0; i < fan.tipCount; i++) {
    const tipDate = generateRandomDate(startDate, now);
    // Higher chance of tips on weekends
    if (tipDate.getDay() === 0 || tipDate.getDay() === 6) {
      if (seededRandom() > 0.3) continue; // 70% more likely on weekends
    }

    const tipAmount =
      fan.tier === "whale"
        ? tipAmounts[Math.floor(seededRandom() * tipAmounts.length)] || 10
        : fan.tier === "high"
          ? tipAmounts[Math.floor(seededRandom() * 5)] || 10
          : fan.tier === "medium"
            ? tipAmounts[Math.floor(seededRandom() * 3)] || 5
            : tipAmounts[Math.floor(seededRandom() * 2)] || 5;

    transactions.push({
      id: `txn_${fan.id}_tip_${transactionCounter++}`,
      fanId: fan.id,
      creatorId: fan.creatorId,
      chatterId: randomChatter?.id,
      type: "tip",
      amount: tipAmount,
      description: `Tip: ${tipAmount === 100 ? "You're amazing!" : "Love your content!"}`,
      createdAt: tipDate,
      status: "completed",
    });
  }

  // PPV purchases
  for (let i = 0; i < fan.ppvPurchases; i++) {
    const ppvDate = generateRandomDate(startDate, now);
    const ppvAmount =
      fan.tier === "whale"
        ? 20 + seededRandom() * 80 // $20-$100
        : fan.tier === "high"
          ? 15 + seededRandom() * 35 // $15-$50
          : 10 + seededRandom() * 20; // $10-$30

    transactions.push({
      id: `txn_${fan.id}_ppv_${transactionCounter++}`,
      fanId: fan.id,
      creatorId: fan.creatorId,
      chatterId: randomChatter?.id,
      type: "ppv",
      amount: Math.round(ppvAmount * 100) / 100,
      description: "Exclusive content unlock",
      createdAt: ppvDate,
      status: "completed",
    });
  }

  // Message unlocks with realistic content and conversation threads
  const messageUnlocks = Math.floor(fan.messageCount * 0.3); // 30% of messages are paid

  const conversationScenarios = [
    {
      thread: [
        { content: "Hey, I loved your latest post! 😍", sentBy: "fan" as const },
        { content: "Aww thank you babe! 🥰 I'm so glad you liked it", sentBy: "creator" as const },
        { content: "Hey babe! 😘 I just took some new photos in that outfit you mentioned... want to see them? They're pretty spicy 🔥", sentBy: "creator" as const, isPaid: true }
      ],
      preview: "New photos in that outfit you mentioned...",
      amount: [8, 12, 15]
    },
    {
      thread: [
        { content: "Good morning! How are you today? ☀️", sentBy: "fan" as const },
        { content: "Good morning handsome! ☀️ I'm doing a special photoshoot today just for my VIPs. Want exclusive access? I think you'll love it 💕", sentBy: "creator" as const, isPaid: true }
      ],
      preview: "Special photoshoot just for VIPs...",
      amount: [15, 20, 25]
    },
    {
      thread: [
        { content: "You always know how to make my day better 💕", sentBy: "fan" as const },
        { content: "You're so sweet! 😊", sentBy: "creator" as const },
        { content: "You've been such a great supporter 🥰 I made something custom just for you... it's a little extra special. Interested? 😏", sentBy: "creator" as const, isPaid: true }
      ],
      preview: "Made something custom just for you...",
      amount: [10, 15, 20]
    },
    {
      thread: [
        { content: "Any new content coming soon? 👀", sentBy: "fan" as const },
        { content: "I'm feeling extra generous today 💋 Got some behind-the-scenes content from my last shoot. Want to unlock it? Promise you won't be disappointed 😉", sentBy: "creator" as const, isPaid: true }
      ],
      preview: "Behind-the-scenes from my last shoot...",
      amount: [12, 18, 22]
    },
    {
      thread: [
        { content: "I remember you mentioned that red dress... did you ever wear it?", sentBy: "fan" as const },
        { content: "OMG yes! 😍", sentBy: "creator" as const },
        { content: "Hey! I remember you asking about that red dress... well I wore it for a private shoot and got some amazing shots 📸 Want to see? They're 🔥🔥🔥", sentBy: "creator" as const, isPaid: true }
      ],
      preview: "Private shoot in that red dress...",
      amount: [10, 15, 18]
    },
    {
      thread: [
        { content: "I can't wait to see what you create next!", sentBy: "fan" as const },
        { content: "Just finished editing some exclusive content and thought of you first! 💕 It's some of my best work yet. Want first access? 😘", sentBy: "creator" as const, isPaid: true }
      ],
      preview: "Exclusive content - thought of you first...",
      amount: [15, 20, 30]
    },
    {
      thread: [
        { content: "You've been amazing lately 🔥", sentBy: "fan" as const },
        { content: "Thank you so much! 💕", sentBy: "creator" as const },
        { content: "You know what... you've been so sweet lately 🥰 I have something special I want to share with you. It's a little naughty though 😈 Interested?", sentBy: "creator" as const, isPaid: true }
      ],
      preview: "Something special to share...",
      amount: [8, 12, 15]
    },
    {
      thread: [
        { content: "Hope you're having a good evening!", sentBy: "fan" as const },
        { content: "Good evening! 🌙 I just got out of the shower and took some really intimate photos... they're not for everyone but I think you'd appreciate them 💦", sentBy: "creator" as const, isPaid: true }
      ],
      preview: "Intimate photos from tonight...",
      amount: [12, 18, 25]
    },
  ];

  for (let i = 0; i < messageUnlocks; i++) {
    const msgDate = generateRandomDate(startDate, now);
    const scenario = conversationScenarios[Math.floor(seededRandom() * conversationScenarios.length)];
    const amountOptions = scenario.amount;
    const msgAmount = amountOptions[Math.floor(seededRandom() * amountOptions.length)];

    // Find the paid message in the thread
    const paidMessage = scenario.thread.find(m => m.isPaid);
    const messageContent = paidMessage?.content || scenario.thread[scenario.thread.length - 1].content;

    // Build conversation thread with proper Message objects
    const conversationThread = scenario.thread.map((msg, idx) => ({
      id: `msg_${fan.id}_thread_${i}_${idx}`,
      fanId: fan.id,
      creatorId: fan.creatorId,
      chatterId: msg.sentBy === "creator" ? randomChatter?.id : undefined,
      content: msg.content,
      type: "text" as const,
      sentBy: msg.sentBy,
      sentAt: new Date(msgDate.getTime() - (scenario.thread.length - idx - 1) * 60000), // 1 min intervals
      read: true,
    }));

    transactions.push({
      id: `txn_${fan.id}_msg_${transactionCounter++}`,
      fanId: fan.id,
      creatorId: fan.creatorId,
      chatterId: randomChatter?.id,
      type: "message",
      amount: msgAmount,
      description: "Unlock exclusive message",
      messageContent,
      messagePreview: scenario.preview,
      conversationThread,
      createdAt: msgDate,
      status: "completed",
    });
  }

  return transactions;
}

// Generate transactions and update fan totalSpent to match
export const TRANSACTIONS: Transaction[] = TEMP_FANS.flatMap((fan) =>
  generateTransactionsForFan(fan)
);

// Update fan totalSpent to match actual transaction totals
TEMP_FANS.forEach((fan) => {
  const fanTransactions = TRANSACTIONS.filter((t) => t.fanId === fan.id);
  fan.totalSpent = Math.round(
    fanTransactions
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0) * 100
  ) / 100;
});

// Export the corrected fans
export const FANS: Fan[] = TEMP_FANS;

// Update creator stats to match actual fan data
CREATORS.forEach((creator) => {
  const creatorFans = FANS.filter((f) => f.creatorId === creator.id);
  creator.activeFans = creatorFans.filter(
    (f) => f.subscriptionStatus === "active"
  ).length;
  // Total fans is already correct from generation
});

// ============================================================================
// MESSAGE GENERATION (Last 30 days, ~5000+ messages)
// ============================================================================

const MESSAGE_TEMPLATES = {
  fan_greetings: [
    "Hey! Love your content 😍",
    "Hi beautiful!",
    "Good morning gorgeous",
    "Hey! How's your day going?",
    "Just subscribed, love your vibe!",
  ],
  creator_responses: [
    "Hey! Thanks for the support 💕",
    "Hi there! Glad you're enjoying it!",
    "Morning babe! Doing great, you?",
    "Thank you so much! 🥰",
    "Welcome! So happy to have you here!",
  ],
  ppv_offers: [
    "Just posted exclusive content in DMs! Want to unlock? 🔥",
    "Got something special for you... $25 to unlock 😘",
    "New photoshoot just dropped! $30 for full set 📸",
    "Behind the scenes content available! Interested?",
  ],
  upsells: [
    "Would you like a personalized video? 💝",
    "I do custom content if you're interested!",
    "Want to see more of this outfit? I have more pics! 😉",
    "Got a special request? I love making custom content!",
  ],
};

function generateMessagesForFan(fan: Fan): Message[] {
  const messages: Message[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDate = fan.joinedAt > thirtyDaysAgo ? fan.joinedAt : thirtyDaysAgo;

  // Get assigned chatter
  const assignedChatters = CHATTERS.filter((c) =>
    c.assignedCreators.includes(fan.creatorId)
  );
  const randomChatter =
    assignedChatters[Math.floor(seededRandom() * assignedChatters.length)];

  const messageCount = Math.floor(
    fan.messageCount * 0.4 + seededRandom() * fan.messageCount * 0.3
  ); // 40-70% of total messages in last 30 days

  for (let i = 0; i < messageCount; i++) {
    const msgDate = generateRandomDate(startDate, now);
    const isFanMessage = i % 3 === 0; // Roughly 1/3 from fan, 2/3 from creator

    if (isFanMessage) {
      const template =
        MESSAGE_TEMPLATES.fan_greetings[
          Math.floor(seededRandom() * MESSAGE_TEMPLATES.fan_greetings.length)
        ] || "Hey!";
      messages.push({
        id: `msg_${fan.id}_${i}`,
        fanId: fan.id,
        creatorId: fan.creatorId,
        content: template,
        type: "text",
        sentBy: "fan",
        sentAt: msgDate,
        read: true,
      });
    } else {
      const rand = seededRandom();
      let template: string;
      let type: "text" | "media" | "ppv_offer" = "text";

      if (rand > 0.8 && fan.tier !== "low") {
        // 20% PPV offers for higher tiers
        template =
          MESSAGE_TEMPLATES.ppv_offers[
            Math.floor(seededRandom() * MESSAGE_TEMPLATES.ppv_offers.length)
          ] || "Special content available!";
        type = "ppv_offer";
      } else if (rand > 0.6 && fan.tier === "whale") {
        // Upsells for whales
        template =
          MESSAGE_TEMPLATES.upsells[
            Math.floor(seededRandom() * MESSAGE_TEMPLATES.upsells.length)
          ] || "Custom content available!";
        type = "text";
      } else {
        template =
          MESSAGE_TEMPLATES.creator_responses[
            Math.floor(
              seededRandom() * MESSAGE_TEMPLATES.creator_responses.length
            )
          ] || "Thanks!";
        type = seededRandom() > 0.7 ? "media" : "text";
      }

      messages.push({
        id: `msg_${fan.id}_${i}_resp`,
        fanId: fan.id,
        creatorId: fan.creatorId,
        chatterId: randomChatter?.id,
        content: template,
        type,
        sentBy: "creator",
        sentAt: new Date(msgDate.getTime() + 1000 * 60 * 5), // 5 min response
        read: seededRandom() > 0.2, // 80% read rate
      });
    }
  }

  return messages.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
}

export const MESSAGES: Message[] = FANS.flatMap((fan) =>
  generateMessagesForFan(fan)
);

// ============================================================================
// ALERTS / NOTIFICATIONS GENERATION
// ============================================================================

export const ALERTS: Alert[] = [
  // Revenue notifications (high priority)
  {
    id: "alert_1",
    type: "revenue",
    title: "Large Tip Received",
    message: "Whale fan @mike2847 tipped $500 to Stella Rose",
    priority: "high",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    actionUrl: "/fans?search=mike2847",
  },
  {
    id: "alert_2",
    type: "revenue",
    title: "Revenue Milestone Hit",
    message: "Stella Rose just crossed $5,000 this week! 🎉",
    priority: "high",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    actionUrl: "/creators",
  },
  {
    id: "alert_3",
    type: "revenue",
    title: "Premium Content Purchased",
    message: "@john4521 purchased exclusive PPV content for $150",
    priority: "medium",
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    actionUrl: "/revenue",
  },

  // Fan engagement alerts
  {
    id: "alert_4",
    type: "warning",
    title: "Whale Fan Inactive",
    message: "High-value fan @mike2847 ($3,500 LTV) hasn't messaged in 7 days",
    priority: "high",
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: "/fans?tier=whale",
  },
  {
    id: "alert_5",
    type: "warning",
    title: "Churn Risk Detected",
    message: "@sarah9876 subscription expires in 24h with no renewal set",
    priority: "high",
    read: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    actionUrl: "/fans",
  },
  {
    id: "alert_6",
    type: "info",
    title: "New Whale Identified",
    message: "@kevin5432 just became a whale ($2,000+ total spent) ⭐",
    priority: "medium",
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: "/fans?tier=whale",
  },
  {
    id: "alert_7",
    type: "revenue",
    title: "Fan Milestone Reached",
    message: "@chris4521 just spent $1,000 total - consider sending appreciation message",
    priority: "medium",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    actionUrl: "/fans",
  },

  // Chatter performance
  {
    id: "alert_8",
    type: "chat",
    title: "Response Time Alert",
    message: "Sarah Martinez avg response time increased to 8.5 minutes",
    priority: "medium",
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    actionUrl: "/chatters",
  },
  {
    id: "alert_9",
    type: "message",
    title: "High-Value Fans Waiting",
    message: "3 whale fans have unread messages from Alex Chen",
    priority: "high",
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    actionUrl: "/chatters",
  },
  {
    id: "alert_10",
    type: "chat",
    title: "Performance Achievement",
    message: "Jamie Wilson hit 50% conversion rate this week! 🏆",
    priority: "low",
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: "/chatters",
  },

  // System & operational
  {
    id: "alert_11",
    type: "warning",
    title: "Message Backlog",
    message: "45 unread messages from the last 2 hours need attention",
    priority: "medium",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    actionUrl: "/chatters",
  },
  {
    id: "alert_12",
    type: "info",
    title: "Shift Change Reminder",
    message: "Sarah Martinez shift ending in 30 minutes - handoff needed",
    priority: "low",
    read: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    actionUrl: "/chatters",
  },
  {
    id: "alert_13",
    type: "info",
    title: "Content Performance",
    message: "Yesterday's post from Luna Vibe got 3x normal engagement 🔥",
    priority: "low",
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: "/creators",
  },
  {
    id: "alert_14",
    type: "revenue",
    title: "Subscription Renewed",
    message: "VIP fan @david1234 just renewed their subscription",
    priority: "low",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    actionUrl: "/revenue",
  },
  {
    id: "alert_15",
    type: "message",
    title: "New Messages",
    message: "12 new messages received in the last hour",
    priority: "low",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    actionUrl: "/chatters",
  },
];

// ============================================================================
// CONTENT VAULT
// ============================================================================

export const MOCK_CONTENT_ITEMS: ContentItem[] = [
  {
    id: "content_1",
    creatorId: "creator_1",
    type: "photoset",
    title: "Beach Photoshoot - Golden Hour",
    description: "Exclusive beach photos from my Malibu shoot 🌅",
    fileUrl: "/content/beach-set-1.zip",
    thumbnailUrl: "/content/thumbs/beach-1.jpg",
    fileSize: 45000000,
    uploadedAt: new Date("2024-10-05"),
    tags: ["beach", "bikini", "sunset", "exclusive"],
    collections: ["collection_1"],
    isPPV: true,
    ppvPrice: 25,
    ppvPurchases: 47,
    ppvRevenue: 1175,
    isPublic: false,
    status: "active",
  },
  {
    id: "content_2",
    creatorId: "creator_1",
    type: "video",
    title: "Workout Routine - Full Body",
    description: "My complete workout routine 💪",
    fileUrl: "/content/workout-1.mp4",
    thumbnailUrl: "/content/thumbs/workout-1.jpg",
    fileSize: 120000000,
    duration: 1200,
    uploadedAt: new Date("2024-10-03"),
    tags: ["workout", "fitness", "gym"],
    collections: ["collection_2"],
    isPPV: true,
    ppvPrice: 35,
    ppvPurchases: 32,
    ppvRevenue: 1120,
    isPublic: false,
    status: "active",
  },
  {
    id: "content_3",
    creatorId: "creator_1",
    type: "photo",
    title: "Studio Session Teaser",
    description: "Sneak peek from my latest studio shoot",
    fileUrl: "/content/studio-teaser.jpg",
    thumbnailUrl: "/content/thumbs/studio-teaser.jpg",
    fileSize: 8500000,
    uploadedAt: new Date("2024-10-06"),
    tags: ["studio", "lingerie", "teaser"],
    collections: [],
    isPPV: false,
    isPublic: true,
    publicViews: 342,
    likes: 89,
    status: "active",
  },
  {
    id: "content_4",
    creatorId: "creator_1",
    type: "video",
    title: "Behind The Scenes - Photoshoot",
    description: "See how the magic happens ✨",
    fileUrl: "/content/bts-1.mp4",
    thumbnailUrl: "/content/thumbs/bts-1.jpg",
    fileSize: 95000000,
    duration: 900,
    uploadedAt: new Date("2024-10-01"),
    tags: ["bts", "behind-the-scenes", "exclusive"],
    collections: ["collection_1"],
    isPPV: true,
    ppvPrice: 20,
    ppvPurchases: 56,
    ppvRevenue: 1120,
    isPublic: false,
    status: "active",
  },
  {
    id: "content_5",
    creatorId: "creator_1",
    type: "photoset",
    title: "Bedroom Series - Part 1",
    description: "First part of my bedroom series 😈",
    fileUrl: "/content/bedroom-1.zip",
    thumbnailUrl: "/content/thumbs/bedroom-1.jpg",
    fileSize: 38000000,
    uploadedAt: new Date("2024-09-28"),
    tags: ["bedroom", "lingerie", "intimate"],
    collections: ["collection_3"],
    isPPV: true,
    ppvPrice: 30,
    ppvPurchases: 64,
    ppvRevenue: 1920,
    isPublic: false,
    status: "active",
  },
  {
    id: "content_6",
    creatorId: "creator_2",
    type: "video",
    title: "Yoga Flow - Morning Routine",
    description: "Start your day with me 🧘‍♀️",
    fileUrl: "/content/yoga-1.mp4",
    thumbnailUrl: "/content/thumbs/yoga-1.jpg",
    fileSize: 78000000,
    duration: 720,
    uploadedAt: new Date("2024-10-04"),
    tags: ["yoga", "fitness", "morning"],
    collections: ["collection_4"],
    isPPV: true,
    ppvPrice: 15,
    ppvPurchases: 28,
    ppvRevenue: 420,
    isPublic: false,
    status: "active",
  },
  {
    id: "content_7",
    creatorId: "creator_2",
    type: "photo",
    title: "Good Morning ☀️",
    description: "Coffee and sunshine",
    fileUrl: "/content/morning-1.jpg",
    thumbnailUrl: "/content/thumbs/morning-1.jpg",
    fileSize: 6200000,
    uploadedAt: new Date("2024-10-07"),
    tags: ["morning", "lifestyle", "casual"],
    collections: [],
    isPPV: false,
    isPublic: true,
    publicViews: 512,
    likes: 127,
    status: "active",
  },
];

export const MOCK_CONTENT_COLLECTIONS: ContentCollection[] = [
  {
    id: "collection_1",
    creatorId: "creator_1",
    name: "Beach & Vacation",
    description: "All my beach and vacation content",
    coverImageUrl: "/content/thumbs/beach-1.jpg",
    itemCount: 12,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-10-05"),
  },
  {
    id: "collection_2",
    creatorId: "creator_1",
    name: "Fitness & Wellness",
    description: "Workout routines and healthy lifestyle",
    coverImageUrl: "/content/thumbs/workout-1.jpg",
    itemCount: 8,
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-10-03"),
  },
  {
    id: "collection_3",
    creatorId: "creator_1",
    name: "Intimate Moments",
    description: "Exclusive intimate content for my VIPs",
    coverImageUrl: "/content/thumbs/bedroom-1.jpg",
    itemCount: 15,
    createdAt: new Date("2024-07-20"),
    updatedAt: new Date("2024-09-28"),
  },
  {
    id: "collection_4",
    creatorId: "creator_2",
    name: "Yoga & Mindfulness",
    description: "Yoga flows and meditation sessions",
    coverImageUrl: "/content/thumbs/yoga-1.jpg",
    itemCount: 6,
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-10-04"),
  },
];

// ============================================================================
// ONLYFANS INTEGRATION
// ============================================================================

export const MOCK_OF_CONNECTIONS: OnlyFansConnection[] = [
  {
    id: "of_conn_1",
    creatorId: "creator_1",
    ofUsername: "bellarose",
    connectionStatus: "connected",
    lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextSyncAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    autoSync: true,
    syncInterval: 6,
    syncSettings: {
      syncMessages: true,
      syncSubscribers: true,
      syncRevenue: true,
      syncContent: true,
    },
    apiKeyLastFour: "a7b3",
    connectedAt: new Date("2024-08-15"),
  },
  {
    id: "of_conn_2",
    creatorId: "creator_2",
    ofUsername: "lunastar",
    connectionStatus: "connected",
    lastSyncAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    nextSyncAt: new Date(Date.now() + 7 * 60 * 60 * 1000),
    autoSync: true,
    syncInterval: 12,
    syncSettings: {
      syncMessages: true,
      syncSubscribers: true,
      syncRevenue: true,
      syncContent: false,
    },
    apiKeyLastFour: "9f2e",
    connectedAt: new Date("2024-09-01"),
  },
  {
    id: "of_conn_3",
    creatorId: "creator_3",
    ofUsername: "ivydiamond",
    connectionStatus: "error",
    lastSyncAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    autoSync: false,
    syncInterval: 24,
    syncSettings: {
      syncMessages: false,
      syncSubscribers: true,
      syncRevenue: true,
      syncContent: false,
    },
    apiKeyLastFour: "1c8d",
    connectedAt: new Date("2024-07-10"),
    errorMessage: "API authentication failed. Please reconnect your account.",
  },
];

export const MOCK_SYNC_ACTIVITIES: SyncActivity[] = [
  {
    id: "sync_1",
    connectionId: "of_conn_1",
    type: "automatic",
    status: "completed",
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3 * 60 * 1000),
    itemsSynced: {
      messages: 47,
      subscribers: 3,
      transactions: 12,
      content: 2,
    },
  },
  {
    id: "sync_2",
    connectionId: "of_conn_1",
    type: "automatic",
    status: "completed",
    startedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 8 * 60 * 60 * 1000 + 4 * 60 * 1000),
    itemsSynced: {
      messages: 52,
      subscribers: 1,
      transactions: 8,
      content: 1,
    },
  },
  {
    id: "sync_3",
    connectionId: "of_conn_2",
    type: "manual",
    status: "completed",
    startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 2 * 60 * 1000),
    itemsSynced: {
      messages: 31,
      subscribers: 2,
      transactions: 5,
      content: 0,
    },
  },
  {
    id: "sync_4",
    connectionId: "of_conn_3",
    type: "automatic",
    status: "failed",
    startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    itemsSynced: {
      messages: 0,
      subscribers: 0,
      transactions: 0,
      content: 0,
    },
    errors: ["API authentication failed", "Invalid API key"],
  },
];

// ============================================================================
// HELPER FUNCTIONS - DATA ACCESS
// ============================================================================

export function getCreatorById(id: string): Creator | undefined {
  return CREATORS.find((c) => c.id === id);
}

export function getFanById(id: string): Fan | undefined {
  return FANS.find((f) => f.id === id);
}

export function getChatterById(id: string): Chatter | undefined {
  return CHATTERS.find((c) => c.id === id);
}

export function getFansByCreator(creatorId: string): Fan[] {
  return FANS.filter((f) => f.creatorId === creatorId);
}

export function getTransactionsByCreator(creatorId: string): Transaction[] {
  return TRANSACTIONS.filter((t) => t.creatorId === creatorId);
}

export function getTransactionsByFan(fanId: string): Transaction[] {
  return TRANSACTIONS.filter((t) => t.fanId === fanId);
}

export function getMessagesByFan(fanId: string): Message[] {
  return MESSAGES.filter((m) => m.fanId === fanId);
}

// ============================================================================
// HELPER FUNCTIONS - ANALYTICS
// ============================================================================

export function getRevenueByDateRange(start: Date, end: Date): number {
  return TRANSACTIONS.filter(
    (t) =>
      t.createdAt >= start && t.createdAt <= end && t.status === "completed"
  ).reduce((sum, t) => sum + t.amount, 0);
}

export function getRevenueByCreator(creatorId: string, days: number): number {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return TRANSACTIONS.filter(
    (t) =>
      t.creatorId === creatorId &&
      t.createdAt >= startDate &&
      t.status === "completed"
  ).reduce((sum, t) => sum + t.amount, 0);
}

export function getTopFans(limit: number, creatorId?: string): Fan[] {
  const fans = creatorId ? getFansByCreator(creatorId) : FANS;
  return fans.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit);
}

export function getChatterPerformance(): Chatter[] {
  return [...CHATTERS].sort((a, b) => b.performanceScore - a.performanceScore);
}

export function getCampaignById(id: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.id === id);
}

export function getCampaignsByCreator(creatorId: string): Campaign[] {
  return CAMPAIGNS.filter((c) => c.creatorIds.includes(creatorId));
}

export function getCampaignsByStatus(status: Campaign["status"]): Campaign[] {
  return CAMPAIGNS.filter((c) => c.status === status);
}

export function getAgencyMetrics(): AgencyMetrics {
  const totalRevenue = TRANSACTIONS.filter(
    (t) => t.status === "completed"
  ).reduce((sum, t) => sum + t.amount, 0);
  const totalFans = FANS.length;
  const activeFans = FANS.filter((f) => f.subscriptionStatus === "active")
    .length;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const messagesThisMonth = MESSAGES.filter(
    (m) => m.sentAt >= thirtyDaysAgo
  ).length;

  const topFan = FANS.reduce((max, fan) =>
    fan.totalSpent > max.totalSpent ? fan : max
  );
  const topCreator = CREATORS.reduce((max, creator) =>
    creator.totalRevenue > max.totalRevenue ? creator : max
  );

  const churnedFans = FANS.filter((f) => f.subscriptionStatus !== "active")
    .length;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalFans,
    activeFans,
    churnRate: Math.round((churnedFans / totalFans) * 100 * 10) / 10,
    avgRevenuePerFan: Math.round((totalRevenue / totalFans) * 100) / 100,
    topCreatorId: topCreator.id,
    topFanId: topFan.id,
    messagesThisMonth,
    conversionRate: Math.round((activeFans / totalFans) * 100 * 10) / 10,
  };
}

export function calculateDailyRevenue(
  days: number
): { date: string; amount: number }[] {
  const result: { date: string; amount: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0] || "";
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const revenue = TRANSACTIONS.filter(
      (t) =>
        t.createdAt >= dayStart &&
        t.createdAt <= dayEnd &&
        t.status === "completed"
    ).reduce((sum, t) => sum + t.amount, 0);

    result.push({
      date: dateStr,
      amount: Math.round(revenue * 100) / 100,
    });
  }

  return result;
}

export function getRevenueBreakdown(): {
  subscriptions: number;
  tips: number;
  ppv: number;
  messages: number;
} {
  const breakdown = {
    subscriptions: 0,
    tips: 0,
    ppv: 0,
    messages: 0,
  };

  TRANSACTIONS.filter((t) => t.status === "completed").forEach((t) => {
    switch (t.type) {
      case "subscription":
        breakdown.subscriptions += t.amount;
        break;
      case "tip":
        breakdown.tips += t.amount;
        break;
      case "ppv":
        breakdown.ppv += t.amount;
        break;
      case "message":
        breakdown.messages += t.amount;
        break;
    }
  });

  return {
    subscriptions: Math.round(breakdown.subscriptions * 100) / 100,
    tips: Math.round(breakdown.tips * 100) / 100,
    ppv: Math.round(breakdown.ppv * 100) / 100,
    messages: Math.round(breakdown.messages * 100) / 100,
  };
}

// ============================================================================
// DATA SUMMARY STATS (for verification)
// ============================================================================

export function getDataSummary() {
  const metrics = getAgencyMetrics();
  const breakdown = getRevenueBreakdown();

  return {
    creators: CREATORS.length,
    fans: FANS.length,
    chatters: CHATTERS.length,
    transactions: TRANSACTIONS.length,
    messages: MESSAGES.length,
    totalRevenue: metrics.totalRevenue,
    breakdown,
    topCreator: getCreatorById(metrics.topCreatorId)?.displayName,
    topFan: getFanById(metrics.topFanId)?.username,
    avgRevenuePerFan: metrics.avgRevenuePerFan,
    fansByTier: {
      whale: FANS.filter((f) => f.tier === "whale").length,
      high: FANS.filter((f) => f.tier === "high").length,
      medium: FANS.filter((f) => f.tier === "medium").length,
      low: FANS.filter((f) => f.tier === "low").length,
    },
  };
}

// ============================================================================
// CAMPAIGN GENERATION (18 campaigns with realistic performance data)
// ============================================================================

export const CAMPAIGNS: Campaign[] = [
  // ===== ACTIVE CAMPAIGNS (3) =====
  {
    id: "campaign_active_1",
    name: "Holiday Weekend Special",
    type: "ppv",
    status: "sending",
    creatorIds: ["creator_1"],
    fanSegment: {
      name: "Active High Spenders",
      filters: {
        tiers: ["whale", "high"],
        subscriptionStatus: ["active"],
        lastActiveWithin: 7,
      },
      fanCount: 74,
    },
    estimatedReach: 74,
    messageTemplate:
      "Hey babe! 🔥 I just finished a special photoshoot for the holiday weekend... The shots came out AMAZING and I wanted to share them with my best supporters first 💕 Unlock now?",
    mediaUrls: ["/campaigns/holiday-preview.jpg"],
    ppvPrice: 35,
    sendRate: 120,
    sentCount: 52,
    deliveredCount: 52,
    openRate: 54,
    responseRate: 28,
    revenue: 504.0,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    createdBy: "chatter_1",
  },
  {
    id: "campaign_active_2",
    name: "Re-engagement: Expired Subs",
    type: "reengagement",
    status: "sending",
    creatorIds: ["creator_2"],
    fanSegment: {
      name: "Recently Expired",
      filters: {
        tiers: ["high", "medium"],
        subscriptionStatus: ["expired"],
        lastActiveWithin: 30,
      },
      fanCount: 48,
    },
    estimatedReach: 48,
    messageTemplate:
      "I noticed you've been away for a bit... I miss chatting with you! 💔 I've been posting some of my best content lately. Come back and I'll send you something special 😘",
    sendRate: 80,
    sentCount: 34,
    deliveredCount: 33,
    openRate: 41,
    responseRate: 15,
    revenue: 159.6,
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    createdBy: "chatter_2",
  },
  {
    id: "campaign_active_3",
    name: "VIP Exclusive Preview",
    type: "ppv",
    status: "sending",
    creatorIds: ["creator_1", "creator_2"],
    fanSegment: {
      name: "Whale Tier Only",
      filters: {
        tiers: ["whale"],
        subscriptionStatus: ["active"],
        hasPurchasedPPV: true,
      },
      fanCount: 42,
    },
    estimatedReach: 42,
    messageTemplate:
      "VIP ACCESS ONLY 👑 Hey gorgeous, you've been such an incredible supporter... I have something VERY special for my top fans. This content isn't for everyone. Interested? 😈",
    mediaUrls: ["/campaigns/vip-teaser.jpg"],
    ppvPrice: 75,
    sendRate: 60,
    sentCount: 28,
    deliveredCount: 28,
    openRate: 68,
    responseRate: 32,
    revenue: 672.0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdBy: "chatter_1",
  },

  // ===== COMPLETED CAMPAIGNS (8) - Last 30 days =====
  {
    id: "campaign_completed_1",
    name: "Beach Photoshoot Exclusive",
    type: "ppv",
    status: "completed",
    creatorIds: ["creator_1"],
    fanSegment: {
      name: "Whales Only",
      filters: {
        tiers: ["whale"],
        subscriptionStatus: ["active"],
      },
      fanCount: 23,
    },
    estimatedReach: 23,
    messageTemplate:
      "Just got back from the beach and WOW... these photos are incredible 🏖️ Wearing that bikini you asked about! Want exclusive access? Only $50 for the full set 📸",
    mediaUrls: ["/campaigns/beach-preview.jpg"],
    ppvPrice: 50,
    sentCount: 23,
    deliveredCount: 23,
    openRate: 67,
    responseRate: 30,
    revenue: 3450.0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_1",
  },
  {
    id: "campaign_completed_2",
    name: "Weekend Special 50% Off",
    type: "promotion",
    status: "completed",
    creatorIds: ["creator_2", "creator_3"],
    fanSegment: {
      name: "All Active Subscribers",
      filters: {
        subscriptionStatus: ["active"],
      },
      fanCount: 500,
    },
    estimatedReach: 500,
    messageTemplate:
      "WEEKEND SPECIAL! 🎉 I'm feeling generous... 50% off ALL content this weekend only! First come, first served 💕",
    sendRate: 250,
    sentCount: 500,
    deliveredCount: 492,
    openRate: 42,
    responseRate: 12,
    revenue: 1476.0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_2",
  },
  {
    id: "campaign_completed_3",
    name: "Custom Request Available",
    type: "ppv",
    status: "completed",
    creatorIds: ["creator_1"],
    fanSegment: {
      name: "High Tier + PPV Buyers",
      filters: {
        tiers: ["whale", "high"],
        hasPurchasedPPV: true,
        lastActiveWithin: 14,
      },
      fanCount: 68,
    },
    estimatedReach: 68,
    messageTemplate:
      "Hey! You've been asking about custom content... I finally have time this week! 💕 I can create something special just for you. $35 for a personalized set. Interested? 😘",
    ppvPrice: 35,
    sendRate: 100,
    sentCount: 68,
    deliveredCount: 68,
    openRate: 58,
    responseRate: 24,
    revenue: 571.2,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_1",
  },
  {
    id: "campaign_completed_4",
    name: "New Lingerie Set 🔥",
    type: "ppv",
    status: "completed",
    creatorIds: ["creator_2"],
    fanSegment: {
      name: "Medium/High Tier Active",
      filters: {
        tiers: ["medium", "high"],
        subscriptionStatus: ["active"],
        lastActiveWithin: 10,
      },
      fanCount: 152,
    },
    estimatedReach: 152,
    messageTemplate:
      "Just got this new lingerie set and OMG 😍 It's absolutely stunning! Shot some photos in it just for you... $25 to unlock the full set 💋",
    mediaUrls: ["/campaigns/lingerie-preview.jpg"],
    ppvPrice: 25,
    sendRate: 150,
    sentCount: 152,
    deliveredCount: 149,
    openRate: 39,
    responseRate: 16,
    revenue: 608.0,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_2",
  },
  {
    id: "campaign_completed_5",
    name: "Behind The Scenes - Photoshoot Day",
    type: "ppv",
    status: "completed",
    creatorIds: ["creator_1"],
    fanSegment: {
      name: "All PPV Buyers",
      filters: {
        hasPurchasedPPV: true,
        subscriptionStatus: ["active"],
      },
      fanCount: 89,
    },
    estimatedReach: 89,
    messageTemplate:
      "Had the BEST photoshoot day yesterday! 📸 Got tons of behind-the-scenes content, outtakes, and some shots that didn't make the main feed 😏 $30 for full access!",
    ppvPrice: 30,
    sendRate: 120,
    sentCount: 89,
    deliveredCount: 88,
    openRate: 51,
    responseRate: 21,
    revenue: 561.6,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_1",
  },
  {
    id: "campaign_completed_6",
    name: "Good Morning Message ☀️",
    type: "custom",
    status: "completed",
    creatorIds: ["creator_3"],
    fanSegment: {
      name: "Active Chatters",
      filters: {
        subscriptionStatus: ["active"],
        lastActiveWithin: 3,
      },
      fanCount: 127,
    },
    estimatedReach: 127,
    messageTemplate:
      "Good morning handsome! ☀️ Just wanted to say hi and brighten your day 💕 How are you doing today?",
    sendRate: 200,
    sentCount: 127,
    deliveredCount: 125,
    openRate: 71,
    responseRate: 8,
    revenue: 0,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_3",
  },
  {
    id: "campaign_completed_7",
    name: "Exclusive Shower Content 💦",
    type: "ppv",
    status: "completed",
    creatorIds: ["creator_2"],
    fanSegment: {
      name: "High Value Active",
      filters: {
        tiers: ["whale", "high"],
        subscriptionStatus: ["active"],
        minSpend: 500,
      },
      fanCount: 45,
    },
    estimatedReach: 45,
    messageTemplate:
      "Just got out of the shower and feeling extra generous 💦 Took some really intimate photos... they're not for everyone but I think you'd love them 😘 $40 to unlock",
    mediaUrls: ["/campaigns/shower-preview.jpg"],
    ppvPrice: 40,
    sendRate: 90,
    sentCount: 45,
    deliveredCount: 45,
    openRate: 64,
    responseRate: 27,
    revenue: 486.0,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_2",
  },
  {
    id: "campaign_completed_8",
    name: "Monthly Appreciation Message",
    type: "custom",
    status: "completed",
    creatorIds: ["creator_1", "creator_2", "creator_3"],
    fanSegment: {
      name: "All Active Subscribers",
      filters: {
        subscriptionStatus: ["active"],
      },
      fanCount: 880,
    },
    estimatedReach: 880,
    messageTemplate:
      "Hey babe! Just wanted to say thank you SO much for being a subscriber 💕 You mean the world to me! More amazing content coming this week 🔥",
    sendRate: 300,
    sentCount: 880,
    deliveredCount: 862,
    openRate: 48,
    responseRate: 5,
    revenue: 0,
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_1",
  },

  // ===== SCHEDULED CAMPAIGNS (4) =====
  {
    id: "campaign_scheduled_1",
    name: "Late Night Vibes",
    type: "ppv",
    status: "scheduled",
    creatorIds: ["creator_1"],
    fanSegment: {
      name: "Night Owls - High Tier",
      filters: {
        tiers: ["whale", "high"],
        subscriptionStatus: ["active"],
        lastActiveWithin: 5,
      },
      fanCount: 62,
    },
    estimatedReach: 62,
    messageTemplate:
      "Can't sleep... thinking about you 🌙 Just took some really naughty photos in bed. Want to see? 😈 $45 for immediate access",
    ppvPrice: 45,
    scheduledAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now (late night)
    sendRate: 100,
    sentCount: 0,
    deliveredCount: 0,
    openRate: 0,
    responseRate: 0,
    revenue: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdBy: "chatter_1",
  },
  {
    id: "campaign_scheduled_2",
    name: "Gym Session Recovery",
    type: "ppv",
    status: "scheduled",
    creatorIds: ["creator_3"],
    fanSegment: {
      name: "Active Medium/High",
      filters: {
        tiers: ["medium", "high"],
        subscriptionStatus: ["active"],
      },
      fanCount: 118,
    },
    estimatedReach: 118,
    messageTemplate:
      "Just finished the most intense workout 💪 Took some post-gym mirror shots... still all sweaty 😅 Want to see? $20 for the set!",
    mediaUrls: ["/campaigns/gym-preview.jpg"],
    ppvPrice: 20,
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    sendRate: 150,
    sentCount: 0,
    deliveredCount: 0,
    openRate: 0,
    responseRate: 0,
    revenue: 0,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    createdBy: "chatter_3",
  },
  {
    id: "campaign_scheduled_3",
    name: "Weekend Getaway Preview",
    type: "ppv",
    status: "scheduled",
    creatorIds: ["creator_2"],
    fanSegment: {
      name: "Whales + Previous PPV Buyers",
      filters: {
        tiers: ["whale"],
        hasPurchasedPPV: true,
      },
      fanCount: 19,
    },
    estimatedReach: 19,
    messageTemplate:
      "Going on a weekend getaway and bringing my camera 📸 Want exclusive access to all the content I create there? Pre-order now for $60 (worth $100+) 🏖️",
    ppvPrice: 60,
    scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days
    sendRate: 50,
    sentCount: 0,
    deliveredCount: 0,
    openRate: 0,
    responseRate: 0,
    revenue: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_2",
  },
  {
    id: "campaign_scheduled_4",
    name: "Flash Sale - 24hr Only",
    type: "promotion",
    status: "scheduled",
    creatorIds: ["creator_1", "creator_2"],
    fanSegment: {
      name: "All Active Fans",
      filters: {
        subscriptionStatus: ["active"],
        lastActiveWithin: 30,
      },
      fanCount: 670,
    },
    estimatedReach: 670,
    messageTemplate:
      "🚨 FLASH SALE 🚨 Next 24 hours ONLY - All PPV content 40% off! This is the biggest discount I've ever done 💕 Don't miss out!",
    scheduledAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days
    sendRate: 300,
    sentCount: 0,
    deliveredCount: 0,
    openRate: 0,
    responseRate: 0,
    revenue: 0,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    createdBy: "chatter_1",
  },

  // ===== DRAFT CAMPAIGNS (3) =====
  {
    id: "campaign_draft_1",
    name: "Red Dress Photoshoot",
    type: "ppv",
    status: "draft",
    creatorIds: ["creator_1"],
    fanSegment: {
      name: "High Spenders",
      filters: {
        tiers: ["whale", "high"],
        minSpend: 500,
      },
      fanCount: 52,
    },
    estimatedReach: 52,
    messageTemplate:
      "Remember that red dress you asked about? Well... I wore it for a private shoot and the photos are FIRE 🔥 Want first access?",
    ppvPrice: 0, // Not set yet
    sentCount: 0,
    deliveredCount: 0,
    openRate: 0,
    responseRate: 0,
    revenue: 0,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    createdBy: "chatter_1",
  },
  {
    id: "campaign_draft_2",
    name: "Win-Back: Inactive Subscribers",
    type: "reengagement",
    status: "draft",
    creatorIds: ["creator_2", "creator_3"],
    fanSegment: {
      name: "Inactive 30+ Days",
      filters: {
        subscriptionStatus: ["active"],
        tiers: ["medium", "high", "whale"],
      },
      fanCount: 0, // Not calculated yet
    },
    estimatedReach: 0,
    messageTemplate: "", // Not written yet
    sentCount: 0,
    deliveredCount: 0,
    openRate: 0,
    responseRate: 0,
    revenue: 0,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    createdBy: "chatter_2",
  },
  {
    id: "campaign_draft_3",
    name: "Birthday Month Special",
    type: "custom",
    status: "draft",
    creatorIds: ["creator_1"],
    fanSegment: {
      name: "All Active",
      filters: {
        subscriptionStatus: ["active"],
      },
      fanCount: 380,
    },
    estimatedReach: 380,
    messageTemplate:
      "It's my birthday month! 🎂 To celebrate, I'm giving all my subscribers something special...",
    sentCount: 0,
    deliveredCount: 0,
    openRate: 0,
    responseRate: 0,
    revenue: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdBy: "chatter_1",
  },
];

// Add A/B test variants to one completed campaign
CAMPAIGNS.find((c) => c.id === "campaign_completed_1")!.variants = [
  {
    id: "variant_a",
    name: 'Variant A: "Hey babe! 🔥"',
    messageTemplate:
      "Hey babe! 🔥 Just got back from the beach and WOW... these photos are incredible 🏖️ Wearing that bikini you asked about! Want exclusive access? Only $50 for the full set 📸",
    trafficSplit: 50,
    performance: {
      sent: 12,
      opened: 8,
      responded: 4,
      revenue: 200.0,
    },
  },
  {
    id: "variant_b",
    name: 'Variant B: "Exclusive for you 💕"',
    messageTemplate:
      "Exclusive for you 💕 I just finished an amazing beach photoshoot in that bikini you mentioned... The photos came out perfect! $50 for VIP access to the full collection 📸",
    trafficSplit: 50,
    performance: {
      sent: 11,
      opened: 7,
      responded: 3,
      revenue: 150.0,
    },
  },
];

// ============================================================================
// SHIFT TEMPLATES GENERATION
// ============================================================================

export const SHIFT_TEMPLATES: ShiftTemplate[] = [
  {
    id: "template_1",
    name: "Weekday Morning",
    chatterId: "chatter_1", // Sarah Martinez
    creatorIds: ["creator_1", "creator_2"],
    startTime: "09:00",
    endTime: "13:00",
    daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
    isActive: true,
  },
  {
    id: "template_2",
    name: "Weekday Afternoon",
    chatterId: "chatter_2", // Alex Chen
    creatorIds: ["creator_1", "creator_2"],
    startTime: "13:00",
    endTime: "17:00",
    daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
    isActive: true,
  },
  {
    id: "template_3",
    name: "Evening Shift",
    chatterId: "chatter_3", // Jamie Wilson
    creatorIds: ["creator_2", "creator_3"],
    startTime: "17:00",
    endTime: "22:00",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
    isActive: true,
  },
  {
    id: "template_4",
    name: "Night Owl",
    chatterId: "chatter_4", // Chris Taylor
    creatorIds: ["creator_3"],
    startTime: "22:00",
    endTime: "02:00",
    daysOfWeek: [5, 6], // Friday, Saturday
    isActive: true,
  },
  {
    id: "template_5",
    name: "Weekend Morning",
    chatterId: "chatter_5", // Taylor Brooks
    creatorIds: ["creator_1"],
    startTime: "10:00",
    endTime: "14:00",
    daysOfWeek: [0, 6], // Saturday, Sunday
    isActive: true,
  },
];

// ============================================================================
// SHIFT GENERATION (Next 2 weeks of shifts)
// ============================================================================

function generateShifts(): Shift[] {
  const shifts: Shift[] = [];
  const now = new Date();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  // Generate scheduled shifts for next 2 weeks using templates
  SHIFT_TEMPLATES.forEach(template => {
    const currentDate = new Date(now);

    while (currentDate <= twoWeeksFromNow) {
      const dayOfWeek = currentDate.getDay();

      if (template.daysOfWeek.includes(dayOfWeek)) {
        const [startHour, startMinute] = template.startTime.split(':').map(Number);
        const [endHour, endMinute] = template.endTime.split(':').map(Number);

        const shiftStart = new Date(currentDate);
        shiftStart.setHours(startHour || 0, startMinute || 0, 0, 0);

        const shiftEnd = new Date(currentDate);
        // Handle shifts that cross midnight
        if ((endHour || 0) < (startHour || 0)) {
          shiftEnd.setDate(shiftEnd.getDate() + 1);
        }
        shiftEnd.setHours(endHour || 0, endMinute || 0, 0, 0);

        // Determine status based on time
        let status: Shift['status'] = 'scheduled';
        if (shiftStart < now && shiftEnd > now) {
          status = 'active';
        } else if (shiftEnd < now) {
          status = 'completed';
        }

        shifts.push({
          id: `shift_${template.id}_${currentDate.toISOString().split('T')[0]}_${startHour}`,
          chatterId: template.chatterId,
          creatorIds: template.creatorIds,
          startTime: shiftStart,
          endTime: shiftEnd,
          status,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  // Generate past completed shifts (last 2 weeks) with coverage data
  SHIFT_TEMPLATES.forEach(template => {
    const currentDate = new Date(twoWeeksAgo);

    while (currentDate < now) {
      const dayOfWeek = currentDate.getDay();

      if (template.daysOfWeek.includes(dayOfWeek)) {
        const [startHour, startMinute] = template.startTime.split(':').map(Number);
        const [endHour, endMinute] = template.endTime.split(':').map(Number);

        const shiftStart = new Date(currentDate);
        shiftStart.setHours(startHour || 0, startMinute || 0, 0, 0);

        const shiftEnd = new Date(currentDate);
        if ((endHour || 0) < (startHour || 0)) {
          shiftEnd.setDate(shiftEnd.getDate() + 1);
        }
        shiftEnd.setHours(endHour || 0, endMinute || 0, 0, 0);

        // Only add if shift has ended
        if (shiftEnd < now) {
          const shiftHours = (shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60 * 60);

          // Generate realistic coverage metrics based on chatter performance
          const chatter = CHATTERS.find(c => c.id === template.chatterId);
          const baseMessages = Math.floor(shiftHours * (20 + seededRandom() * 30)); // 20-50 messages per hour
          const baseRevenue = baseMessages * (8 + seededRandom() * 12); // $8-20 per message avg

          shifts.push({
            id: `shift_${template.id}_${currentDate.toISOString().split('T')[0]}_${startHour}_past`,
            chatterId: template.chatterId,
            creatorIds: template.creatorIds,
            startTime: shiftStart,
            endTime: shiftEnd,
            status: seededRandom() > 0.95 ? 'cancelled' : 'completed',
            coverage: seededRandom() > 0.95 ? undefined : {
              messagesHandled: Math.floor(baseMessages * (0.7 + seededRandom() * 0.6)),
              revenue: Math.round(baseRevenue * (0.7 + seededRandom() * 0.6) * 100) / 100,
              avgResponseTime: chatter ? chatter.avgResponseTime * (0.8 + seededRandom() * 0.4) : 5,
            },
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  // Add some one-off shifts for coverage or special events
  const specialShifts: Shift[] = [
    {
      id: "shift_special_1",
      chatterId: "chatter_1",
      creatorIds: ["creator_1", "creator_2", "creator_3"],
      startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 6 hour shift
      status: 'scheduled',
      handoffNotes: "Big campaign launch day - all creators need coverage",
    },
    {
      id: "shift_special_2",
      chatterId: "chatter_2",
      creatorIds: ["creator_1"],
      startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hour shift
      status: 'scheduled',
      handoffNotes: "VIP whale @mike2847 requested custom content - priority handling",
    },
  ];

  return [...shifts, ...specialShifts].sort((a, b) =>
    a.startTime.getTime() - b.startTime.getTime()
  );
}

export const SHIFTS: Shift[] = generateShifts();

// ============================================================================
// SHIFT HANDOFF GENERATION
// ============================================================================

function generateHandoffs(): ShiftHandoff[] {
  const handoffs: ShiftHandoff[] = [];

  // Generate handoffs for completed shifts where chatters changed
  const completedShifts = SHIFTS.filter(s => s.status === 'completed')
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  for (let i = 1; i < completedShifts.length; i++) {
    const prevShift = completedShifts[i - 1];
    const currentShift = completedShifts[i];

    if (!prevShift || !currentShift) continue;

    // Check if shifts are on same day and have same creator coverage
    const sameDayDiff = Math.abs(
      prevShift.endTime.getTime() - currentShift.startTime.getTime()
    ) < 2 * 60 * 60 * 1000; // Within 2 hours

    const sharedCreators = prevShift.creatorIds.filter(id =>
      currentShift.creatorIds.includes(id)
    );

    if (sameDayDiff && sharedCreators.length > 0 && prevShift.chatterId !== currentShift.chatterId) {
      // Generate realistic handoff notes
      const handoffNotes = [
        "Smooth handoff. VIP fan @john_doe mentioned interest in custom content - follow up today.",
        "Active conversation with @mike2847 about PPV unlock. Very warm lead, close to purchase.",
        "Whale fan @kevin5432 needs reply about custom request. Quoted $150, waiting for approval.",
        "@sarah9876 subscription expires tomorrow - sent renewal reminder, awaiting response.",
        "High-value fans all responded to morning messages. Good engagement today.",
        "PPV campaign performing well - 8 unlocks so far. Push remaining high-tier fans.",
        "@chris4521 asked about exclusive content. Interest level high, suggested $75 custom set.",
        "Quiet shift. All urgent messages handled. No high-priority follow-ups needed.",
        "Busy morning! 3 whales tipped generously. @mike2847 wants video call - needs scheduling.",
        "Campaign responses coming in. Track conversions closely for rest of day.",
      ];

      const urgentFansPool = [
        "@mike2847",
        "@john_doe",
        "@kevin5432",
        "@sarah9876",
        "@chris4521",
        "@david1234",
      ];

      const urgentFanCount = Math.floor(seededRandom() * 3); // 0-2 urgent fans
      const urgentFans = urgentFanCount > 0
        ? Array.from({ length: urgentFanCount }, () =>
            urgentFansPool[Math.floor(seededRandom() * urgentFansPool.length)]
          ).filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
        : undefined;

      handoffs.push({
        id: `handoff_${prevShift.id}_to_${currentShift.id}`,
        fromChatterId: prevShift.chatterId,
        toChatterId: currentShift.chatterId,
        shiftDate: currentShift.startTime,
        notes: handoffNotes[Math.floor(seededRandom() * handoffNotes.length)] || "Standard handoff",
        urgentFans,
        createdAt: new Date(currentShift.startTime.getTime() - 5 * 60 * 1000), // 5 min before shift
      });
    }
  }

  return handoffs.sort((a, b) => b.shiftDate.getTime() - a.shiftDate.getTime());
}

export const SHIFT_HANDOFFS: ShiftHandoff[] = generateHandoffs();

// ============================================================================
// AI CHAT ASSISTANT - KEYWORD ALERTS
// ============================================================================

export const KEYWORD_ALERTS: KeywordAlert[] = [
  {
    id: "kw_alert_1",
    keyword: "custom content",
    severity: "high",
    action: "auto_reply",
    responseTemplate: "I'd love to create something custom for you! 💕 What did you have in mind? I can do photos, videos, or personalized messages. Prices start at $35 for a custom photo set.",
    color: "#10b981", // green
  },
  {
    id: "kw_alert_2",
    keyword: "meet up",
    severity: "critical",
    action: "notify_manager",
    responseTemplate: "I appreciate the interest, but I keep all interactions online for safety and privacy. Let's keep chatting here where I can give you my full attention! 💕",
    color: "#ef4444", // red
  },
  {
    id: "kw_alert_3",
    keyword: "discount",
    severity: "medium",
    action: "flag",
    responseTemplate: "I don't usually do discounts, but since you're such a great supporter... I can offer you 15% off your next PPV unlock! 😘",
    color: "#f59e0b", // amber
  },
  {
    id: "kw_alert_4",
    keyword: "refund",
    severity: "critical",
    action: "notify_manager",
    responseTemplate: "I'm sorry you're not satisfied! Let me see what I can do to make this right. Can you tell me what happened?",
    color: "#ef4444", // red
  },
  {
    id: "kw_alert_5",
    keyword: "video call",
    severity: "high",
    action: "auto_reply",
    responseTemplate: "I do offer private video calls for my VIP supporters! 💕 They're $200 for 15 minutes. Would you like to schedule one?",
    color: "#8b5cf6", // purple
  },
  {
    id: "kw_alert_6",
    keyword: "cancel",
    severity: "high",
    action: "flag",
    responseTemplate: "I'd hate to see you go! 💔 Is there anything I can do to keep you as a subscriber? Maybe some exclusive content just for you?",
    color: "#f59e0b", // amber
  },
  {
    id: "kw_alert_7",
    keyword: "personal info",
    severity: "critical",
    action: "notify_manager",
    responseTemplate: "For privacy and safety, I prefer to keep personal details private. Let's keep our fun conversations here! 😊",
    color: "#ef4444", // red
  },
  {
    id: "kw_alert_8",
    keyword: "exclusive",
    severity: "medium",
    action: "auto_reply",
    responseTemplate: "I have tons of exclusive content available! 🔥 Are you interested in custom photos, videos, or something specific? I love creating personalized content for my best supporters!",
    color: "#3b82f6", // blue
  },
];

// ============================================================================
// AI CHAT ASSISTANT - MESSAGE TEMPLATES
// ============================================================================

export const MESSAGE_TEMPLATES_AI: MessageTemplate[] = [
  {
    id: "template_1",
    category: "greeting",
    name: "Welcome New Subscriber",
    message: "Hey babe! 😘 Thank you SO much for subscribing! I'm so excited to have you here. Feel free to message me anytime - I love chatting with my supporters! What kind of content do you like? 💕",
    usageCount: 234,
    avgConversionRate: 18.5,
    variables: ["fanName"],
  },
  {
    id: "template_2",
    category: "greeting",
    name: "Good Morning Message",
    message: "Good morning gorgeous! ☀️ Hope you have an amazing day today! I've got some new content coming later... stay tuned 😉",
    usageCount: 892,
    avgConversionRate: 12.3,
  },
  {
    id: "template_3",
    category: "ppv_pitch",
    name: "Exclusive Photo Set",
    message: "Hey! 🔥 I just finished an amazing photoshoot and the pictures came out INCREDIBLE! Want exclusive access? Only ${price} for the full set of {count} photos 📸",
    usageCount: 456,
    avgConversionRate: 34.2,
    variables: ["price", "count"],
  },
  {
    id: "template_4",
    category: "ppv_pitch",
    name: "Behind The Scenes",
    message: "I've got something special for you... 😘 Behind-the-scenes content from my latest shoot! Lots of outtakes and exclusive moments you won't see anywhere else. ${price} to unlock 💕",
    usageCount: 312,
    avgConversionRate: 28.7,
    variables: ["price"],
  },
  {
    id: "template_5",
    category: "custom_offer",
    name: "Custom Content Pitch",
    message: "You've been such an amazing supporter! 💕 I'd love to create something custom just for you. Tell me what you'd like to see and I'll make it happen! Custom sets start at ${basePrice} 😘",
    usageCount: 198,
    avgConversionRate: 42.1,
    variables: ["basePrice"],
  },
  {
    id: "template_6",
    category: "reengagement",
    name: "Win Back - Inactive Fan",
    message: "Hey stranger! 👋 I haven't heard from you in a while... I miss chatting with you! 💔 I've been posting some of my best content lately. Come say hi! 😘",
    usageCount: 267,
    avgConversionRate: 15.8,
  },
  {
    id: "template_7",
    category: "appreciation",
    name: "Thank You For Tip",
    message: "OMG thank you SO much for the tip! 😍 You just made my day! You're seriously the best. I really appreciate your support 💕💕",
    usageCount: 743,
    avgConversionRate: 8.2,
  },
  {
    id: "template_8",
    category: "appreciation",
    name: "VIP Recognition",
    message: "I just wanted to say... you're one of my absolute best supporters and I really appreciate you! 👑 You always make me smile. Thank you for being amazing! 💕",
    usageCount: 156,
    avgConversionRate: 22.4,
  },
];

// ============================================================================
// AI CHAT ASSISTANT - CONVERSATIONS
// ============================================================================

function generateConversations(): Conversation[] {
  const conversations: Conversation[] = [];

  // Helper to get recent messages for a fan
  const getRecentMessagesForFan = (fanId: string, count: number): ChatMessage[] => {
    const fanMessages = MESSAGES.filter(m => m.fanId === fanId)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
      .slice(0, count);

    return fanMessages.map((msg, idx) => ({
      id: msg.id,
      conversationId: `conv_${fanId}`,
      content: msg.content,
      sentBy: msg.sentBy === 'fan' ? 'fan' : 'chatter',
      sentAt: msg.sentAt,
      aiSuggestion: false,
      detectedKeywords: detectKeywordsInMessage(msg.content),
    }));
  };

  // Select diverse fans across all tiers
  const selectedFans = [
    // Whales (high priority)
    ...FANS.filter(f => f.tier === 'whale').slice(0, 8),
    // High tier
    ...FANS.filter(f => f.tier === 'high').slice(0, 12),
    // Medium tier
    ...FANS.filter(f => f.tier === 'medium').slice(0, 15),
    // Low tier
    ...FANS.filter(f => f.tier === 'low').slice(0, 10),
  ].slice(0, 45);

  selectedFans.forEach((fan, idx) => {
    const messages = getRecentMessagesForFan(fan.id, 3 + Math.floor(seededRandom() * 5));

    // Determine status and priority based on tier and recent activity
    let status: Conversation['status'] = 'active';
    let priority: Conversation['priority'] = 'normal';
    let unreadCount = 0;

    // Set priority based on tier
    if (fan.tier === 'whale') {
      priority = seededRandom() > 0.5 ? 'urgent' : 'high';
    } else if (fan.tier === 'high') {
      priority = seededRandom() > 0.6 ? 'high' : 'normal';
    } else if (fan.tier === 'medium') {
      priority = seededRandom() > 0.8 ? 'high' : 'normal';
    } else {
      priority = seededRandom() > 0.9 ? 'normal' : 'low';
    }

    // Some conversations are waiting for chatter response
    if (idx < 18) { // First 18 conversations are waiting
      status = 'waiting';
      unreadCount = Math.floor(1 + seededRandom() * 3); // 1-3 unread messages

      // Add a recent fan message to show they're waiting
      const recentFanMessages = [
        "Hey! Are you there?",
        "I'm interested! Tell me more 😊",
        "How much would that be?",
        "Yes please! I'd love to see that",
        "When can we do this?",
        "That sounds amazing! 😍",
        "I'm definitely interested",
        "Can you send me a preview?",
      ];

      messages.unshift({
        id: `msg_waiting_${fan.id}_${idx}`,
        conversationId: `conv_${fan.id}`,
        content: recentFanMessages[Math.floor(seededRandom() * recentFanMessages.length)] || "Hey!",
        sentBy: 'fan',
        sentAt: new Date(Date.now() - seededRandom() * 60 * 60 * 1000), // Within last hour
        aiSuggestion: false,
      });
    }

    const lastMessage = messages[0];

    conversations.push({
      id: `conv_${fan.id}`,
      fanId: fan.id,
      creatorId: fan.creatorId,
      chatterId: CHATTERS.filter(c => c.assignedCreators.includes(fan.creatorId))[0]?.id || 'chatter_1',
      lastMessageAt: lastMessage?.sentAt || fan.lastActiveAt,
      status,
      priority,
      unreadCount,
      messages: messages.reverse(), // Chronological order
      aiContext: {
        fanTier: fan.tier,
        totalSpent: fan.totalSpent,
        recentPurchases: TRANSACTIONS.filter(t => t.fanId === fan.id && t.type === 'ppv')
          .slice(0, 3)
          .map(t => t.description || 'PPV content'),
        engagementLevel: Math.min(100, Math.floor(
          (fan.messageCount * 0.3) +
          (fan.ppvPurchases * 5) +
          (fan.tipCount * 3) +
          (fan.tier === 'whale' ? 30 : fan.tier === 'high' ? 20 : fan.tier === 'medium' ? 10 : 0)
        )),
      },
    });
  });

  return conversations.sort((a, b) => {
    // Sort by priority first, then by last message time
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
  });
}

export const CONVERSATIONS: Conversation[] = generateConversations();

// ============================================================================
// AI CHAT ASSISTANT - AI SUGGESTIONS
// ============================================================================

function generateAISuggestions(): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  // Generate suggestions for waiting conversations only
  const waitingConversations = CONVERSATIONS.filter(c => c.status === 'waiting');

  waitingConversations.forEach((conv) => {
    const fan = getFanById(conv.fanId);
    if (!fan) return;

    const lastMessage = conv.messages[conv.messages.length - 1];
    if (!lastMessage || lastMessage.sentBy !== 'fan') return;

    const numSuggestions = 2 + Math.floor(seededRandom() * 2); // 2-3 suggestions per conversation

    for (let i = 0; i < numSuggestions; i++) {
      const suggestionType = i === 0 ? 'reply' :
                            i === 1 && fan.tier !== 'low' ? 'upsell' :
                            i === 1 && fan.tier === 'low' ? 'engagement' :
                            fan.ppvPurchases > 3 ? 'ppv' : 'engagement';

      let message = '';
      let confidence = 50;
      let reasoning = '';
      let suggestedPrice: number | undefined;

      switch (suggestionType) {
        case 'reply':
          const replyMessages = [
            "Hey babe! 💕 Yes I'm here! Sorry for the delay. How are you doing?",
            "Hi gorgeous! 😘 I'm here now! What's up?",
            "Hey! Sorry I missed this earlier. I'm all yours now 💕",
            "Hi! Yes I'm around! What can I do for you today? 😊",
          ];
          message = replyMessages[Math.floor(seededRandom() * replyMessages.length)] || replyMessages[0] || '';
          confidence = 75 + Math.floor(seededRandom() * 20);
          reasoning = "Standard greeting response to re-engage the fan";
          break;

        case 'upsell':
          const basePrice = fan.tier === 'whale' ? 50 + Math.floor(seededRandom() * 50) :
                           fan.tier === 'high' ? 30 + Math.floor(seededRandom() * 30) :
                           20 + Math.floor(seededRandom() * 20);
          suggestedPrice = basePrice;

          message = `I'd love to! 💕 I actually have some exclusive content that I think you'd really enjoy... Want to see? Only $${basePrice} to unlock the full set 🔥`;
          confidence = fan.ppvPurchases > 5 ? 85 : fan.ppvPurchases > 2 ? 70 : 60;
          reasoning = `Fan has purchased ${fan.ppvPurchases} PPV items before. ${fan.tier} tier with $${fan.totalSpent} total spent. High likelihood of conversion.`;
          break;

        case 'ppv':
          const ppvPrice = fan.tier === 'whale' ? 60 + Math.floor(seededRandom() * 40) :
                          fan.tier === 'high' ? 35 + Math.floor(seededRandom() * 25) :
                          25 + Math.floor(seededRandom() * 15);
          suggestedPrice = ppvPrice;

          message = `OMG I have something PERFECT for you! 😍 Just finished a photoshoot and got some incredible shots. $${ppvPrice} for exclusive access. You'll love it! 💕`;
          confidence = Math.min(90, 60 + (fan.ppvPurchases * 5));
          reasoning = `Fan is a ${fan.tier} tier spender with ${fan.ppvPurchases} previous PPV purchases. Strong PPV buyer profile.`;
          break;

        case 'engagement':
          const engagementMessages = [
            "That's so sweet! 🥰 How has your week been going?",
            "Aww you're the best! 💕 Have you seen my latest posts?",
            "You always know how to make me smile! 😊 What have you been up to?",
            "I appreciate you so much! 💕 Are you enjoying the content?",
          ];
          message = engagementMessages[Math.floor(seededRandom() * engagementMessages.length)] || engagementMessages[0] || '';
          confidence = 65 + Math.floor(seededRandom() * 15);
          reasoning = "Build rapport and engagement before making sales pitch";
          break;
      }

      suggestions.push({
        id: `suggestion_${conv.id}_${i}`,
        conversationId: conv.id,
        type: suggestionType as AISuggestion['type'],
        message,
        confidence,
        reasoning,
        suggestedPrice,
        createdAt: new Date(Date.now() - seededRandom() * 10 * 60 * 1000), // Within last 10 min
      });
    }
  });

  return suggestions;
}

export const AI_SUGGESTIONS: AISuggestion[] = generateAISuggestions();

// ============================================================================
// AI CHAT ASSISTANT - HELPER FUNCTIONS
// ============================================================================

/**
 * Detect keywords in message content
 */
function detectKeywordsInMessage(content: string): string[] {
  const lowerContent = content.toLowerCase();
  const detectedKeywords: string[] = [];

  KEYWORD_ALERTS.forEach(alert => {
    if (lowerContent.includes(alert.keyword.toLowerCase())) {
      detectedKeywords.push(alert.keyword);
    }
  });

  return detectedKeywords;
}

/**
 * Get conversation by ID
 */
export function getConversationById(id: string): Conversation | undefined {
  return CONVERSATIONS.find(c => c.id === id);
}

/**
 * Get all conversations for a specific chatter
 */
export function getConversationsByChatter(chatterId: string): Conversation[] {
  return CONVERSATIONS.filter(c => c.chatterId === chatterId);
}

/**
 * Get conversations by status
 */
export function getConversationsByStatus(status: Conversation['status']): Conversation[] {
  return CONVERSATIONS.filter(c => c.status === status);
}

/**
 * Get AI suggestions for a specific conversation
 */
export function getSuggestionsByConversation(conversationId: string): AISuggestion[] {
  return AI_SUGGESTIONS.filter(s => s.conversationId === conversationId)
    .sort((a, b) => b.confidence - a.confidence);
}

/**
 * Get message templates by category
 */
export function getTemplatesByCategory(category: MessageTemplate['category']): MessageTemplate[] {
  return MESSAGE_TEMPLATES_AI.filter(t => t.category === category)
    .sort((a, b) => b.avgConversionRate - a.avgConversionRate);
}

/**
 * Get all waiting conversations (needs chatter response)
 */
export function getWaitingConversations(): Conversation[] {
  return CONVERSATIONS.filter(c => c.status === 'waiting')
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
    });
}

/**
 * Get keyword alert by keyword
 */
export function getKeywordAlert(keyword: string): KeywordAlert | undefined {
  return KEYWORD_ALERTS.find(alert =>
    alert.keyword.toLowerCase() === keyword.toLowerCase()
  );
}

/**
 * Get high-confidence AI suggestions across all conversations
 */
export function getHighConfidenceSuggestions(minConfidence: number = 75): AISuggestion[] {
  return AI_SUGGESTIONS.filter(s => s.confidence >= minConfidence)
    .sort((a, b) => b.confidence - a.confidence);
}

// ============================================================================
// MUTATION FUNCTIONS
// ============================================================================

/**
 * Add a new creator to the system
 */
export function addCreator(
  creatorData: Omit<Creator, "id" | "totalRevenue" | "totalFans" | "activeFans" | "joinedAt">
): Creator {
  const newCreator: Creator = {
    ...creatorData,
    id: `creator_${Date.now()}`,
    totalRevenue: 0,
    totalFans: 0,
    activeFans: 0,
    joinedAt: new Date(),
  };

  CREATORS.push(newCreator);
  return newCreator;
}

/**
 * Archive a creator (set status to suspended and remove from active list)
 */
export function archiveCreator(creatorId: string): boolean {
  const index = CREATORS.findIndex(c => c.id === creatorId);

  if (index === -1) return false;

  // Remove creator from array
  CREATORS.splice(index, 1);

  // In a real app, you would:
  // 1. Update status to 'archived' in database
  // 2. Stop sync jobs
  // 3. Keep all historical data

  return true;
}

// ============================================================================
// SHIFT DATA ACCESS FUNCTIONS
// ============================================================================

/**
 * Get shift by ID
 */
export function getShiftById(id: string): Shift | undefined {
  return SHIFTS.find(s => s.id === id);
}

/**
 * Get all shifts for a specific chatter
 */
export function getShiftsByChatter(chatterId: string): Shift[] {
  return SHIFTS.filter(s => s.chatterId === chatterId);
}

/**
 * Get all shifts covering a specific creator
 */
export function getShiftsByCreator(creatorId: string): Shift[] {
  return SHIFTS.filter(s => s.creatorIds.includes(creatorId));
}

/**
 * Get shifts within a date range
 */
export function getShiftsInDateRange(startDate: Date, endDate: Date): Shift[] {
  return SHIFTS.filter(
    s =>
      (s.startTime >= startDate && s.startTime <= endDate) ||
      (s.endTime >= startDate && s.endTime <= endDate) ||
      (s.startTime <= startDate && s.endTime >= endDate)
  );
}

/**
 * Get currently active shifts
 */
export function getActiveShifts(): Shift[] {
  return SHIFTS.filter(s => s.status === 'active');
}

/**
 * Get upcoming scheduled shifts
 */
export function getUpcomingShifts(limit?: number): Shift[] {
  const now = new Date();
  const upcoming = SHIFTS.filter(s => s.status === 'scheduled' && s.startTime > now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return limit ? upcoming.slice(0, limit) : upcoming;
}

/**
 * Get shift handoff by ID
 */
export function getHandoffById(id: string): ShiftHandoff | undefined {
  return SHIFT_HANDOFFS.find(h => h.id === id);
}

/**
 * Get handoffs for a specific chatter (either from or to)
 */
export function getHandoffsByChatter(chatterId: string): ShiftHandoff[] {
  return SHIFT_HANDOFFS.filter(
    h => h.fromChatterId === chatterId || h.toChatterId === chatterId
  );
}

/**
 * Get recent handoffs (last N days)
 */
export function getRecentHandoffs(days: number = 7): ShiftHandoff[] {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return SHIFT_HANDOFFS.filter(h => h.createdAt >= cutoff)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get shift template by ID
 */
export function getTemplateById(id: string): ShiftTemplate | undefined {
  return SHIFT_TEMPLATES.find(t => t.id === id);
}

/**
 * Get all active shift templates
 */
export function getActiveTemplates(): ShiftTemplate[] {
  return SHIFT_TEMPLATES.filter(t => t.isActive);
}

/**
 * Get templates for a specific chatter
 */
export function getTemplatesByChatter(chatterId: string): ShiftTemplate[] {
  return SHIFT_TEMPLATES.filter(t => t.chatterId === chatterId);
}

// ============================================================================
// CONTENT VAULT HELPER FUNCTIONS
// ============================================================================

/**
 * Get content analytics for a creator
 */
export function getContentAnalytics(creatorId: string): ContentAnalytics {
  const items = MOCK_CONTENT_ITEMS.filter(item => item.creatorId === creatorId);
  const ppvItems = items.filter(item => item.isPPV);

  return {
    totalItems: items.length,
    totalSize: items.reduce((sum, item) => sum + item.fileSize, 0),
    ppvItems: ppvItems.length,
    ppvRevenue: ppvItems.reduce((sum, item) => sum + (item.ppvRevenue || 0), 0),
    publicItems: items.filter(item => item.isPublic).length,
    totalViews: items.reduce((sum, item) => sum + (item.publicViews || 0), 0),
    totalLikes: items.reduce((sum, item) => sum + (item.likes || 0), 0),
    topPerformingItems: ppvItems.sort((a, b) => (b.ppvRevenue || 0) - (a.ppvRevenue || 0)).slice(0, 5),
    revenueByMonth: [
      { month: "Sep", revenue: 3200 },
      { month: "Oct", revenue: 5835 },
    ],
  };
}

/**
 * Get sync preview for a connection
 */
export function getMockSyncPreview(connectionId: string): SyncPreview {
  return {
    newMessages: Math.floor(seededRandom() * 50) + 20,
    newSubscribers: Math.floor(seededRandom() * 5) + 1,
    newTransactions: Math.floor(seededRandom() * 15) + 5,
    newContent: Math.floor(seededRandom() * 3),
    estimatedDuration: Math.floor(seededRandom() * 120) + 60,
  };
}

/**
 * Get connection health status
 */
export function getConnectionHealth(connection: OnlyFansConnection): {
  status: 'healthy' | 'warning' | 'error';
  message: string;
} {
  if (connection.connectionStatus === 'error') {
    return { status: 'error', message: connection.errorMessage || 'Connection error' };
  }

  if (!connection.lastSyncAt) {
    return { status: 'warning', message: 'Never synced' };
  }

  const hoursSinceSync = (Date.now() - connection.lastSyncAt.getTime()) / (1000 * 60 * 60);

  if (hoursSinceSync > connection.syncInterval * 2) {
    return { status: 'warning', message: `Last sync ${Math.floor(hoursSinceSync)}h ago` };
  }

  return { status: 'healthy', message: 'All systems operational' };
}
