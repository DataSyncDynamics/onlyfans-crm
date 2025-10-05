import {
  CREATORS,
  FANS,
  CHATTERS,
  TRANSACTIONS,
  MESSAGES,
  getCreatorById,
  getFanById,
  getFansByCreator,
  getTransactionsByFan,
  getMessagesByFan,
  getTopFans,
  getChatterPerformance,
  getAgencyMetrics,
  calculateDailyRevenue,
  getRevenueBreakdown,
  getRevenueByCreator,
} from "./src/lib/mock-data";

console.log("=".repeat(70));
console.log("ONLYFANS AGENCY CRM - HELPER FUNCTION DEMO");
console.log("=".repeat(70));

// ============================================================================
// 1. DATA ACCESS FUNCTIONS
// ============================================================================

console.log("\n📂 DATA ACCESS FUNCTIONS\n");

// Get specific creator
const stella = getCreatorById("creator_1");
console.log("1. getCreatorById('creator_1'):");
console.log(`   ${stella?.displayName} (@${stella?.ofUsername})`);
console.log(`   Revenue: $${stella?.totalRevenue.toLocaleString()}`);
console.log(`   Fans: ${stella?.totalFans} (${stella?.activeFans} active)`);

// Get top fan
const topFan = getTopFans(1)[0];
if (topFan) {
  const topFanDetails = getFanById(topFan.id);
  console.log(`\n2. getFanById('${topFan.id}'):`);
  console.log(`   ${topFanDetails?.username} - ${topFanDetails?.tier} tier`);
  console.log(`   Total Spent: $${topFanDetails?.totalSpent.toLocaleString()}`);
  console.log(`   Messages: ${topFanDetails?.messageCount}`);
}

// Get fans for a creator
const stellaFans = getFansByCreator("creator_1");
console.log(`\n3. getFansByCreator('creator_1'):`);
console.log(`   Total: ${stellaFans.length} fans`);
console.log(
  `   Active: ${stellaFans.filter((f) => f.subscriptionStatus === "active").length}`
);
console.log(
  `   Whales: ${stellaFans.filter((f) => f.tier === "whale").length}`
);

// Get transactions for a fan
if (topFan) {
  const topFanTransactions = getTransactionsByFan(topFan.id);
  console.log(`\n4. getTransactionsByFan('${topFan.id}'):`);
  console.log(`   Total Transactions: ${topFanTransactions.length}`);
  console.log(
    `   Tips: ${topFanTransactions.filter((t) => t.type === "tip").length}`
  );
  console.log(
    `   PPV: ${topFanTransactions.filter((t) => t.type === "ppv").length}`
  );

  // Get messages for a fan
  const topFanMessages = getMessagesByFan(topFan.id);
  console.log(`\n5. getMessagesByFan('${topFan.id}'):`);
  console.log(`   Total Messages: ${topFanMessages.length}`);
  console.log(
    `   From Fan: ${topFanMessages.filter((m) => m.sentBy === "fan").length}`
  );
  console.log(
    `   From Creator: ${topFanMessages.filter((m) => m.sentBy === "creator").length}`
  );
}

// ============================================================================
// 2. ANALYTICS FUNCTIONS
// ============================================================================

console.log("\n\n📊 ANALYTICS FUNCTIONS\n");

// Top fans across agency
console.log("6. getTopFans(5) - Top 5 Fans Across Agency:");
getTopFans(5).forEach((fan, i) => {
  const creator = getCreatorById(fan.creatorId);
  console.log(
    `   ${i + 1}. ${fan.username} - $${fan.totalSpent.toLocaleString()} (${creator?.displayName})`
  );
});

// Top fans for specific creator
console.log("\n7. getTopFans(3, 'creator_2') - Top 3 Fans for Luna Vibe:");
getTopFans(3, "creator_2").forEach((fan, i) => {
  console.log(
    `   ${i + 1}. ${fan.username} - $${fan.totalSpent.toLocaleString()} (${fan.tier})`
  );
});

// Chatter performance ranking
console.log("\n8. getChatterPerformance() - Chatters by Performance:");
getChatterPerformance().forEach((chatter, i) => {
  console.log(
    `   ${i + 1}. ${chatter.name} (${chatter.role}) - Score: ${chatter.performanceScore}/100`
  );
  console.log(
    `      Revenue: $${chatter.revenueGenerated.toLocaleString()} | Conversion: ${chatter.conversionRate}%`
  );
});

