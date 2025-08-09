/**
 * 订阅系统配置文件
 *
 * 定义了所有订阅计划的详细信息，包括价格、限制和功能特性
 */

/**
 * 订阅计划ID类型
 */
export type PlanId = 'free' | 'basic' | 'pro';

/**
 * 订阅计划限制配置
 */
export interface PlanLimits {
  // 字符配额限制
  dailyCharacters?: number; // 每日字符限制 (免费用户)
  monthlyCharacters?: number; // 每月字符限制 (付费用户)

  // 单次请求限制
  maxCharactersPerRequest: number;

  // 功能权限
  commercialUse: boolean; // 是否允许商业使用
  waitTime: number; // 等待时间 (秒)

  // 音频格式支持
  audioFormats: string[];

  // 处理优先级
  priority: 'low' | 'normal' | 'high';
}

/**
 * 订阅计划配置
 */
export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  displayName: string;
  price: number; // 价格 (美分)
  currency: string;
  interval: 'month' | 'year' | null;

  // 使用限制
  limits: PlanLimits;

  // 功能特性列表 (用于展示)
  features: string[];

  // 推荐标签
  recommended?: boolean;

  // 描述信息
  description: string;

  // 适用人群
  targetAudience: string;
}

/**
 * 扩展的订阅计划ID类型，包含年付计划
 */
export type ExtendedPlanId = PlanId | 'basic_yearly' | 'pro_yearly';

/**
 * 所有订阅计划配置
 */
export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    displayName: 'Free Plan',
    price: 0,
    currency: 'USD',
    interval: null,
    limits: {
      dailyCharacters: 1000,
      maxCharactersPerRequest: 100,
      commercialUse: false,
      waitTime: 15, // 15秒等待
      audioFormats: ['mp3'],
      priority: 'low',
    },
    features: [
      '1,000 characters per day',
      '100 characters per request',
      'Personal use only',
      'Standard MP3 quality',
      '15-second wait time',
      'Community support',
    ],
    description: 'Perfect for trying out our voice cloning technology',
    targetAudience: 'Individual users, hobbyists',
  },

  basic: {
    id: 'basic',
    name: 'Basic',
    displayName: 'Basic Plan',
    price: 1000, // $10.00 in cents
    currency: 'USD',
    interval: 'month',
    limits: {
      monthlyCharacters: 100000, // 100K characters per month
      maxCharactersPerRequest: 1000,
      commercialUse: true,
      waitTime: 0, // No wait time
      audioFormats: ['mp3'],
      priority: 'normal',
    },
    features: [
      '100,000 characters per month',
      '1,000 characters per request',
      'Commercial use allowed',
      'Instant generation',
      'High quality MP3',
      'Email support',
    ],
    recommended: true,
    description: 'Ideal for content creators and small businesses',
    targetAudience: 'Content creators, small businesses',
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro Plan',
    price: 2500, // $25.00 in cents
    currency: 'USD',
    interval: 'month',
    limits: {
      monthlyCharacters: 500000, // 500K characters per month
      maxCharactersPerRequest: 2000,
      commercialUse: true,
      waitTime: 0, // No wait time
      audioFormats: ['mp3', 'wav'],
      priority: 'high',
    },
    features: [
      '500,000 characters per month',
      '2,000 characters per request',
      'Commercial use allowed',
      'Instant generation',
      'High quality MP3 + WAV',
      'Multiple audio formats',
      'Priority processing',
      'Priority email support',
    ],
    description: 'Perfect for professional teams and heavy usage',
    targetAudience: 'Professional teams, agencies, heavy users',
  },
} as const;

/**
 * 扩展的订阅计划配置，包含年付选项
 */
export const EXTENDED_SUBSCRIPTION_PLANS: Record<
  ExtendedPlanId,
  SubscriptionPlan & { yearlyDiscount?: number }
> = {
  ...SUBSCRIPTION_PLANS,

  basic_yearly: {
    id: 'basic',
    name: 'Basic',
    displayName: 'Basic Plan',
    price: 7200, // $72.00 in cents => $6.00/month billed yearly (40% off)
    currency: 'USD',
    interval: 'year',
    limits: {
      monthlyCharacters: 100000, // 100K characters per month
      maxCharactersPerRequest: 1000,
      commercialUse: true,
      waitTime: 0,
      audioFormats: ['mp3'],
      priority: 'normal',
    },
    features: [
      '100,000 characters per month',
      '1,000 characters per request',
      'Commercial use allowed',
      'Instant generation',
      'High quality MP3',
      'Email support',
    ],
    recommended: true,
    description: 'Ideal for content creators and small businesses',
    targetAudience: 'Content creators, small businesses',
    yearlyDiscount: 40, // 40% discount
  },

  pro_yearly: {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro Plan',
    price: 18000, // $180.00 in cents => $15.00/month billed yearly (40% off)
    currency: 'USD',
    interval: 'year',
    limits: {
      monthlyCharacters: 500000, // 500K characters per month
      maxCharactersPerRequest: 2000,
      commercialUse: true,
      waitTime: 0,
      audioFormats: ['mp3', 'wav'],
      priority: 'high',
    },
    features: [
      '500,000 characters per month',
      '2,000 characters per request',
      'Commercial use allowed',
      'Instant generation',
      'High quality MP3 + WAV',
      'Multiple audio formats',
      'Priority processing',
      'Priority email support',
    ],
    description: 'Perfect for professional teams and heavy usage',
    targetAudience: 'Professional teams, agencies, heavy users',
    yearlyDiscount: 40, // 40% discount
  },
} as const;

