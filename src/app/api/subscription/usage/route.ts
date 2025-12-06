import { getPlanConfig } from '@/config/subscription-config';
import {
  getCurrentUser,
  getUserSubscription,
  getUserUsage,
} from '@/lib/subscription-limits';
import { NextResponse } from 'next/server';

/**
 * GET /api/subscription/usage
 * 获取当前用户的使用量信息
 */
export async function GET() {
  try {
    console.log('📊 [Usage API] Fetching user usage data');

    // 1. 获取当前用户
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.log('🚫 [Usage API] No authenticated user found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. 获取用户订阅信息
    const subscription = await getUserSubscription(currentUser.id);
    if (!subscription) {
      console.log(
        `⚠️ [Usage API] No subscription found for user ${currentUser.id}`
      );
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // 3. 获取计划配置
    const planConfig = getPlanConfig(subscription.planId);

    // 4. 获取使用量数据
    const usage = await getUserUsage(currentUser.id, subscription.planId);

    // 5. 计算配额限制
    let limit: number;
    let period: 'daily' | 'monthly';
    let nextResetTime: Date;

    if (subscription.planId === 'free') {
      limit = planConfig.limits.dailyCharacters!;
      period = 'daily';

      // 计算下次重置时间（明天0点）
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      nextResetTime = tomorrow;
    } else {
      limit = planConfig.limits.monthlyCharacters!;
      period = 'monthly';

      // 计算下次重置时间（下个月1号0点）
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      nextMonth.setHours(0, 0, 0, 0);
      nextResetTime = nextMonth;
    }

    // 6. 计算使用量统计
    const currentUsage = usage.charactersUsed;
    const remainingQuota = Math.max(0, limit - currentUsage);
    const usagePercentage = limit > 0 ? (currentUsage / limit) * 100 : 0;
    const isNearLimit = usagePercentage >= 80;
    const isOverLimit = usagePercentage >= 100;

    // 7. 构建响应数据
    const responseData = {
      // 订阅信息
      subscription: {
        userId: currentUser.id,
        planId: subscription.planId,
        planConfig: {
          id: planConfig.id,
          name: planConfig.name,
          limits: planConfig.limits,
        },
        planExpiresAt: subscription.planExpiresAt,
        isExpired: subscription.isExpired,
      },

      // 使用量信息
      usage: {
        currentUsage,
        limit,
        remainingQuota,
        usagePercentage,
        isNearLimit,
        isOverLimit,
        period,
        nextResetTime: nextResetTime.toISOString(),

        // 额外的统计信息
        requestsCount: usage.requestsCount,
        periodKey: usage.periodKey,
      },
    };

    console.log(
      `✅ [Usage API] Successfully fetched usage data for user ${currentUser.id}: ${currentUsage}/${limit} (${usagePercentage.toFixed(1)}%)`
    );

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('❌ [Usage API] Error fetching usage data:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch usage data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscription/usage/refresh
 * 刷新用户的使用量缓存（如果有的话）
 */
export async function POST() {
  try {
    console.log('🔄 [Usage API] Refreshing usage data');

    // 获取当前用户
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 这里可以添加缓存清理逻辑
    // 目前直接返回最新数据
    const response = await GET();

    console.log(
      `✅ [Usage API] Usage data refreshed for user ${currentUser.id}`
    );
    return response;
  } catch (error) {
    console.error('❌ [Usage API] Error refreshing usage data:', error);

    return NextResponse.json(
      {
        error: 'Failed to refresh usage data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
