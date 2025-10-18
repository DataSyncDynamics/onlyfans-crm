# VaultCRM Backend Stress Tests

Comprehensive load testing suite for validating production readiness.

## Quick Start

```bash
# 1. Start the dev server
npm run dev

# 2. Run stress tests (in another terminal)
node tests/run-stress-test.js

# 3. Review results
cat STRESS_TEST_REPORT.md
```

## What Gets Tested

### 1. API Endpoint Stress Tests (30 points)
- **POST /api/ai/generate** - 100 concurrent requests
- **GET /api/ai/templates** - Template loading and filtering
- **GET /api/ai/approve** - Approval queue functionality
- **POST /api/ai/analytics/event** - 50 analytics events

### 2. Database Connection Pooling (25 points)
- 10 simultaneous queries (concurrency test)
- 50 consecutive requests (sustained load test)
- Connection leak detection
- Query performance benchmarks

### 3. Data Integrity (20 points)
- All 7+ templates accessible
- Category filtering (greeting, ppv_offer, sexting, etc.)
- Tier filtering (whale, high, medium, low)
- Unique ID validation

### 4. Error Handling (15 points)
- Missing required fields (400 error)
- Malformed JSON handling
- Non-existent IDs (404 error)
- Invalid parameter validation

### 5. Security (10 points)
- API keys not exposed in responses
- Content safety mechanisms active
- CORS configuration
- No stack trace leaks

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API response time | <500ms | 3-499ms ✅ |
| Template loading | <100ms | 5ms ✅ |
| Concurrent queries | <2000ms | 23ms ✅ |
| Success rate | >95% | 29% ⚠️ |

## Test Files

```
tests/
├── run-stress-test.js     # Main executable (JavaScript)
├── stress-test.ts          # TypeScript version
├── stress-test-results.json # Latest results
└── README.md               # This file

STRESS_TEST_REPORT.md       # Detailed analysis (root)
```

## Running on Different Ports

```bash
# If port 3000 is busy
NEXT_PUBLIC_APP_URL=http://localhost:3002 node tests/run-stress-test.js
```

## Understanding Results

### Confidence Score Breakdown

- **90-100**: Ready for production, all systems go
- **75-89**: Mostly ready, minor issues to address
- **60-74**: Needs improvement, several issues detected
- **<60**: Not ready, critical issues require resolution

### Current Score: 80/100

**Category Scores:**
- Database Connections: 25/25 (100%) ✅
- Data Integrity: 20/20 (100%) ✅
- Error Handling: 15/15 (100%) ✅
- API Endpoints: 15/30 (50%) ⚠️
- Security: 5/10 (50%) ⚠️

## Common Issues

### Issue: "Fan or creator not found"

**Cause:** Mock data expects specific IDs, test uses dynamic IDs

**Fix:** Update `/src/lib/mock-data.ts` to handle any ID OR update test to use valid mock IDs

```typescript
// Option 1: Update mock-data.ts
export function getFanById(fanId: string) {
  return mockFans.find(f => f.id === fanId) || generateMockFan(fanId);
}

// Option 2: Update test to use valid IDs
const validFanIds = ['fan_1', 'fan_2', 'fan_3']; // From mock-data
```

### Issue: Analytics events not logging

**Cause:** Similar validation issue as /generate endpoint

**Fix:** Same as above - update mock data handling

## Re-running Tests After Fixes

```bash
# 1. Make your fixes

# 2. Restart dev server
npm run dev

# 3. Re-run tests
node tests/run-stress-test.js

# 4. Check for improved score
# Target: 95/100 for production readiness
```

## Customizing Tests

### Add More Test Cases

Edit `run-stress-test.js` and add new test functions:

```javascript
async function testNewEndpoint() {
  const results = [];

  // Your test logic here
  const { response, duration } = await makeRequest('/api/new-endpoint');

  results.push({
    name: 'New endpoint test',
    passed: response.ok,
    duration,
  });

  return results;
}

// Add to main runner
const newTests = await testNewEndpoint();
```

### Adjust Load Levels

```javascript
// Current: 100 requests
for (let i = 0; i < 100; i++) { ... }

// Increase to 500 for more stress
for (let i = 0; i < 500; i++) { ... }
```

### Change Performance Thresholds

```javascript
// Current threshold: 500ms avg response time
passed: avgResponseTime < 500

// Stricter: 200ms
passed: avgResponseTime < 200
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Backend Stress Tests

on: [push, pull_request]

jobs:
  stress-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run dev &
      - run: sleep 10 # Wait for server
      - run: node tests/run-stress-test.js
      - run: |
          if [ $(jq '.confidenceScore' tests/stress-test-results.json) -lt 80 ]; then
            exit 1
          fi
```

## Monitoring Production

After deployment, monitor these metrics:

1. **Response Times** - Should stay <500ms
2. **Error Rate** - Should be <5%
3. **Database Connections** - Monitor pool usage
4. **API Usage** - Track req/sec, watch for spikes

## Troubleshooting

### Tests hang or timeout

- Check if dev server is running: `lsof -ti:3000`
- Check server logs: `npm run dev` (watch for errors)
- Increase timeout in test file

### Connection refused errors

- Ensure correct port: `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Check no firewall blocking localhost
- Try different port if 3000 is busy

### Inconsistent results

- Run tests multiple times (3x) and average
- Ensure no other apps consuming resources
- Close other dev servers on different ports

## Next Steps

1. Review `/STRESS_TEST_REPORT.md` for detailed findings
2. Fix P0/P1 issues identified in report
3. Re-run tests to validate fixes
4. Aim for 95/100 score before production
5. Set up continuous monitoring post-launch

## Support

For issues or questions:
- Check `/STRESS_TEST_REPORT.md` for detailed analysis
- Review test output for specific error messages
- Inspect `/tests/stress-test-results.json` for raw data
