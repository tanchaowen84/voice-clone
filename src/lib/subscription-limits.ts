/**
 * 订阅限制检查核心逻辑
 *
 * 实现用户订阅状态查询、字符限制检查、配额使用量检查和使用统计更新
 */

import { type PlanId, getPlanConfig } from '@/config/subscription-config';
import { getDb, monthlyUsage, payment, user, userUsage } from '@/db/index';
import { auth } from '@/lib/auth';
import type { UsageCheckResult } from '@/types/subscription';
import { and, desc, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

/**
 * 获取当前用户信息
 */
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.log('🔒 [Subscription] No user session found');
      return null;
    }

    console.log(
      `👤 [Subscription] Current user: ${session.user.id} (${session.user.email})`
    );
    return session.user;
  } catch (error) {
    console.error('❌ [Subscription] Error getting current user:', error);
    return null;
  }
}

/**
 * 获取用户订阅信息（以 payment 为单一事实来源推导）
 * 优先从 payment 表推导有效订阅；若无有效记录则回退到 user 表字段；最终兜底为 free
 */
export async function getUserSubscription(userId: string) {
  try {
    const db = await getDb();

    // 1) 尝试从 payment 记录推导有效订阅
    // 说明：仅考虑订阅（subscription）类型；不处理 lifetime/one_time
    const payments = await db
      .select()
      .from(payment)
      .where(eq(payment.userId, userId))
      .orderBy(desc(payment.createdAt));

    // 辅助函数：判断一条 payment 是否代表当前有效订阅
    const isActiveSubscription = (p: any): boolean => {
      if (p.type !== 'subscription') return false;
      // 仅接受 active/trialing；如果 canceled 但未到期且 cancelAtPeriodEnd=true 也视为有效
      const status = p.status as string;
      const now = new Date();
      const periodEnd = p.periodEnd ? new Date(p.periodEnd) : null;
      if (status === 'active' || status === 'trialing') return true;
      if (
        status === 'canceled' &&
        p.cancelAtPeriodEnd &&
        periodEnd &&
        now < periodEnd
      ) {
        return true;
      }
      return false;
    };

    const effectivePayment = payments.find(isActiveSubscription);
    if (effectivePayment) {
      // 通过 priceId 反查 plan
      const { findPlanByPriceId } = await import('@/lib/price-plan');
      const plan = findPlanByPriceId(effectivePayment.priceId);
      const planId = (plan?.id || 'free') as PlanId;
      const planExpiresAt = effectivePayment.periodEnd
        ? new Date(effectivePayment.periodEnd)
        : null;

      console.log(
        `📋 [Subscription] Derived from payments, user ${userId} plan: ${planId}, expires: ${planExpiresAt}`
      );

      return {
        userId,
        planId,
        planExpiresAt,
        isExpired: false,
      };
    }

    // 2) 若无有效 payment，回退到 user 表
    const userRecord = await db
      .select({ planId: user.planId, planExpiresAt: user.planExpiresAt })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      console.warn(`⚠️ [Subscription] User ${userId} not found in database`);
      // 兜底 free
      return {
        userId,
        planId: 'free' as PlanId,
        planExpiresAt: null,
        isExpired: false,
      };
    }

    const { planId, planExpiresAt } = userRecord[0];
    const currentPlanId = (planId || 'free') as PlanId;

    const isExpired = planExpiresAt && new Date() > planExpiresAt;
    const effectivePlanId = isExpired ? ('free' as PlanId) : currentPlanId;

    console.log(
      `📋 [Subscription] Fallback to user record, user ${userId} plan: ${currentPlanId} -> ${effectivePlanId} (expired: ${isExpired})`
    );

    return {
      userId,
      planId: effectivePlanId,
      planExpiresAt,
      isExpired: Boolean(isExpired),
    };
  } catch (error) {
    console.error('❌ [Subscription] Error getting user subscription:', error);
    // 兜底 free
    return {
      userId,
      planId: 'free' as PlanId,
      planExpiresAt: null,
      isExpired: false,
    };
  }
}

/**
 * 获取用户当前使用量
 */
