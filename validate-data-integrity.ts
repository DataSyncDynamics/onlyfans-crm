import {
  FANS,
  TRANSACTIONS,
  MESSAGES,
  CREATORS,
  CHATTERS,
  getTransactionsByFan,
} from "./src/lib/mock-data";

console.log("=".repeat(60));
console.log("DATA INTEGRITY VALIDATION");
console.log("=".repeat(60));

let errors = 0;
let warnings = 0;

// Test 1: Verify fan totalSpent matches transaction sum
console.log("\n✓ Testing fan totalSpent calculation...");
FANS.forEach((fan) => {
  const transactions = getTransactionsByFan(fan.id);
  const calculatedTotal = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const difference = Math.abs(calculatedTotal - fan.totalSpent);

  // Allow for small floating point differences
  if (difference > 5) {
    console.log(
      `  ❌ ERROR: Fan ${fan.username} totalSpent mismatch: ${fan.totalSpent} vs calculated ${calculatedTotal.toFixed(2)}`
    );
    errors++;
  }
});

// Test 2: All transactions have valid references
console.log("✓ Testing transaction references...");
TRANSACTIONS.forEach((txn) => {
  const fan = FANS.find((f) => f.id === txn.fanId);
  if (!fan) {
    console.log(`  ❌ ERROR: Transaction ${txn.id} references invalid fan ${txn.fanId}`);
    errors++;
  }

  const creator = CREATORS.find((c) => c.id === txn.creatorId);
  if (!creator) {
    console.log(
      `  ❌ ERROR: Transaction ${txn.id} references invalid creator ${txn.creatorId}`
    );
    errors++;
  }

  if (txn.chatterId) {
    const chatter = CHATTERS.find((c) => c.id === txn.chatterId);
    if (!chatter) {
      console.log(
        `  ❌ ERROR: Transaction ${txn.id} references invalid chatter ${txn.chatterId}`
      );
      errors++;
    }
  }
});

// Test 3: All messages have valid references
console.log("✓ Testing message references...");
MESSAGES.forEach((msg) => {
  const fan = FANS.find((f) => f.id === msg.fanId);
  if (!fan) {
    console.log(`  ❌ ERROR: Message ${msg.id} references invalid fan ${msg.fanId}`);
    errors++;
  }

  const creator = CREATORS.find((c) => c.id === msg.creatorId);
  if (!creator) {
    console.log(
      `  ❌ ERROR: Message ${msg.id} references invalid creator ${msg.creatorId}`
    );
    errors++;
  }
});

// Test 4: Verify tier distribution (Pareto)
console.log("✓ Testing Pareto distribution...");
const whaleCount = FANS.filter((f) => f.tier === "whale").length;
const highCount = FANS.filter((f) => f.tier === "high").length;
const mediumCount = FANS.filter((f) => f.tier === "medium").length;
const lowCount = FANS.filter((f) => f.tier === "low").length;
const total = FANS.length;

const whalePercent = (whaleCount / total) * 100;
const highPercent = (highCount / total) * 100;
const mediumPercent = (mediumCount / total) * 100;
const lowPercent = (lowCount / total) * 100;

console.log(`  Whale: ${whalePercent.toFixed(1)}% (target: ~5%)`);
console.log(`  High: ${highPercent.toFixed(1)}% (target: ~15%)`);
console.log(`  Medium: ${mediumPercent.toFixed(1)}% (target: ~30%)`);
console.log(`  Low: ${lowPercent.toFixed(1)}% (target: ~50%)`);

if (whalePercent < 3 || whalePercent > 7) {
  console.log(`  ⚠️  WARNING: Whale percentage out of range`);
  warnings++;
}

// Test 5: Verify revenue distribution follows Pareto
console.log("✓ Testing revenue Pareto (80/20 rule)...");
const topTierFans = FANS.filter((f) => f.tier === "whale" || f.tier === "high");
const topTierRevenue = topTierFans.reduce((sum, f) => sum + f.totalSpent, 0);
const totalRevenue = FANS.reduce((sum, f) => sum + f.totalSpent, 0);
const revenuePercent = (topTierRevenue / totalRevenue) * 100;

console.log(
  `  Top 20% of fans generate ${revenuePercent.toFixed(1)}% of revenue (target: ~80%)`
);

if (revenuePercent < 75 || revenuePercent > 90) {
  console.log(`  ⚠️  WARNING: Revenue distribution doesn't follow Pareto principle`);
  warnings++;
}

// Test 6: Verify transaction amounts are realistic
console.log("✓ Testing transaction amounts...");
TRANSACTIONS.forEach((txn) => {
  if (txn.amount <= 0) {
    console.log(`  ❌ ERROR: Transaction ${txn.id} has negative or zero amount`);
    errors++;
  }

  if (txn.type === "subscription" && txn.amount !== 9.99) {
    console.log(
      `  ❌ ERROR: Subscription ${txn.id} has incorrect amount: ${txn.amount}`
    );
    errors++;
  }

  if (txn.type === "tip" && txn.amount > 1000) {
    console.log(`  ⚠️  WARNING: Very large tip: $${txn.amount}`);
    warnings++;
  }
});

// Test 7: Verify fan subscriptions are active for recent fans
console.log("✓ Testing subscription status...");
const now = new Date();
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
FANS.forEach((fan) => {
  if (fan.joinedAt > thirtyDaysAgo && fan.subscriptionStatus === "expired") {
    console.log(
      `  ⚠️  WARNING: Fan ${fan.username} joined recently but subscription expired`
    );
    warnings++;
  }
});

// Test 8: Verify creator totals match aggregated data
console.log("✓ Testing creator totals...");
CREATORS.forEach((creator) => {
  const fans = FANS.filter((f) => f.creatorId === creator.id);
  if (fans.length !== creator.totalFans) {
    console.log(
      `  ❌ ERROR: Creator ${creator.displayName} totalFans mismatch: ${creator.totalFans} vs ${fans.length}`
    );
    errors++;
  }

  const activeFans = fans.filter((f) => f.subscriptionStatus === "active").length;
  if (activeFans !== creator.activeFans) {
    console.log(
      `  ❌ ERROR: Creator ${creator.displayName} activeFans mismatch: ${creator.activeFans} vs ${activeFans}`
    );
    errors++;
  }
});

// Test 9: Verify chatter assignments are valid
console.log("✓ Testing chatter assignments...");
CHATTERS.forEach((chatter) => {
  chatter.assignedCreators.forEach((creatorId) => {
    const creator = CREATORS.find((c) => c.id === creatorId);
    if (!creator) {
      console.log(
        `  ❌ ERROR: Chatter ${chatter.name} assigned to invalid creator ${creatorId}`
      );
      errors++;
    }
  });
});

// Test 10: Verify performance scores are in valid range
console.log("✓ Testing performance scores...");
CHATTERS.forEach((chatter) => {
  if (chatter.performanceScore < 0 || chatter.performanceScore > 100) {
    console.log(
      `  ❌ ERROR: Chatter ${chatter.name} has invalid performance score: ${chatter.performanceScore}`
    );
    errors++;
  }
});

console.log("\n" + "=".repeat(60));
if (errors === 0 && warnings === 0) {
  console.log("✅ ALL TESTS PASSED - Data integrity verified!");
} else {
  console.log(`⚠️  Tests completed with ${errors} errors and ${warnings} warnings`);
  if (errors > 0) {
    console.log("❌ Data integrity validation FAILED");
  } else {
    console.log("✅ Data integrity validation PASSED (with warnings)");
  }
}
console.log("=".repeat(60));