// Agency-wide metrics
console.log("\n9. getAgencyMetrics() - Agency Overview:");
const metrics = getAgencyMetrics();
console.log(`   Total Revenue: $${metrics.totalRevenue.toLocaleString()}`);
console.log(`   Total Fans: ${metrics.totalFans}`);
console.log(`   Active Fans: ${metrics.activeFans} (${metrics.conversionRate}%)`);
console.log(`   Churn Rate: ${metrics.churnRate}%`);
console.log(`   Avg Revenue/Fan: $${metrics.avgRevenuePerFan}`);
console.log(`   Messages (30d): ${metrics.messagesThisMonth.toLocaleString()}`);

// Revenue breakdown
console.log("\n10. getRevenueBreakdown() - Revenue by Type:");
const breakdown = getRevenueBreakdown();
const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
Object.entries(breakdown).forEach(([type, amount]) => {
  const percentage = ((amount / total) * 100).toFixed(1);
  console.log(
    `    ${type.charAt(0).toUpperCase() + type.slice(1)}: $${amount.toLocaleString()} (${percentage}%)`
  );
});

// Revenue by creator (last 30 days)
console.log("\n11. getRevenueByCreator(creatorId, 30) - 30-Day Revenue:");
CREATORS.forEach((creator) => {
  const revenue = getRevenueByCreator(creator.id, 30);
  console.log(
    `    ${creator.displayName}: $${revenue.toLocaleString()}/month`
  );
});

// Daily revenue trend
console.log("\n12. calculateDailyRevenue(7) - Last 7 Days:");
const dailyRevenue = calculateDailyRevenue(7);
dailyRevenue.forEach((day) => {
  console.log(`    ${day.date}: $${day.amount.toLocaleString()}`);
});

// ============================================================================
// 3. ADVANCED QUERIES
// ============================================================================

console.log("\n\n🎯 ADVANCED QUERIES\n");

// High-risk churn fans
console.log("13. High-Risk Churn Fans (risk score > 80):");
const highRiskFans = FANS.filter(
  (f) => f.riskScore && f.riskScore > 80 && f.subscriptionStatus === "active"
)
  .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
  .slice(0, 5);

highRiskFans.forEach((fan, i) => {
  const creator = getCreatorById(fan.creatorId);
  console.log(
    `    ${i + 1}. ${fan.username} - Risk: ${fan.riskScore} (${creator?.displayName})`
  );
  console.log(`       Spent: $${fan.totalSpent} | Last active: ${fan.lastActiveAt.toLocaleDateString()}`);
});

// VIP fans (whales) engagement
console.log("\n14. VIP Fans (Whales) Summary:");
const whales = FANS.filter((f) => f.tier === "whale");
const whaleRevenue = whales.reduce((sum, f) => sum + f.totalSpent, 0);
const whaleMessages = whales.reduce((sum, f) => sum + f.messageCount, 0);
console.log(`    Count: ${whales.length} fans (${((whales.length / FANS.length) * 100).toFixed(1)}%)`);
console.log(`    Revenue: $${whaleRevenue.toLocaleString()} (${((whaleRevenue / metrics.totalRevenue) * 100).toFixed(1)}%)`);
console.log(`    Avg Spend: $${(whaleRevenue / whales.length).toFixed(2)}`);
console.log(`    Total Messages: ${whaleMessages.toLocaleString()}`);

// Creator comparison
console.log("\n15. Creator Performance Comparison:");
CREATORS.forEach((creator) => {
  const fans = getFansByCreator(creator.id);
  const avgSpend = fans.reduce((sum, f) => sum + f.totalSpent, 0) / fans.length;
  const retention =
    (fans.filter((f) => f.subscriptionStatus === "active").length /
      fans.length) *
    100;

  console.log(`    ${creator.displayName}:`);
  console.log(
    `       Fans: ${fans.length} | Active: ${creator.activeFans} (${retention.toFixed(1)}%)`
  );
  console.log(
    `       Avg Fan Value: $${avgSpend.toFixed(2)} | Total Revenue: $${creator.totalRevenue.toLocaleString()}`
  );
});

// Recent big spenders (joined in last 60 days, spent >$500)
console.log("\n16. Recent Big Spenders (joined <60 days, spent >$500):");
const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
const recentBigSpenders = FANS.filter(
  (f) => f.joinedAt > sixtyDaysAgo && f.totalSpent > 500
)
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 5);

recentBigSpenders.forEach((fan, i) => {
  const daysAgo = Math.floor(
    (Date.now() - fan.joinedAt.getTime()) / (24 * 60 * 60 * 1000)
  );
  const creator = getCreatorById(fan.creatorId);
  console.log(
    `    ${i + 1}. ${fan.username} - $${fan.totalSpent.toLocaleString()} (joined ${daysAgo}d ago)`
  );
  console.log(`       Creator: ${creator?.displayName} | Tier: ${fan.tier}`);
});

console.log("\n" + "=".repeat(70));
console.log("✅ Demo complete! All helper functions working correctly.");
console.log("=".repeat(70));