export async function getUserUsage(userId: string, planId: PlanId) {
  try {
    const db = await getDb();
    const now = new Date();

    if (planId === 'free') {
      // 免费用户：查询今日使用量
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

      const dailyUsage = await db
        .select({
          charactersUsed: userUsage.charactersUsed,
          requestsCount: userUsage.requestsCount,
        })
        .from(userUsage)
        .where(
          and(eq(userUsage.userId, userId), eq(userUsage.usageDate, today))
        )
        .limit(1);

      const usage = dailyUsage[0] || { charactersUsed: 0, requestsCount: 0 };
      console.log(
        `📊 [Subscription] Free user ${userId} daily usage: ${usage.charactersUsed} chars, ${usage.requestsCount} requests`
      );

      return {
        charactersUsed: usage.charactersUsed,
        requestsCount: usage.requestsCount,
        period: 'daily' as const,
        periodKey: today,
      };
    }

    // 付费用户：查询本月使用量
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

    const monthlyUsageRecord = await db
      .select({
        charactersUsed: monthlyUsage.charactersUsed,
        requestsCount: monthlyUsage.requestsCount,
      })
      .from(monthlyUsage)
      .where(
        and(
          eq(monthlyUsage.userId, userId),
          eq(monthlyUsage.monthYear, monthYear)
        )
      )
      .limit(1);

    const usage = monthlyUsageRecord[0] || {
      charactersUsed: 0,
      requestsCount: 0,
    };
    console.log(
      `📊 [Subscription] Paid user ${userId} monthly usage: ${usage.charactersUsed} chars, ${usage.requestsCount} requests`
    );

    return {
      charactersUsed: usage.charactersUsed,
      requestsCount: usage.requestsCount,
      period: 'monthly' as const,
      periodKey: monthYear,
    };
  } catch (error) {
    console.error('❌ [Subscription] Error getting user usage:', error);
    return {
      charactersUsed: 0,
      requestsCount: 0,
      period: planId === 'free' ? ('daily' as const) : ('monthly' as const),
      periodKey: '',
    };
  }
}

/**
 * 检查用户是否可以使用服务
 */
export async function checkUsageLimit(
  text: string,
  userId?: string
): Promise<UsageCheckResult> {
  try {
    // 如果没有提供userId，尝试从当前session获取
    let currentUserId = userId;
    if (!currentUserId) {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        console.log('🚫 [Subscription] No user found, denying access');
        return {
          allowed: false,
          reason: 'INVALID_PLAN',
          waitTime: 0,
        };
      }
      currentUserId = currentUser.id;
    }

    // 获取用户订阅信息
    const subscription = await getUserSubscription(currentUserId);
    if (!subscription) {
      console.log(
        `🚫 [Subscription] No subscription found for user ${currentUserId}, denying access`
      );
      return {
        allowed: false,
        reason: 'INVALID_PLAN',
        waitTime: 0,
      };
    }

    const planConfig = getPlanConfig(subscription.planId);
    const textLength = text.length;

    console.log(
      `🔍 [Subscription] Checking limits for user ${currentUserId}, plan: ${subscription.planId}, text length: ${textLength}`
    );

    // 1. 检查单次请求字符限制
    if (textLength > planConfig.limits.maxCharactersPerRequest) {
      console.log(
        `🚫 [Subscription] Text length ${textLength} exceeds single request limit ${planConfig.limits.maxCharactersPerRequest}`
      );
      return {
        allowed: false,
        reason: 'CHAR_LIMIT_EXCEEDED',
        waitTime: 0,
        limit: planConfig.limits.maxCharactersPerRequest,
        currentUsage: textLength,
      };
    }

    // 2. 获取当前使用量
    const usage = await getUserUsage(currentUserId, subscription.planId);

    // 3. 检查配额限制
    let quotaLimit: number;
    const quotaUsed = usage.charactersUsed;

    if (subscription.planId === 'free') {
      quotaLimit = planConfig.limits.dailyCharacters!;

      if (quotaUsed + textLength > quotaLimit) {
        console.log(
          `🚫 [Subscription] Daily limit exceeded: ${quotaUsed + textLength} > ${quotaLimit}`
        );
        return {
          allowed: false,
          reason: 'DAILY_LIMIT_EXCEEDED',
          waitTime: planConfig.limits.waitTime,
          limit: quotaLimit,
          currentUsage: quotaUsed,
          remainingQuota: Math.max(0, quotaLimit - quotaUsed),
        };
      }
    } else {
      quotaLimit = planConfig.limits.monthlyCharacters!;

      if (quotaUsed + textLength > quotaLimit) {
        console.log(
          `🚫 [Subscription] Monthly limit exceeded: ${quotaUsed + textLength} > ${quotaLimit}`
        );
        return {
          allowed: false,
          reason: 'MONTHLY_LIMIT_EXCEEDED',
          waitTime: 0,
          limit: quotaLimit,
          currentUsage: quotaUsed,
          remainingQuota: Math.max(0, quotaLimit - quotaUsed),
        };
      }
    }

    // 4. 检查通过
    console.log(
      `✅ [Subscription] Usage check passed for user ${currentUserId}, remaining quota: ${quotaLimit - quotaUsed - textLength}`
    );
    return {
      allowed: true,
      waitTime: planConfig.limits.waitTime,
      limit: quotaLimit,
      currentUsage: quotaUsed,
      remainingQuota: quotaLimit - quotaUsed - textLength,
    };
  } catch (error) {
    console.error('❌ [Subscription] Error checking usage limit:', error);
    // 发生错误时，为了不影响用户体验，允许使用但记录错误
    return {
      allowed: true,
      waitTime: 0,
    };
  }
}

