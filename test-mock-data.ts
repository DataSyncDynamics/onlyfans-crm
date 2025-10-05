import {
  getDataSummary,
  FANS,
  TRANSACTIONS,
  CREATORS,
  CHATTERS,
} from "./src/lib/mock-data";

console.log("=".repeat(60));
console.log("ONLYFANS AGENCY CRM - MOCK DATA SUMMARY");
console.log("=".repeat(60));

const summary = getDataSummary();

console.log("\n📊 DATA COUNTS:");
console.log("  Creators:", summary.creators);
console.log("  Fans:", summary.fans);
console.log("  Chatters:", summary.chatters);
console.log("  Transactions:", summary.transactions);
console.log("  Messages:", summary.messages);

console.log("\n💰 REVENUE METRICS:");
console.log("  Total Revenue:", "$" + summary.totalRevenue.toLocaleString());
console.log("  Avg per Fan:", "$" + summary.avgRevenuePerFan.toFixed(2));

console.log("\n📈 REVENUE BREAKDOWN:");
console.log(
  "  Subscriptions:",
  "$" + summary.breakdown.subscriptions.toLocaleString()
);
console.log("  Tips:", "$" + summary.breakdown.tips.toLocaleString());
console.log("  PPV:", "$" + summary.breakdown.ppv.toLocaleString());
console.log("  Messages:", "$" + summary.breakdown.messages.toLocaleString());

console.log("\n👥 FAN TIERS (Pareto Distribution):");
console.log("  Whales (5%):", summary.fansByTier.whale, "fans");
console.log("  High (15%):", summary.fansByTier.high, "fans");
console.log("  Medium (30%):", summary.fansByTier.medium, "fans");
console.log("  Low (50%):", summary.fansByTier.low, "fans");

console.log("\n🏆 TOP PERFORMERS:");
console.log("  Top Creator:", summary.topCreator);
console.log("  Top Fan:", summary.topFan);

console.log("\n🎯 PARETO VERIFICATION:");
const topTierFans = FANS.filter((f) => f.tier === "whale" || f.tier === "high");
const topTierRevenue = topTierFans.reduce((sum, f) => sum + f.totalSpent, 0);
const totalFanSpend = FANS.reduce((sum, f) => sum + f.totalSpent, 0);
const paretoPercentage = ((topTierRevenue / totalFanSpend) * 100).toFixed(1);
console.log("  Top 20% of fans generate", paretoPercentage + "% of revenue");

console.log("\n📊 CREATOR BREAKDOWN:");
CREATORS.forEach((creator) => {
  const fans = FANS.filter((f) => f.creatorId === creator.id);
  const activeFans = fans.filter((f) => f.subscriptionStatus === "active");
  console.log(`\n  ${creator.displayName} (@${creator.ofUsername}):`);
  console.log(`    Total Fans: ${fans.length}`);
  console.log(`    Active Fans: ${activeFans.length}`);
  console.log(`    Revenue: $${creator.totalRevenue.toLocaleString()}`);
});

console.log("\n👨‍💼 CHATTER PERFORMANCE:");
CHATTERS.forEach((chatter) => {
  console.log(`\n  ${chatter.name} (${chatter.role}):`);
  console.log(`    Messages: ${chatter.messageCount.toLocaleString()}`);
  console.log(
    `    Revenue Generated: $${chatter.revenueGenerated.toLocaleString()}`
  );
  console.log(`    Performance Score: ${chatter.performanceScore}/100`);
  console.log(`    Avg Response: ${chatter.avgResponseTime} min`);
  console.log(`    Conversion Rate: ${chatter.conversionRate}%`);
});

console.log("\n" + "=".repeat(60));
console.log("✅ Mock data generated successfully!");
console.log("=".repeat(60));