/**
 * 获取订阅计划配置
 */
export function getPlanConfig(planId: PlanId): SubscriptionPlan {
  return SUBSCRIPTION_PLANS[planId];
}

/**
 * 获取所有订阅计划
 */
export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS);
}

/**
 * 获取付费计划
 */
export function getPaidPlans(): SubscriptionPlan[] {
  return getAllPlans().filter((plan) => plan.price > 0);
}

/**
 * 获取扩展的付费计划（包含年付）
 */
export function getExtendedPaidPlans(
  interval: 'month' | 'year' = 'month'
): (SubscriptionPlan & { yearlyDiscount?: number })[] {
  const plans = Object.values(EXTENDED_SUBSCRIPTION_PLANS).filter(
    (plan) => plan.price > 0
  );
  return plans.filter((plan) => plan.interval === interval);
}

/**
 * 获取计划的年付版本
 */
export function getYearlyPlan(
  planId: PlanId
): (SubscriptionPlan & { yearlyDiscount?: number }) | null {
  if (planId === 'free') return null;
  const yearlyPlanId = `${planId}_yearly` as ExtendedPlanId;
  return EXTENDED_SUBSCRIPTION_PLANS[yearlyPlanId] || null;
}

/**
 * 检查是否为付费计划
 */
export function isPaidPlan(planId: PlanId): boolean {
  return planId !== 'free';
}

/**
 * 获取计划的显示价格
 */
export function getDisplayPrice(planId: PlanId): string {
  const plan = getPlanConfig(planId);
  if (plan.price === 0) {
    return 'Free';
  }

  const price = (plan.price / 100).toFixed(2);
  return `$${price}/${plan.interval}`;
}

/**
 * 获取推荐的升级计划
 */
export function getRecommendedUpgrade(currentPlanId: PlanId): PlanId | null {
  switch (currentPlanId) {
    case 'free':
      return 'basic';
    case 'basic':
      return 'pro';
    case 'pro':
      return null; // Already highest plan
    default:
      return 'basic';
  }
}

/**
 * 比较两个计划的等级
 */
export function comparePlans(planA: PlanId, planB: PlanId): number {
  const planOrder: Record<PlanId, number> = {
    free: 0,
    basic: 1,
    pro: 2,
  };

  return planOrder[planA] - planOrder[planB];
}

/**
 * 检查计划是否支持某个功能
 */
export function planSupportsFeature(
  planId: PlanId,
  feature: keyof PlanLimits
): boolean {
  const plan = getPlanConfig(planId);
  const value = plan.limits[feature];

  switch (feature) {
    case 'commercialUse':
      return Boolean(value);
    case 'waitTime':
      return (value as number) === 0;
    default:
      return Boolean(value);
  }
}

/**
 * 获取计划的字符限制
 */
export function getPlanCharacterLimit(planId: PlanId): number {
  const plan = getPlanConfig(planId);
  return planId === 'free'
    ? plan.limits.dailyCharacters!
    : plan.limits.monthlyCharacters!;
}

/**
 * 订阅系统配置常量
 */
export const SUBSCRIPTION_CONFIG = {
  // 默认计划
  DEFAULT_PLAN: 'free' as PlanId,

  // 试用期设置
  TRIAL_DAYS: 0, // 暂不提供试用期

  // 宽限期设置 (订阅过期后的宽限期)
  GRACE_PERIOD_DAYS: 3,

  // 使用量重置时间 (UTC)
  DAILY_RESET_HOUR: 0, // 每日0点重置
  MONTHLY_RESET_DAY: 1, // 每月1号重置

  // 缓存设置
  USAGE_CACHE_TTL: 60 * 1000, // 1分钟缓存

  // 限制检查设置
  SOFT_LIMIT_WARNING_THRESHOLD: 0.8, // 80%时显示警告
  HARD_LIMIT_THRESHOLD: 1.0, // 100%时禁止使用
} as const;