/**
 * 更新用户使用统计
 */
export async function updateUsageStats(
  userId: string,
  charactersUsed: number
): Promise<boolean> {
  try {
    const db = await getDb();
    const now = new Date();

    // 获取用户订阅信息以确定更新哪个表
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      console.warn(
        `⚠️ [Subscription] Cannot update usage stats: no subscription found for user ${userId}`
      );
      return false;
    }

    if (subscription.planId === 'free') {
      // 免费用户：更新每日使用统计
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

      await db
        .insert(userUsage)
        .values({
          userId,
          usageDate: today,
          charactersUsed,
          requestsCount: 1,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [userUsage.userId, userUsage.usageDate],
          set: {
            charactersUsed: sql`${userUsage.charactersUsed} + ${charactersUsed}`,
            requestsCount: sql`${userUsage.requestsCount} + 1`,
            updatedAt: now,
          },
        });

      console.log(
        `📈 [Subscription] Updated daily usage for user ${userId}: +${charactersUsed} chars, +1 request`
      );
    } else {
      // 付费用户：更新每月使用统计
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

      await db
        .insert(monthlyUsage)
        .values({
          userId,
          monthYear,
          charactersUsed,
          requestsCount: 1,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [monthlyUsage.userId, monthlyUsage.monthYear],
          set: {
            charactersUsed: sql`${monthlyUsage.charactersUsed} + ${charactersUsed}`,
            requestsCount: sql`${monthlyUsage.requestsCount} + 1`,
            updatedAt: now,
          },
        });

      console.log(
        `📈 [Subscription] Updated monthly usage for user ${userId}: +${charactersUsed} chars, +1 request`
      );
    }

    return true;
  } catch (error) {
    console.error('❌ [Subscription] Error updating usage stats:', error);
    return false;
  }
}

/**
 * 获取使用限制错误信息
 */
export function getUsageLimitErrorMessage(result: UsageCheckResult): string {
  switch (result.reason) {
    case 'CHAR_LIMIT_EXCEEDED':
      return `Text too long. Maximum ${result.limit} characters per request allowed.`;
    case 'DAILY_LIMIT_EXCEEDED':
      return `Daily limit reached. You have used ${result.currentUsage}/${result.limit} characters today. Upgrade to continue.`;
    case 'MONTHLY_LIMIT_EXCEEDED':
      return `Monthly limit reached. You have used ${result.currentUsage}/${result.limit} characters this month.`;
    case 'PLAN_EXPIRED':
      return 'Your subscription has expired. Please renew to continue using the service.';
    case 'INVALID_PLAN':
      return 'Invalid subscription plan. Please contact support.';
    default:
      return 'Usage limit exceeded. Please upgrade your plan.';
  }
}
