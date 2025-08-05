'use client';

import { CheckoutButton } from '@/components/pricing/create-checkout-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getExtendedPaidPlans } from '@/config/subscription-config';
import { useCurrentUser } from '@/hooks/use-current-user';
import { formatPrice } from '@/lib/formatter';
import { useSubscriptionStore } from '@/stores/subscription-store';
import { CheckCircleIcon, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useState } from 'react';

/**
 * 升级Modal触发原因
 */
export type UpgradeTrigger =
  | 'character_limit' // 单次输入字数超出限制
  | 'daily_limit' // 每日用量超限
  | 'waiting_period'; // 等待期间点击升级

/**
 * 升级Modal属性
 */
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: UpgradeTrigger;
}

/**
 * 升级Modal组件
 *
 * 显示付费计划的功能对比和升级选项
 * 集成Creem支付流程
 */
export function UpgradeModal({
  isOpen,
  onClose,
  trigger = 'character_limit',
}: UpgradeModalProps) {
  const currentUser = useCurrentUser();

  // 状态管理
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>(
    'month'
  );
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  // 获取付费计划
  const paidPlans = getExtendedPaidPlans(billingInterval);

  // 找到推荐计划的索引
  const recommendedIndex = paidPlans.findIndex((plan) => plan.recommended);

  // 如果当前索引无效，重置为推荐计划
  if (currentPlanIndex >= paidPlans.length) {
    setCurrentPlanIndex(recommendedIndex >= 0 ? recommendedIndex : 0);
  }

  const currentPlan = paidPlans[currentPlanIndex];

  // 当切换billing interval时，重置到推荐计划
  const handleBillingIntervalChange = (newInterval: 'month' | 'year') => {
    setBillingInterval(newInterval);
    const newPlans = getExtendedPaidPlans(newInterval);
    const newRecommendedIndex = newPlans.findIndex((plan) => plan.recommended);
    setCurrentPlanIndex(newRecommendedIndex >= 0 ? newRecommendedIndex : 0);
  };

  // 根据触发原因生成标题和描述
  const getModalContent = () => {
    switch (trigger) {
      case 'character_limit':
        return {
          title: 'Upgrade to Process Longer Text',
          description:
            'Free users are limited to 100 characters per request. Upgrade to process longer text instantly.',
        };
      case 'daily_limit':
        return {
          title: 'Daily Limit Reached',
          description:
            "You've reached your daily limit of 1,000 characters. Upgrade for unlimited monthly usage.",
        };
      case 'waiting_period':
        return {
          title: 'Skip the Wait',
          description:
            'Upgrade to generate voice instantly without any waiting time.',
        };
      default:
        return {
          title: 'Upgrade Your Plan',
          description:
            'Unlock more features and higher limits with our paid plans.',
        };
    }
  };

  const { title } = getModalContent();

  // 轮播控制函数
  const goToPrevious = () => {
    setCurrentPlanIndex((prev) =>
      prev === 0 ? paidPlans.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentPlanIndex((prev) =>
      prev === paidPlans.length - 1 ? 0 : prev + 1
    );
  };

  // 如果不应该显示，直接返回null
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Zap className="h-7 w-7 text-purple-500" />
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* 月/年切换组件 */}
          <div className="flex justify-center">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5">
              <Button
                variant={billingInterval === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleBillingIntervalChange('month')}
                className="px-6 py-2.5 text-sm font-medium"
              >
                Monthly
              </Button>
              <Button
                variant={billingInterval === 'year' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleBillingIntervalChange('year')}
                className="px-6 py-2.5 text-sm font-medium"
              >
                Yearly
                {billingInterval === 'year' && (
                  <Badge className="ml-2 bg-green-500 text-white text-xs px-2 py-1">
                    Save 17%
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* 轮播计划展示 */}
          {currentPlan && (
            <div className="relative">
              {/* 轮播容器 */}
              <div className="flex items-center justify-center">
                {/* 左箭头 */}
                {paidPlans.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPrevious}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}

                {/* 计划卡片 - 扩展版 */}
                <div className="w-full mx-6">
                  <div
                    className={`relative border rounded-xl p-6 shadow-sm ${
                      currentPlan.recommended
                        ? 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {/* 推荐标签 */}
                    {currentPlan.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-500 text-white text-sm px-3 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    {/* 计划标题和价格 - 扩展版 */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-3">
                        {currentPlan.displayName}
                      </h3>
                      <div className="mb-3">
                        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                          {formatPrice(currentPlan.price, currentPlan.currency)}
                        </span>
                        {currentPlan.interval && (
                          <span className="text-slate-600 dark:text-slate-400 text-lg">
                            /{currentPlan.interval}
                          </span>
                        )}
                        {currentPlan.yearlyDiscount && (
                          <div className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                            Save {currentPlan.yearlyDiscount}% with yearly
                            billing
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {currentPlan.description}
                      </p>
                    </div>

                    {/* 核心功能列表 - 扩展版 */}
                    <div className="space-y-3 mb-6">
                      {/* 根据计划显示丰富功能 */}
                      {currentPlan.id === 'basic' ? (
                        <>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              100,000 characters per month
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              1,000 characters per request
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Instant generation
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              High-quality voice cloning
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Multiple voice styles
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Email support
                            </span>
                          </div>
                        </>
                      ) : currentPlan.id === 'pro' ? (
                        <>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              500,000 characters per month
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              2,000 characters per request
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Instant generation
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Premium voice quality
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Advanced voice customization
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Priority support
                            </span>
                          </div>
                        </>
                      ) : (
                        // 其他计划显示所有功能
                        currentPlan.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-center gap-3"
                          >
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              {feature}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* 升级按钮 - 扩展版 */}
                    <div className="mt-auto">
                      {currentUser ? (
                        <CheckoutButton
                          userId={currentUser.id}
                          planId={currentPlan.id}
                          priceId={
                            currentPlan.id === 'basic'
                              ? billingInterval === 'month'
                                ? process.env
                                    .NEXT_PUBLIC_CREEM_PRODUCT_ID_BASIC_MONTHLY ||
                                  ''
                                : process.env
                                    .NEXT_PUBLIC_CREEM_PRODUCT_ID_BASIC_YEARLY ||
                                  ''
                              : billingInterval === 'month'
                                ? process.env
                                    .NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO_MONTHLY ||
                                  ''
                                : process.env
                                    .NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO_YEARLY ||
                                  ''
                          }
                          metadata={{
                            userId: currentUser.id,
                            planId: currentPlan.id,
                            interval: billingInterval,
                            trigger: trigger,
                          }}
                          className="w-full py-3 text-base font-semibold"
                          variant={
                            currentPlan.recommended ? 'default' : 'outline'
                          }
                        >
                          Upgrade to {currentPlan.name}
                        </CheckoutButton>
                      ) : (
                        <Button
                          className="w-full py-3 text-base font-semibold"
                          disabled
                        >
                          Login Required
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 右箭头 */}
                {paidPlans.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* 轮播指示器 - 紧凑版 */}
              {paidPlans.length > 1 && (
                <div className="flex justify-center mt-2 space-x-1">
                  {paidPlans.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentPlanIndex(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index === currentPlanIndex
                          ? 'bg-purple-500'
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 升级Modal钩子
 * 提供便捷的modal控制方法
 */
export function useUpgradeModal() {
  const { upgradeModal, showUpgradeModal, hideUpgradeModal } =
    useSubscriptionStore();

  return {
    isOpen: upgradeModal.isOpen,
    trigger: upgradeModal.trigger,
    showModal: showUpgradeModal,
    hideModal: hideUpgradeModal,
  };
}
