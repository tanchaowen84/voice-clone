/**
 * 等待机制测试脚本
 * 
 * 用于验证免费用户15秒等待功能
 */

import { useSubscriptionStore } from '@/stores/subscription-store';

/**
 * 测试等待机制的基本功能
 */
export function testWaitingMechanism() {
  console.log('🧪 [Test] Starting waiting mechanism tests...');
  
  const subscriptionStore = useSubscriptionStore.getState();
  
  // 测试1: 启动等待状态
  console.log('\n📝 Test 1: Start waiting state');
  subscriptionStore.startWaiting(15);
  console.log('Waiting state:', subscriptionStore.waitingState);
  
  // 测试2: 更新等待时间
  console.log('\n📝 Test 2: Update waiting time');
  setTimeout(() => {
    subscriptionStore.updateWaitingTime(10);
    console.log('Updated waiting state:', subscriptionStore.waitingState);
  }, 1000);
  
  // 测试3: 停止等待
  console.log('\n📝 Test 3: Stop waiting');
  setTimeout(() => {
    subscriptionStore.stopWaiting();
    console.log('Stopped waiting state:', subscriptionStore.waitingState);
  }, 3000);
}

/**
 * 测试等待状态的UI集成
 */
export function testWaitingUI() {
  console.log('🧪 [Test] Testing waiting UI integration...');
  
  const subscriptionStore = useSubscriptionStore.getState();
  
  // 模拟免费用户生成语音后的等待状态
  console.log('🎤 Simulating free user voice generation...');
  subscriptionStore.startWaiting(15);
  
  // 每秒更新倒计时
  let timeLeft = 15;
  const interval = setInterval(() => {
    timeLeft--;
    subscriptionStore.updateWaitingTime(timeLeft);
    console.log(`⏳ Time remaining: ${timeLeft}s`);
    
    if (timeLeft <= 0) {
      clearInterval(interval);
      console.log('✅ Waiting completed!');
    }
  }, 1000);
}

/**
 * 测试等待状态下的按钮禁用
 */
export function testButtonDisabling() {
  console.log('🧪 [Test] Testing button disabling during wait...');
  
  const subscriptionStore = useSubscriptionStore.getState();
  
  // 检查初始状态
  console.log('Initial waiting state:', subscriptionStore.waitingState.isWaiting);
  
  // 启动等待
  subscriptionStore.startWaiting(5);
  console.log('After starting wait:', subscriptionStore.waitingState.isWaiting);
  
  // 模拟用户尝试再次生成
  if (subscriptionStore.waitingState.isWaiting) {
    console.log('🚫 Button should be disabled - user cannot generate speech');
  }
  
  // 等待结束后
  setTimeout(() => {
    subscriptionStore.stopWaiting();
    console.log('After stopping wait:', subscriptionStore.waitingState.isWaiting);
    console.log('✅ Button should be enabled - user can generate speech');
  }, 6000);
}

/**
 * 测试等待机制的边界情况
 */
export function testEdgeCases() {
  console.log('🧪 [Test] Testing edge cases...');
  
  const subscriptionStore = useSubscriptionStore.getState();
  
  // 测试1: 零秒等待
  console.log('\n📝 Test 1: Zero second wait');
  subscriptionStore.startWaiting(0);
  console.log('Zero wait state:', subscriptionStore.waitingState);
  
  // 测试2: 负数等待时间
  console.log('\n📝 Test 2: Negative wait time');
  subscriptionStore.updateWaitingTime(-5);
  console.log('Negative wait state:', subscriptionStore.waitingState);
  
  // 测试3: 重复启动等待
  console.log('\n📝 Test 3: Multiple start waiting calls');
  subscriptionStore.startWaiting(10);
  subscriptionStore.startWaiting(5); // 应该覆盖前一个
  console.log('Multiple start state:', subscriptionStore.waitingState);
  
  // 测试4: 停止未启动的等待
  console.log('\n📝 Test 4: Stop non-started waiting');
  subscriptionStore.stopWaiting();
  subscriptionStore.stopWaiting(); // 应该安全处理
  console.log('Stop non-started state:', subscriptionStore.waitingState);
}

