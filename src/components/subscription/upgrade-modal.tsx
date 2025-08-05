'use client';

import { CheckoutButton } from '@/components/pricing/create-checkout-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getExtendedPaidPlans } from '@/config/subscription-config';
import { useCurrentUser } from '@/hooks/use-current-user';
import { formatPrice } from '@/lib/formatter';
import { useSubscriptionStore } from '@/stores/subscription-store';
import {
  CheckCircleIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react';
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
  const { subscription } = useSubscriptionStore();

  // 状态管理
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>(
    'month'
  );
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  // 添加调试日志
  console.log('🔍 [UpgradeModal] Props:', { isOpen, trigger });

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

  const { title, description } = getModalContent();

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
    console.log('🔍 [UpgradeModal] Not open, returning null');
    return null;
  }

  console.log('🔍 [UpgradeModal] Rendering modal dialog');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <DialogTitle className="text-xl font-semibold">
                {title}
              </DialogTitle>
            </div>
            {/* 只保留一个关闭按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-0 top-0 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-base text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 当前计划状态 */}
          {subscription && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    Current Plan: {subscription.planConfig.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {subscription.planConfig.description}
                  </p>
                </div>
                <Badge variant="outline">{subscription.planConfig.name}</Badge>
              </div>
            </div>
          )}

          {/* 月/年切换组件 */}
          <div className="flex justify-center">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <Button
                variant={billingInterval === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleBillingIntervalChange('month')}
                className="px-4 py-2"
              >
                Monthly
              </Button>
              <Button
                variant={billingInterval === 'year' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleBillingIntervalChange('year')}
                className="px-4 py-2"
              >
                Yearly
                {billingInterval === 'year' && (
                  <Badge className="ml-2 bg-green-500 text-white text-xs">
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
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 p-0"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}

                {/* 计划卡片 */}
                <div className="w-full max-w-md mx-8">
                  <div
                    className={`relative border rounded-lg p-6 ${
                      currentPlan.recommended
                        ? 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {/* 推荐标签 */}
                    {currentPlan.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-500 text-white">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    {/* 计划标题和价格 */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold mb-2">
                        {currentPlan.displayName}
                      </h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold">
                          {formatPrice(currentPlan.price, currentPlan.currency)}
                        </span>
                        {currentPlan.interval && (
                          <span className="text-slate-600 dark:text-slate-400">
                            /{currentPlan.interval}
                          </span>
                        )}
                        {currentPlan.yearlyDiscount && (
                          <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Save {currentPlan.yearlyDiscount}% with yearly
                            billing
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {currentPlan.description}
                      </p>
                    </div>

                    {/* 功能列表 */}
                    <div className="space-y-3 mb-6">
                      {currentPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* 升级按钮 */}
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
                          className="w-full"
                          variant={
                            currentPlan.recommended ? 'default' : 'outline'
                          }
                        >
                          Upgrade to {currentPlan.name}
                        </CheckoutButton>
                      ) : (
                        <Button className="w-full" disabled>
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
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 p-0"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* 轮播指示器 */}
              {paidPlans.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {paidPlans.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentPlanIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
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

          {/* 底部说明 */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p>✨ Instant activation • 💳 Secure payment • 🔄 Cancel anytime</p>
            <p>
              Need help choosing?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={onClose}
              >
                Compare all features
              </Button>
            </p>
          </div>
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
