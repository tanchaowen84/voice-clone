/**
 * 订阅状态管理 Store
 *
 * 使用 Zustand 管理用户订阅信息、使用量状态和限制检查结果
 */

import type { PlanId, SubscriptionPlan } from '@/config/subscription-config';
import { getPlanConfig } from '@/config/subscription-config';
import type { UsageCheckResult, UserUsageStats } from '@/types/subscription';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * 用户订阅信息
 */
export interface UserSubscriptionInfo {
  userId: string;
  planId: PlanId;
  planConfig: SubscriptionPlan;
  planExpiresAt: Date | null;
  isExpired: boolean;
}

/**
 * 使用量信息
 */
export interface UsageInfo {
  currentUsage: number;
  limit: number;
  remainingQuota: number;
  usagePercentage: number;
  isNearLimit: boolean; // 超过80%
  isOverLimit: boolean; // 超过100%
  period: 'daily' | 'monthly';
  nextResetTime: Date | null;
}

/**
 * 升级Modal触发原因
 */
export type UpgradeTrigger =
  | 'character_limit' // 单次输入字数超出限制
  | 'daily_limit' // 每日用量超限
  | 'waiting_period'; // 等待期间点击升级

/**
 * 订阅状态接口
 */
export interface SubscriptionState {
  // 订阅信息
  subscription: UserSubscriptionInfo | null;

  // 使用量信息
  usage: UsageInfo | null;

  // 最后一次检查结果
  lastUsageCheck: UsageCheckResult | null;

  // 加载状态
  isLoading: boolean;
  error: string | null;

  // 等待状态 (免费用户)
  waitingState: {
    isWaiting: boolean;
    remainingTime: number;
    totalWaitTime: number;
  };

  // 升级Modal状态
  upgradeModal: {
    isOpen: boolean;
    trigger: UpgradeTrigger | null;
  };

