import {
  Creator,
  Fan,
  Chatter,
  Transaction,
  Message,
  AgencyMetrics,
  Alert,
} from "@/types";

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
    FAN_FIRST_NAMES[Math.floor(Math.random() * FAN_FIRST_NAMES.length)] || "user";
  const num = Math.floor(Math.random() * 9999);
  return `${first.toLowerCase()}${num}`;
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
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
      2000 + Math.random() * 8000 + Math.random() * 5000 * (i % 3); // $2k-$15k
    const messageCount = Math.floor(50 + Math.random() * 150);
    const tipCount = Math.floor(20 + Math.random() * 80);
    const ppvPurchases = Math.floor(10 + Math.random() * 40);

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
        now.getTime() - Math.random() * 48 * 60 * 60 * 1000
      ), // Within 48h
      tags: ["vip", "whale", "high-value"],
      riskScore: Math.floor(Math.random() * 20), // Low churn risk
    });
  }

  // Generate high tier (15%)
  for (let i = 0; i < highCount; i++) {
    const joinedAt = generateRandomDate(twoYearsAgo, now);
    const totalSpent = 500 + Math.random() * 1500; // $500-$2k
    const messageCount = Math.floor(20 + Math.random() * 60);
    const tipCount = Math.floor(10 + Math.random() * 30);
    const ppvPurchases = Math.floor(5 + Math.random() * 20);

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
      subscriptionStatus: Math.random() > 0.1 ? "active" : "expired",
      subscriptionRenewsAt:
        Math.random() > 0.1
          ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          : undefined,
      joinedAt,
      lastActiveAt: new Date(
        now.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000
      ), // Within 5 days
      tags: ["high-value"],
      riskScore: Math.floor(20 + Math.random() * 30), // Medium churn risk
    });
  }

  // Generate medium tier (30%)
  for (let i = 0; i < mediumCount; i++) {
    const joinedAt = generateRandomDate(twoYearsAgo, now);
    const totalSpent = 100 + Math.random() * 400; // $100-$500
    const messageCount = Math.floor(5 + Math.random() * 25);
    const tipCount = Math.floor(2 + Math.random() * 15);
    const ppvPurchases = Math.floor(1 + Math.random() * 10);

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
      subscriptionStatus: Math.random() > 0.2 ? "active" : "expired",
      subscriptionRenewsAt:
        Math.random() > 0.2
          ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          : undefined,
      joinedAt,
      lastActiveAt: new Date(
        now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000
      ), // Within 10 days
      riskScore: Math.floor(40 + Math.random() * 30), // Higher churn risk
    });
  }

  // Generate low tier (50%)
  for (let i = 0; i < lowCount; i++) {
    const joinedAt = generateRandomDate(twoYearsAgo, now);
    const totalSpent = 20 + Math.random() * 80; // $20-$100
    const messageCount = Math.floor(Math.random() * 10);
    const tipCount = Math.floor(Math.random() * 5);
    const ppvPurchases = Math.floor(Math.random() * 3);

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
      subscriptionStatus: Math.random() > 0.4 ? "active" : "expired",
      subscriptionRenewsAt:
        Math.random() > 0.4
          ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          : undefined,
      joinedAt,
      lastActiveAt: new Date(
        now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ), // Within 30 days
      riskScore: Math.floor(60 + Math.random() * 40), // High churn risk
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
    assignedChatters[Math.floor(Math.random() * assignedChatters.length)];

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
      if (Math.random() > 0.3) continue; // 70% more likely on weekends
    }

    const tipAmount =
      fan.tier === "whale"
        ? tipAmounts[Math.floor(Math.random() * tipAmounts.length)] || 10
        : fan.tier === "high"
          ? tipAmounts[Math.floor(Math.random() * 5)] || 10
          : fan.tier === "medium"
            ? tipAmounts[Math.floor(Math.random() * 3)] || 5
            : tipAmounts[Math.floor(Math.random() * 2)] || 5;

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
        ? 20 + Math.random() * 80 // $20-$100
        : fan.tier === "high"
          ? 15 + Math.random() * 35 // $15-$50
          : 10 + Math.random() * 20; // $10-$30

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

  // Message unlocks
  const messageUnlocks = Math.floor(fan.messageCount * 0.3); // 30% of messages are paid
  for (let i = 0; i < messageUnlocks; i++) {
    const msgDate = generateRandomDate(startDate, now);
    const msgAmount = 3 + Math.random() * 12; // $3-$15

    transactions.push({
      id: `txn_${fan.id}_msg_${transactionCounter++}`,
      fanId: fan.id,
      creatorId: fan.creatorId,
      chatterId: randomChatter?.id,
      type: "message",
      amount: Math.round(msgAmount * 100) / 100,
      description: "Unlock exclusive message",
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
    assignedChatters[Math.floor(Math.random() * assignedChatters.length)];

  const messageCount = Math.floor(
    fan.messageCount * 0.4 + Math.random() * fan.messageCount * 0.3
  ); // 40-70% of total messages in last 30 days

  for (let i = 0; i < messageCount; i++) {
    const msgDate = generateRandomDate(startDate, now);
    const isFanMessage = i % 3 === 0; // Roughly 1/3 from fan, 2/3 from creator

    if (isFanMessage) {
      const template =
        MESSAGE_TEMPLATES.fan_greetings[
          Math.floor(Math.random() * MESSAGE_TEMPLATES.fan_greetings.length)
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
      const rand = Math.random();
      let template: string;
      let type: "text" | "media" | "ppv_offer" = "text";

      if (rand > 0.8 && fan.tier !== "low") {
        // 20% PPV offers for higher tiers
        template =
          MESSAGE_TEMPLATES.ppv_offers[
            Math.floor(Math.random() * MESSAGE_TEMPLATES.ppv_offers.length)
          ] || "Special content available!";
        type = "ppv_offer";
      } else if (rand > 0.6 && fan.tier === "whale") {
        // Upsells for whales
        template =
          MESSAGE_TEMPLATES.upsells[
            Math.floor(Math.random() * MESSAGE_TEMPLATES.upsells.length)
          ] || "Custom content available!";
        type = "text";
      } else {
        template =
          MESSAGE_TEMPLATES.creator_responses[
            Math.floor(
              Math.random() * MESSAGE_TEMPLATES.creator_responses.length
            )
          ] || "Thanks!";
        type = Math.random() > 0.7 ? "media" : "text";
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
        read: Math.random() > 0.2, // 80% read rate
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
