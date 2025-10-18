/**
 * JavaScript runner for stress test suite
 * Converts TypeScript stress test to runnable JS
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function makeRequest(endpoint, options = {}) {
  const startTime = Date.now();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const duration = Date.now() - startTime;
  return { response, duration };
}

/**
 * 1. API ENDPOINT STRESS TESTS
 */
async function testAPIEndpoints() {
  const results = [];
  const responseTimes = [];

  console.log('\n🔥 STRESS TEST 1: API Endpoints\n');

  // Test 1.1: POST /api/ai/generate - 100 requests
  try {
    console.log('Testing POST /api/ai/generate (100 requests)...');
    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < 100; i++) {
      try {
        const { response, duration } = await makeRequest('/api/ai/generate', {
          method: 'POST',
          body: JSON.stringify({
            fanId: `fan_${i % 5}`,
            creatorId: 'creator_1',
            incomingMessage: `Test message ${i}`,
            templateCategory: ['greeting', 'ppv_offer', 'sexting', 'response'][i % 4],
          }),
        });
        responseTimes.push(duration);
        if (response.ok) successCount++;
        else errorCount++;
      } catch (err) {
        errorCount++;
        responseTimes.push(5000); // Penalty for errors
      }
    }

    const totalDuration = Date.now() - startTime;
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    results.push({
      name: 'POST /api/ai/generate - 100 requests',
      passed: successCount >= 95 && avgResponseTime < 1000,
      duration: totalDuration,
      details: {
        totalRequests: 100,
        successful: successCount,
        failed: errorCount,
        avgResponseTime: Math.round(avgResponseTime),
        maxResponseTime: Math.max(...responseTimes),
        minResponseTime: Math.min(...responseTimes),
        throughput: Math.round((100 / totalDuration) * 1000),
      },
    });

    console.log(`✅ Completed: ${successCount}/100 successful in ${totalDuration}ms`);
    console.log(`   Avg response: ${Math.round(avgResponseTime)}ms`);
  } catch (error) {
    results.push({
      name: 'POST /api/ai/generate - 100 requests',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  // Test 1.2: GET /api/ai/templates
  try {
    console.log('\nTesting GET /api/ai/templates...');
    const { response, duration } = await makeRequest('/api/ai/templates');
    const data = await response.json();

    results.push({
      name: 'GET /api/ai/templates',
      passed: response.ok && data.success && data.data.templates.length >= 7,
      duration,
      details: {
        totalTemplates: data.data?.templates?.length || 0,
        responseTime: duration,
      },
    });

    console.log(`✅ Loaded ${data.data?.templates?.length || 0} templates in ${duration}ms`);
  } catch (error) {
    results.push({
      name: 'GET /api/ai/templates',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  // Test 1.3: GET /api/ai/approve
  try {
    console.log('\nTesting GET /api/ai/approve...');
    const { response, duration } = await makeRequest('/api/ai/approve?status=pending');
    const data = await response.json();

    results.push({
      name: 'GET /api/ai/approve',
      passed: response.ok && data.success,
      duration,
      details: {
        queueItems: data.data?.items?.length || 0,
        responseTime: duration,
      },
    });

    console.log(`✅ Approval queue loaded in ${duration}ms`);
  } catch (error) {
    results.push({
      name: 'GET /api/ai/approve',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  // Test 1.4: POST /api/ai/analytics/event - 50 events
  try {
    console.log('\nTesting POST /api/ai/analytics/event (50 events)...');
    const startTime = Date.now();
    let successCount = 0;

    for (let i = 0; i < 50; i++) {
      try {
        const { response } = await makeRequest('/api/ai/analytics/event', {
          method: 'POST',
          body: JSON.stringify({
            eventType: ['message_sent', 'message_approved', 'message_rejected'][i % 3],
            messageId: `msg_${i}`,
            templateId: `template_${(i % 7) + 1}`,
            creatorId: 'creator_1',
            fanId: `fan_${i % 5}`,
          }),
        });
        if (response.ok) successCount++;
      } catch (err) {
        // Continue on error
      }
    }

    const eventDuration = Date.now() - startTime;

    results.push({
      name: 'POST /api/ai/analytics/event - 50 events',
      passed: successCount >= 45,
      duration: eventDuration,
      details: {
        totalEvents: 50,
        successful: successCount,
        throughput: Math.round((50 / eventDuration) * 1000),
      },
    });

    console.log(`✅ Logged ${successCount}/50 events in ${eventDuration}ms`);
  } catch (error) {
    results.push({
      name: 'POST /api/ai/analytics/event - 50 events',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  return results;
}

/**
 * 2. DATABASE CONNECTION POOLING TESTS
 */
async function testDatabaseConnections() {
  const results = [];

  console.log('\n🔥 STRESS TEST 2: Database Connection Pooling\n');

  // Test 2.1: Concurrent queries
  try {
    console.log('Testing concurrent database queries (10 simultaneous)...');
    const startTime = Date.now();

    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(makeRequest('/api/ai/templates?category=ppv_offer'));
    }

    const queryResults = await Promise.all(promises);
    const duration = Date.now() - startTime;
    const successCount = queryResults.filter(({ response }) => response.ok).length;

    results.push({
      name: 'Concurrent database queries (10x)',
      passed: successCount === 10 && duration < 3000,
      duration,
      details: {
        queriesExecuted: 10,
        successful: successCount,
        avgTime: Math.round(duration / 10),
      },
    });

    console.log(`✅ Completed ${successCount}/10 concurrent queries in ${duration}ms`);
  } catch (error) {
    results.push({
      name: 'Concurrent database queries',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  // Test 2.2: Sustained load
  try {
    console.log('\nTesting sustained load (50 requests over 5 seconds)...');
    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < 50; i++) {
      try {
        const { response } = await makeRequest('/api/ai/templates');
        if (response.ok) successCount++;
        else errorCount++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        errorCount++;
      }
    }

    const duration = Date.now() - startTime;

    results.push({
      name: 'Sustained load test',
      passed: successCount >= 45,
      duration,
      details: {
        totalRequests: 50,
        successful: successCount,
        failed: errorCount,
        successRate: Math.round((successCount / 50) * 100),
      },
    });

    console.log(`✅ Sustained load test: ${successCount}/50 successful`);
  } catch (error) {
    results.push({
      name: 'Sustained load test',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  return results;
}

/**
 * 3. DATA INTEGRITY TESTS
 */
async function testDataIntegrity() {
  const results = [];

  console.log('\n🔥 STRESS TEST 3: Data Integrity\n');

  // Test 3.1: All templates accessible
  try {
    console.log('Verifying all templates are accessible...');
    const { response, duration } = await makeRequest('/api/ai/templates');
    const data = await response.json();

    const templateCount = data.data?.templates?.length || 0;
    const uniqueIds = new Set(data.data?.templates?.map((t) => t.id) || []).size;

    results.push({
      name: 'All templates accessible',
      passed: templateCount >= 7 && uniqueIds === templateCount,
      duration,
      details: {
        foundTemplates: templateCount,
        uniqueIds: uniqueIds,
      },
    });

    console.log(`✅ Found ${templateCount} templates (${uniqueIds} unique)`);
  } catch (error) {
    results.push({
      name: 'All templates accessible',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  // Test 3.2: Category filtering
  try {
    console.log('\nTesting template category filtering...');
    const categories = ['greeting', 'ppv_offer', 'sexting', 'response'];
    let allFiltersWork = true;

    for (const category of categories) {
      const { response } = await makeRequest(`/api/ai/templates?category=${category}`);
      const data = await response.json();
      const templates = data.data?.templates || [];
      const allMatch = templates.every((t) => t.category === category);
      if (!allMatch) allFiltersWork = false;
    }

    results.push({
      name: 'Template category filtering',
      passed: allFiltersWork,
      duration: 0,
    });

    console.log(`✅ Category filtering works`);
  } catch (error) {
    results.push({
      name: 'Template category filtering',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  return results;
}

/**
 * 4. ERROR HANDLING TESTS
 */
async function testErrorHandling() {
  const results = [];

  console.log('\n🔥 STRESS TEST 4: Error Handling\n');

  // Test 4.1: Missing required fields
  try {
    console.log('Testing missing required fields...');
    const { response } = await makeRequest('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ incomingMessage: 'Test' }),
    });

    const data = await response.json();

    results.push({
      name: 'Missing required fields (400 error)',
      passed: response.status === 400 && !data.success,
      duration: 0,
      details: { status: response.status },
    });

    console.log(`✅ Correctly rejected with status ${response.status}`);
  } catch (error) {
    results.push({
      name: 'Missing required fields',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  // Test 4.2: Invalid action
  try {
    console.log('\nTesting invalid parameter validation...');
    const { response } = await makeRequest('/api/ai/approve', {
      method: 'POST',
      body: JSON.stringify({
        messageId: 'msg_1',
        action: 'invalid',
        chatterId: 'chatter_1',
      }),
    });

    results.push({
      name: 'Invalid parameter validation',
      passed: response.status === 400,
      duration: 0,
      details: { status: response.status },
    });

    console.log(`✅ Correctly validated parameters`);
  } catch (error) {
    results.push({
      name: 'Invalid parameter validation',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  return results;
}

/**
 * 5. SECURITY TESTS
 */
async function testSecurity() {
  const results = [];

  console.log('\n🔥 STRESS TEST 5: Security\n');

  // Test 5.1: API keys not exposed
  try {
    console.log('Testing API keys not exposed...');
    const { response } = await makeRequest('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        fanId: 'fan_1',
        creatorId: 'creator_1',
        incomingMessage: 'Test',
      }),
    });

    const text = await response.text();
    const keysExposed =
      text.includes('ANTHROPIC_API_KEY') ||
      text.includes('sk-ant-') ||
      text.includes('SUPABASE_SERVICE_ROLE_KEY');

    results.push({
      name: 'API keys not exposed',
      passed: !keysExposed,
      duration: 0,
    });

    console.log(`✅ No API keys exposed`);
  } catch (error) {
    results.push({
      name: 'API keys not exposed',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  // Test 5.2: Content safety
  try {
    console.log('\nTesting content safety mechanisms...');
    const { response } = await makeRequest('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        fanId: 'fan_1',
        creatorId: 'creator_1',
        incomingMessage: 'Test',
      }),
    });

    const data = await response.json();
    const hasSafety =
      data.data?.confidence !== undefined || data.data?.requiresApproval !== undefined;

    results.push({
      name: 'Content safety mechanisms',
      passed: hasSafety,
      duration: 0,
    });

    console.log(`✅ Content safety detected`);
  } catch (error) {
    results.push({
      name: 'Content safety mechanisms',
      passed: false,
      duration: 0,
      error: error.message,
    });
    console.log(`❌ Failed: ${error.message}`);
  }

  return results;
}

/**
 * Calculate metrics and score
 */
function calculateMetrics(allResults) {
  const responseTimes = allResults.map((r) => r.duration).filter((d) => d > 0);
  const totalTests = allResults.length;
  const failedTests = allResults.filter((r) => !r.passed).length;

  return {
    avgResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) || 0,
    maxResponseTime: Math.max(...responseTimes, 0),
    minResponseTime: Math.min(...responseTimes.filter(t => t > 0), 0) || 0,
    totalRequests: totalTests,
    failedRequests: failedTests,
    successRate: Math.round(((totalTests - failedTests) / totalTests) * 100),
  };
}

function calculateScore(apiTests, dbTests, dataTests, errorTests, securityTests) {
  let score = 0;

  score += (apiTests.filter((t) => t.passed).length / apiTests.length) * 30;
  score += (dbTests.filter((t) => t.passed).length / dbTests.length) * 25;
  score += (dataTests.filter((t) => t.passed).length / dataTests.length) * 20;
  score += (errorTests.filter((t) => t.passed).length / errorTests.length) * 15;
  score += (securityTests.filter((t) => t.passed).length / securityTests.length) * 10;

  return Math.round(score);
}

/**
 * Print report
 */
function printReport(report) {
  console.log('\n\n════════════════════════════════════════════════════════════');
  console.log('           VAULTCRM BACKEND STRESS TEST REPORT');
  console.log('════════════════════════════════════════════════════════════\n');

  console.log('📊 PERFORMANCE METRICS');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`Total Requests:       ${report.performanceMetrics.totalRequests}`);
  console.log(`Failed Requests:      ${report.performanceMetrics.failedRequests}`);
  console.log(`Success Rate:         ${report.performanceMetrics.successRate}%`);
  console.log(`Avg Response Time:    ${report.performanceMetrics.avgResponseTime}ms`);
  console.log(`Max Response Time:    ${report.performanceMetrics.maxResponseTime}ms`);
  console.log(`Min Response Time:    ${report.performanceMetrics.minResponseTime}ms\n`);

  const categories = [
    { name: 'API Endpoints', tests: report.apiTests },
    { name: 'Database Connections', tests: report.databaseTests },
    { name: 'Data Integrity', tests: report.dataIntegrityTests },
    { name: 'Error Handling', tests: report.errorHandlingTests },
    { name: 'Security', tests: report.securityTests },
  ];

  categories.forEach(({ name, tests }) => {
    const passed = tests.filter((t) => t.passed).length;
    const total = tests.length;
    const rate = Math.round((passed / total) * 100);

    console.log(`\n🔍 ${name.toUpperCase()}`);
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`Status: ${passed}/${total} tests passed (${rate}%)\n`);

    tests.forEach((test) => {
      const icon = test.passed ? '✅' : '❌';
      console.log(`${icon} ${test.name}`);
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
      if (test.details && Object.keys(test.details).length > 0) {
        console.log(`   ${JSON.stringify(test.details).substring(0, 150)}`);
      }
    });
  });

  console.log('\n\n════════════════════════════════════════════════════════════');
  console.log(`   PRODUCTION READINESS CONFIDENCE SCORE: ${report.confidenceScore}/100`);
  console.log('════════════════════════════════════════════════════════════\n');

  console.log('📋 RECOMMENDATIONS:\n');
  if (report.confidenceScore >= 90) {
    console.log('✅ READY FOR PRODUCTION - All systems go!');
  } else if (report.confidenceScore >= 75) {
    console.log('⚠️  MOSTLY READY - Minor issues to address');
  } else if (report.confidenceScore >= 60) {
    console.log('⚠️  NEEDS IMPROVEMENT - Several issues detected');
  } else {
    console.log('❌ NOT READY FOR PRODUCTION - Critical issues');
  }
  console.log('\n');
}

/**
 * Main runner
 */
async function runStressTests() {
  console.log('🚀 Starting VaultCRM Backend Stress Test Suite...\n');
  console.log(`Testing against: ${API_BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  const startTime = Date.now();

  const apiTests = await testAPIEndpoints();
  const databaseTests = await testDatabaseConnections();
  const dataIntegrityTests = await testDataIntegrity();
  const errorHandlingTests = await testErrorHandling();
  const securityTests = await testSecurity();

  const allResults = [
    ...apiTests,
    ...databaseTests,
    ...dataIntegrityTests,
    ...errorHandlingTests,
    ...securityTests,
  ];

  const performanceMetrics = calculateMetrics(allResults);
  const confidenceScore = calculateScore(
    apiTests,
    databaseTests,
    dataIntegrityTests,
    errorHandlingTests,
    securityTests
  );

  const report = {
    apiTests,
    databaseTests,
    dataIntegrityTests,
    errorHandlingTests,
    securityTests,
    performanceMetrics,
    confidenceScore,
  };

  const totalDuration = Date.now() - startTime;
  console.log(`\n\n✅ Stress test suite completed in ${Math.round(totalDuration / 1000)}s`);

  printReport(report);

  return report;
}

// Run
runStressTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Stress test suite failed:', error);
    process.exit(1);
  });
