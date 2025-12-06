/**
 * 订阅限制系统测试脚本
 *
 * 用于验证权限控制系统的各种场景
 */

import {
  checkUsageLimit,
  getUserSubscription,
  getUserUsage,
} from './subscription-limits';

/**
 * 测试场景
 */
export async function testSubscriptionLimits() {
  console.log('🧪 [Test] Starting subscription limits tests...');

  try {
    // 测试1: 检查免费用户单次字符限制
    console.log('\n📝 Test 1: Free user single request character limit');
    const longText = 'a'.repeat(150); // 150 characters, exceeds free limit of 100
    const shortText = 'a'.repeat(50); // 50 characters, within limit

    console.log(`Testing with ${longText.length} characters (should fail):`);
    const longTextResult = await checkUsageLimit(longText);
    console.log('Result:', longTextResult);

    console.log(`Testing with ${shortText.length} characters (should pass):`);
    const shortTextResult = await checkUsageLimit(shortText);
    console.log('Result:', shortTextResult);

    // 测试2: 检查用户订阅信息获取
    console.log('\n📋 Test 2: User subscription info');
    // 注意：这需要真实的用户ID，在实际测试中需要替换
    // const subscription = await getUserSubscription('test-user-id');
    // console.log('Subscription:', subscription);

    // 测试3: 检查使用量获取
    console.log('\n📊 Test 3: User usage info');
    // const usage = await getUserUsage('test-user-id', 'free');
    // console.log('Usage:', usage);

    console.log('\n✅ [Test] All tests completed');
  } catch (error) {
    console.error('❌ [Test] Test failed:', error);
  }
}

/**
 * 模拟不同订阅计划的测试
 */
export function testPlanLimits() {
  console.log('🧪 [Test] Testing plan limits...');

  const testCases = [
    {
      plan: 'free',
      text: 'a'.repeat(50),
      shouldPass: true,
      description: 'Free user with 50 chars',
    },
    {
      plan: 'free',
      text: 'a'.repeat(150),
      shouldPass: false,
      description: 'Free user with 150 chars (exceeds 100 limit)',
    },
    {
      plan: 'basic',
      text: 'a'.repeat(500),
      shouldPass: true,
      description: 'Basic user with 500 chars',
    },
    {
      plan: 'basic',
      text: 'a'.repeat(1500),
      shouldPass: false,
      description: 'Basic user with 1500 chars (exceeds 1000 limit)',
    },
    {
      plan: 'pro',
      text: 'a'.repeat(1500),
      shouldPass: true,
      description: 'Pro user with 1500 chars',
    },
    {
      plan: 'pro',
      text: 'a'.repeat(2500),
      shouldPass: false,
      description: 'Pro user with 2500 chars (exceeds 2000 limit)',
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase.description}`);
    console.log(`Plan: ${testCase.plan}, Text length: ${testCase.text.length}`);
    console.log(`Expected to ${testCase.shouldPass ? 'PASS' : 'FAIL'}`);
  });
}

/**
 * 验证错误消息格式
 */
export function testErrorMessages() {
  console.log('🧪 [Test] Testing error messages...');

  const mockResults = [
    {
      allowed: false,
      reason: 'CHAR_LIMIT_EXCEEDED' as const,
      limit: 100,
    },
    {
      allowed: false,
      reason: 'DAILY_LIMIT_EXCEEDED' as const,
      currentUsage: 950,
      limit: 1000,
    },
    {
      allowed: false,
      reason: 'MONTHLY_LIMIT_EXCEEDED' as const,
      currentUsage: 95000,
      limit: 100000,
    },
  ];

  // 这里可以测试错误消息生成
  // mockResults.forEach((result, index) => {
  //   console.log(`Test ${index + 1}:`, getUsageLimitErrorMessage(result));
  // });
}

/**
 * 性能测试
 */
export async function performanceTest() {
  console.log('🧪 [Test] Running performance tests...');

  const iterations = 10;
  const testText =
    'Hello world, this is a test message for performance testing.';

  console.log(`Testing ${iterations} iterations of usage limit checks...`);

  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    try {
      await checkUsageLimit(testText);
    } catch (error) {
      // 忽略错误，只测试性能
    }
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;

  console.log(`Total time: ${totalTime}ms`);
  console.log(`Average time per check: ${avgTime.toFixed(2)}ms`);
  console.log(`Target: <200ms per check ${avgTime < 200 ? '✅' : '❌'}`);
}

/**
 * 数据库连接测试
 */
export async function testDatabaseConnection() {
  console.log('🧪 [Test] Testing database connection...');

  try {
    // 简单的数据库连接测试
    const { getDb } = await import('@/db/index');
    const db = await getDb();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log(
    '🚀 [Test Suite] Starting comprehensive subscription limits tests...\n'
  );

  // 1. 数据库连接测试
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('❌ Skipping other tests due to database connection failure');
    return;
  }

  // 2. 基本功能测试
  await testSubscriptionLimits();

  // 3. 计划限制测试
  testPlanLimits();

  // 4. 错误消息测试
  testErrorMessages();

  // 5. 性能测试
  await performanceTest();

  console.log('\n🎉 [Test Suite] All tests completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Test with real user authentication');
  console.log('2. Test API endpoints directly');
  console.log('3. Test frontend integration');
  console.log('4. Monitor usage statistics in database');
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  runAllTests().catch(console.error);
}