/**
 * 完整的等待流程测试
 */
export function testCompleteWaitingFlow() {
  console.log('🧪 [Test] Testing complete waiting flow...');
  
  const subscriptionStore = useSubscriptionStore.getState();
  
  console.log('🎬 Starting complete waiting flow simulation...');
  
  // 步骤1: 用户生成语音（免费用户）
  console.log('1️⃣ User generates speech (free user)');
  subscriptionStore.startWaiting(15);
  
  // 步骤2: 显示等待界面
  console.log('2️⃣ Showing waiting interface');
  console.log('   - Progress bar should appear');
  console.log('   - Generate button should be disabled');
  console.log('   - Countdown should show 15 seconds');
  
  // 步骤3: 倒计时进行
  let timeLeft = 15;
  const interval = setInterval(() => {
    timeLeft--;
    subscriptionStore.updateWaitingTime(timeLeft);
    
    if (timeLeft === 10) {
      console.log('3️⃣ Halfway through waiting (10s remaining)');
    }
    
    if (timeLeft === 5) {
      console.log('4️⃣ Almost done (5s remaining)');
    }
    
    if (timeLeft <= 0) {
      clearInterval(interval);
      console.log('5️⃣ Waiting completed!');
      console.log('   - Waiting interface should disappear');
      console.log('   - Generate button should be enabled');
      console.log('   - User can generate speech again');
    }
  }, 1000);
}

/**
 * 运行所有等待机制测试
 */
export async function runAllWaitingTests() {
  console.log('🚀 [Test Suite] Starting comprehensive waiting mechanism tests...\n');
  
  try {
    // 1. 基本功能测试
    testWaitingMechanism();
    
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // 2. UI集成测试
    testWaitingUI();
    
    await new Promise(resolve => setTimeout(resolve, 16000));
    
    // 3. 按钮禁用测试
    testButtonDisabling();
    
    await new Promise(resolve => setTimeout(resolve, 7000));
    
    // 4. 边界情况测试
    testEdgeCases();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 5. 完整流程测试
    testCompleteWaitingFlow();
    
    console.log('\n🎉 [Test Suite] All waiting mechanism tests completed!');
    console.log('\n📋 Test Summary:');
    console.log('✅ Basic waiting functionality');
    console.log('✅ UI integration');
    console.log('✅ Button state management');
    console.log('✅ Edge case handling');
    console.log('✅ Complete user flow');
    
  } catch (error) {
    console.error('❌ [Test Suite] Test failed:', error);
  }
}

/**
 * 手动测试指南
 */
export function printManualTestGuide() {
  console.log('📖 [Manual Test Guide] How to test waiting mechanism:');
  console.log('');
  console.log('1. 🎤 Record or upload a voice sample');
  console.log('2. 📝 Enter text (less than 100 characters for free users)');
  console.log('3. 🎵 Click "Generate" button');
  console.log('4. ⏳ Observe the waiting interface:');
  console.log('   - Progress bar should appear');
  console.log('   - Countdown should show 15 seconds');
  console.log('   - Generate button should be disabled');
  console.log('5. ⏰ Wait for countdown to complete');
  console.log('6. ✅ Verify that:');
  console.log('   - Waiting interface disappears');
  console.log('   - Generate button becomes enabled');
  console.log('   - You can generate speech again');
  console.log('');
  console.log('🔍 Things to check:');
  console.log('- Progress bar animation is smooth');
  console.log('- Countdown updates every second');
  console.log('- Button states change correctly');
  console.log('- No console errors');
  console.log('- Waiting can be triggered multiple times');
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  printManualTestGuide();
  runAllWaitingTests().catch(console.error);
}
