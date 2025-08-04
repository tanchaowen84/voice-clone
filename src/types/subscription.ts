/**
 * 订阅系统类型定义
 */

import type { PlanId, PlanLimits, SubscriptionPlan } from '@/config/subscription-config';

/**
 * 用户订阅信息
 */
export interface UserSubscription {
  id: string;
  userId: string;
  planId: PlanId;
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户使用统计 (每日)
 */
export interface DailyUsage {
  id: string;
  userId: string;
  usageDate: string; // YYYY-MM-DD format
  charactersUsed: number;
  requestsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户使用统计 (每月)
 */
export interface MonthlyUsage {
  id: string;
  userId: string;
  monthYear: string; // YYYY-MM format
  charactersUsed: number;
  requestsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 使用量检查结果
 */
export interface UsageCheckResult {
  allowed: boolean;
  reason?: UsageLimitReason;
  waitTime?: number;
  remainingQuota?: number;
  currentUsage?: number;
  limit?: number;
}

/**
 * 使用限制原因
 */
export type UsageLimitReason = 
  | 'CHAR_LIMIT_EXCEEDED'           // 单次请求字符超限
  | 'DAILY_LIMIT_EXCEEDED'          // 每日配额超限
  | 'MONTHLY_LIMIT_EXCEEDED'        // 每月配额超限
  | 'PLAN_EXPIRED'                  // 订阅过期
  | 'INVALID_PLAN';                 // 无效计划

/**
 * 用户当前使用情况
 */
export interface UserUsageStats {
  planId: PlanId;
  planConfig: SubscriptionPlan;
  
  // 当前使用量
  currentUsage: {
    daily?: {
      used: number;
      limit: number;
      remaining: number;
      resetTime: Date;
    };
    monthly?: {
      used: number;
      limit: number;
      remaining: number;
      resetTime: Date;
    };
  };
  
  // 使用百分比
  usagePercentage: number;
  
  // 是否接近限制
  isNearLimit: boolean;
  isOverLimit: boolean;
  
  // 下次重置时间
  nextResetTime: Date;
}

/**
 * 升级建议
 */
export interface UpgradeRecommendation {
  currentPlan: PlanId;
  recommendedPlan: PlanId;
  reason: string;
  benefits: string[];
  savings?: {
    amount: number;
    percentage: number;
  };
}

/**
 * 订阅操作结果
 */
export interface SubscriptionActionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * 计费周期类型
 */
export type BillingInterval = 'month' | 'year';

/**
 * 支付状态
 */
export type PaymentStatus = 
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded';

/**
 * 订阅事件类型
 */
export type SubscriptionEventType =
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'subscription.expired'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'usage.limit_reached'
  | 'usage.limit_exceeded';

/**
 * 订阅事件
 */
export interface SubscriptionEvent {
  id: string;
  type: SubscriptionEventType;
  userId: string;
  planId: PlanId;
  data: Record<string, any>;
  createdAt: Date;
}

/**
 * 使用量更新请求
 */
export interface UsageUpdateRequest {
  userId: string;
  charactersUsed: number;
  requestsCount?: number;
  metadata?: Record<string, any>;
}

/**
 * 订阅计划比较
 */
export interface PlanComparison {
  current: SubscriptionPlan;
  target: SubscriptionPlan;
  differences: {
    feature: string;
    current: string | number | boolean;
    target: string | number | boolean;
    improved: boolean;
  }[];
  priceChange: {
    amount: number;
    percentage: number;
  };
}

/**
 * 免费用户等待状态
 */
export interface WaitingState {
  isWaiting: boolean;
  remainingTime: number;
  totalWaitTime: number;
  canSkip: boolean;
  onComplete: () => void;
  onUpgrade: () => void;
}

/**
 * API响应类型
 */
export interface SubscriptionApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

// 重新导出配置类型
export type { PlanId, PlanLimits, SubscriptionPlan } from '@/config/subscription-config';