  // Actions
  setSubscription: (subscription: UserSubscriptionInfo | null) => void;
  setUsage: (usage: UsageInfo | null) => void;
  setLastUsageCheck: (result: UsageCheckResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 等待相关
  startWaiting: (waitTime: number) => boolean;
  stopWaiting: () => void;
  updateWaitingTime: (remainingTime: number) => void;

  // 升级Modal管理
  showUpgradeModal: (trigger: UpgradeTrigger) => void;
  hideUpgradeModal: () => void;

  // 使用量更新
  updateUsageAfterGeneration: (charactersUsed: number) => void;

  // 数据获取
  fetchSubscriptionInfo: () => Promise<void>;
  fetchUsageInfo: () => Promise<void>;
  fetchAllData: () => Promise<void>;

  // 重置状态
  reset: () => void;

  // 计算方法
  calculateUsagePercentage: () => number;
  isNearUsageLimit: () => boolean;
  canUseService: (textLength: number) => boolean;
  getUpgradeRecommendation: () => PlanId | null;
}

const initialWaitingState = {
  isWaiting: false,
  remainingTime: 0,
  totalWaitTime: 0,
};

function flushPendingResults() {
  setTimeout(() => {
    void Promise.all([
      import('@/stores/text-to-speech-store'),
      import('@/stores/voice-clone-store'),
    ])
      .then(([textToSpeechModule, voiceCloneModule]) => {
        textToSpeechModule.useTextToSpeechStore.getState().revealPendingAudio();
        voiceCloneModule.useVoiceCloneStore.getState().showPendingResult();
      })
      .catch((error) => {
        console.warn(
          '⚠️ [Subscription Store] Failed to flush pending results:',
          error
        );
      });
  }, 100);
}

/**
 * 订阅状态管理 Store
 */
export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    (set, get) => ({
      // 初始状态
      subscription: null,
      usage: null,
      lastUsageCheck: null,
      isLoading: false,
      error: null,
      waitingState: { ...initialWaitingState },

      // 升级Modal状态
      upgradeModal: {
        isOpen: false,
        trigger: null,
      },

      // 设置订阅信息
      setSubscription: (subscription) => {
        console.log(
          '📋 [Subscription Store] Setting subscription:',
          subscription
        );
        const shouldClearWaiting = Boolean(
          subscription &&
            subscription.planId !== 'free' &&
            get().waitingState.isWaiting
        );

        set((state) => ({
          subscription,
          error: null,
          waitingState: shouldClearWaiting
            ? { ...initialWaitingState }
            : state.waitingState,
        }));

        if (shouldClearWaiting) {
          flushPendingResults();
        }
      },

      // 设置使用量信息
      setUsage: (usage) => {
        console.log('📊 [Subscription Store] Setting usage:', usage);
        set({ usage, error: null });
      },

      // 设置最后检查结果
      setLastUsageCheck: (result) => {
        console.log(
          '🔍 [Subscription Store] Setting last usage check:',
          result
        );
        set({ lastUsageCheck: result });
      },

      // 设置加载状态
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // 设置错误
      setError: (error) => {
        console.error('❌ [Subscription Store] Setting error:', error);
        set({ error, isLoading: false });
      },

      // 开始等待
      startWaiting: (waitTime) => {
        const { subscription } = get();

        if (waitTime <= 0) {
          set({ waitingState: { ...initialWaitingState } });
          return false;
        }

        if (subscription && subscription.planId !== 'free') {
          console.log(
            `⏭️ [Subscription Store] Skipping free wait for paid plan ${subscription.planId}`
          );
          set({ waitingState: { ...initialWaitingState } });
          flushPendingResults();
          return false;
        }

        console.log(
          `⏳ [Subscription Store] Starting wait: ${waitTime} seconds`
        );
        set({
          waitingState: {
            isWaiting: true,
            remainingTime: waitTime,
            totalWaitTime: waitTime,
          },
        });
        return true;
      },

      // 停止等待
      stopWaiting: () => {
        console.log('✅ [Subscription Store] Stopping wait');
        set({
          waitingState: { ...initialWaitingState },
        });
        flushPendingResults();
      },

      // 更新等待时间
      updateWaitingTime: (remainingTime) => {
        const state = get();
        if (state.waitingState.isWaiting) {
          set({
            waitingState: {
              ...state.waitingState,
              remainingTime: Math.max(0, remainingTime),
            },
          });

          // 如果时间到了，自动停止等待
          if (remainingTime <= 0) {
            get().stopWaiting();
          }
        }
      },

      // 生成后更新使用量
      updateUsageAfterGeneration: (charactersUsed) => {
        const state = get();
        if (state.usage) {
          const newUsage = state.usage.currentUsage + charactersUsed;
          const newRemainingQuota = Math.max(0, state.usage.limit - newUsage);
          const newUsagePercentage = (newUsage / state.usage.limit) * 100;

          console.log(
            `📈 [Subscription Store] Updating usage: +${charactersUsed} chars, new total: ${newUsage}/${state.usage.limit}`
          );

          set({
            usage: {
              ...state.usage,
              currentUsage: newUsage,
              remainingQuota: newRemainingQuota,
              usagePercentage: newUsagePercentage,
              isNearLimit: newUsagePercentage >= 80,
              isOverLimit: newUsagePercentage >= 100,
            },
          });
        }
      },

      // 获取订阅信息
      fetchSubscriptionInfo: async () => {
        console.log('🔍 [Subscription Store] Fetching subscription info');
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/subscription/usage', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          const subscription: UserSubscriptionInfo = {
            userId: data.subscription.userId,
            planId: data.subscription.planId,
            planConfig: data.subscription.planConfig,
            planExpiresAt: data.subscription.planExpiresAt
              ? new Date(data.subscription.planExpiresAt)
              : null,
            isExpired: data.subscription.isExpired,
          };

          const shouldClearWaiting =
            subscription.planId !== 'free' && get().waitingState.isWaiting;

          set((state) => ({
            subscription,
            isLoading: false,
            waitingState: shouldClearWaiting
              ? { ...initialWaitingState }
              : state.waitingState,
          }));

          if (shouldClearWaiting) {
            flushPendingResults();
          }
          console.log(
            '✅ [Subscription Store] Successfully fetched subscription info'
          );
        } catch (error) {
          console.error(
            '❌ [Subscription Store] Failed to fetch subscription info:',
            error
          );
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to fetch subscription info',
            isLoading: false,
          });
        }
      },

      // 获取使用量信息
      fetchUsageInfo: async () => {
        console.log('📊 [Subscription Store] Fetching usage info');
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/subscription/usage', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          const usage: UsageInfo = {
            currentUsage: data.usage.currentUsage,
            limit: data.usage.limit,
            remainingQuota: data.usage.remainingQuota,
            usagePercentage: data.usage.usagePercentage,
            isNearLimit: data.usage.isNearLimit,
            isOverLimit: data.usage.isOverLimit,
            period: data.usage.period,
            nextResetTime: new Date(data.usage.nextResetTime),
          };

          set({ usage, isLoading: false });
          console.log(
            '✅ [Subscription Store] Successfully fetched usage info'
          );
        } catch (error) {
          console.error(
            '❌ [Subscription Store] Failed to fetch usage info:',
            error
          );
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to fetch usage info',
            isLoading: false,
          });
        }
      },

      // 获取所有数据（订阅信息和使用量信息）
      fetchAllData: async () => {
        console.log('🔄 [Subscription Store] Fetching all subscription data');
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/subscription/usage', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          // 设置订阅信息
          const subscription: UserSubscriptionInfo = {
            userId: data.subscription.userId,
            planId: data.subscription.planId,
            planConfig: data.subscription.planConfig,
            planExpiresAt: data.subscription.planExpiresAt
              ? new Date(data.subscription.planExpiresAt)
              : null,
            isExpired: data.subscription.isExpired,
          };

          // 设置使用量信息
          const usage: UsageInfo = {
            currentUsage: data.usage.currentUsage,
            limit: data.usage.limit,
            remainingQuota: data.usage.remainingQuota,
            usagePercentage: data.usage.usagePercentage,
            isNearLimit: data.usage.isNearLimit,
            isOverLimit: data.usage.isOverLimit,
            period: data.usage.period,
            nextResetTime: new Date(data.usage.nextResetTime),
          };

          const shouldClearWaiting =
            subscription.planId !== 'free' && get().waitingState.isWaiting;

          set((state) => ({
            subscription,
            usage,
            isLoading: false,
            waitingState: shouldClearWaiting
              ? { ...initialWaitingState }
              : state.waitingState,
          }));

          if (shouldClearWaiting) {
            flushPendingResults();
          }
          console.log('✅ [Subscription Store] Successfully fetched all data');
        } catch (error) {
          console.error(
            '❌ [Subscription Store] Failed to fetch subscription data:',
            error
          );
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to fetch subscription data',
            isLoading: false,
          });
        }
      },

      // 重置状态
      reset: () => {
        console.log('🔄 [Subscription Store] Resetting state');
        set({
          subscription: null,
          usage: null,
          lastUsageCheck: null,
          isLoading: false,
          error: null,
          waitingState: { ...initialWaitingState },
        });
      },

      // 计算使用量百分比
      calculateUsagePercentage: () => {
        const state = get();
        if (!state.usage || state.usage.limit === 0) return 0;
        return (state.usage.currentUsage / state.usage.limit) * 100;
      },

      // 是否接近使用限制
      isNearUsageLimit: () => {
        return get().calculateUsagePercentage() >= 80;
      },

      // 是否可以使用服务
      canUseService: (textLength) => {
        const state = get();
        const isWaitingForFreePlan =
          state.waitingState.isWaiting && state.subscription?.planId === 'free';

        // 检查是否在等待中
        if (isWaitingForFreePlan) {
          return false;
        }

        // 检查订阅和使用量
        if (!state.subscription || !state.usage) {
          return true; // 如果没有数据，默认允许（优雅降级）
        }

        // 检查单次请求限制
        if (
          textLength >
          state.subscription.planConfig.limits.maxCharactersPerRequest
        ) {
          return false;
        }

        // 检查配额限制
        if (state.usage.currentUsage + textLength > state.usage.limit) {
          return false;
        }

        return true;
      },

      // 获取升级建议
      getUpgradeRecommendation: () => {
        const state = get();
        if (!state.subscription) return null;

        const currentPlan = state.subscription.planId;

        // 免费用户建议升级到 Basic
        if (currentPlan === 'free') {
          return 'basic';
        }

        // Basic 用户建议升级到 Pro
        if (currentPlan === 'basic') {
          return 'pro';
        }

        // Pro 用户已经是最高级别
        return null;
      },

      // 显示升级Modal
      showUpgradeModal: (trigger) => {
        console.log(
          `🚀 [Subscription Store] Showing upgrade modal with trigger: ${trigger}`
        );
        const newState = {
          upgradeModal: {
            isOpen: true,
            trigger,
          },
        };
        console.log('🔍 [Subscription Store] Setting modal state:', newState);
        set(newState);

        // 验证状态是否设置成功
        const currentState = get();
        console.log(
          '🔍 [Subscription Store] Current modal state after set:',
          currentState.upgradeModal
        );
      },

      // 隐藏升级Modal
      hideUpgradeModal: () => {
        console.log('❌ [Subscription Store] Hiding upgrade modal');
        set({
          upgradeModal: {
            isOpen: false,
            trigger: null,
          },
        });
      },
    }),
    {
      name: 'subscription-store',
    }
  )
);

/**
 * 辅助函数：从API响应创建使用量信息
 */
export function createUsageInfoFromApiResponse(
  currentUsage: number,
  limit: number,
  remainingQuota: number,
  period: 'daily' | 'monthly'
): UsageInfo {
  const usagePercentage = limit > 0 ? (currentUsage / limit) * 100 : 0;

  return {
    currentUsage,
    limit,
    remainingQuota,
    usagePercentage,
    isNearLimit: usagePercentage >= 80,
    isOverLimit: usagePercentage >= 100,
    period,
    nextResetTime: null, // 可以后续计算
  };
}

/**
 * 辅助函数：从订阅数据创建订阅信息
 */
export function createSubscriptionInfo(
  userId: string,
  planId: PlanId,
  planExpiresAt: Date | null = null
): UserSubscriptionInfo {
  const planConfig = getPlanConfig(planId);
  const isExpired = planExpiresAt ? new Date() > planExpiresAt : false;

  return {
    userId,
    planId: isExpired ? 'free' : planId,
    planConfig: isExpired ? getPlanConfig('free') : planConfig,
    planExpiresAt,
    isExpired,
  };
}
