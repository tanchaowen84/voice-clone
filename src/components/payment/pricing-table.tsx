'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { PaymentTypes, PlanInterval, PlanIntervals, PricePlan } from '@/payment/types';
import { useState } from 'react';
import { PricingCard } from './pricing-card';
import { useTranslations } from 'next-intl';

interface PricingTableProps {
  plans: PricePlan[];
  metadata?: Record<string, string>;
  currentPlanId?: string;
  className?: string;
}

/**
 * Pricing Table Component
 * 
 * Displays all pricing plans with interval selection tabs for subscription plans
 * Free plans and one-time purchase plans are always displayed
 */
export function PricingTable({
  plans,
  metadata,
  currentPlanId,
  className,
}: PricingTableProps) {
  const t = useTranslations('PricingPage');
  const [interval, setInterval] = useState<PlanInterval>(PlanIntervals.MONTH);

  // Filter plans into free, subscription and one-time plans
  const freePlans = plans.filter(plan => plan.isFree);

  const subscriptionPlans = plans.filter(plan =>
    !plan.isFree && plan.prices.some(price => price.type === PaymentTypes.RECURRING)
  );

  const oneTimePlans = plans.filter(plan =>
    !plan.isFree && plan.prices.some(price => price.type === PaymentTypes.ONE_TIME)
  );

  // Check if any plan has a monthly price option
  const hasMonthlyOption = subscriptionPlans.some(plan =>
    plan.prices.some(price => price.type === PaymentTypes.RECURRING
      && price.interval === PlanIntervals.MONTH)
  );

  // Check if any plan has a yearly price option
  const hasYearlyOption = subscriptionPlans.some(plan =>
    plan.prices.some(price => price.type === PaymentTypes.RECURRING
      && price.interval === PlanIntervals.YEAR)
  );

  const handleIntervalChange = (value: string) => {
    setInterval(value as PlanInterval);
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Show interval toggle if there are subscription plans */}
      {(hasMonthlyOption || hasYearlyOption) && subscriptionPlans.length > 0 && (
        <div className="flex justify-center mb-8">
          <ToggleGroup
            type="single"
            value={interval}
            onValueChange={(value) => value && handleIntervalChange(value)}
            className="border rounded-lg p-1"
          >
            {hasMonthlyOption && (
              <ToggleGroupItem value="month" className={cn("px-3 py-0 cursor-pointer text-sm rounded-md",
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground")}>
                {t('monthly')}
              </ToggleGroupItem>
            )}
            {hasYearlyOption && (
              <ToggleGroupItem value="year" className={cn("px-3 py-0 cursor-pointer text-sm rounded-md",
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground")}>
                {t('yearly')}
              </ToggleGroupItem>
            )}
          </ToggleGroup>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render free plans (always visible) */}
        {freePlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            metadata={metadata}
            isCurrentPlan={currentPlanId === plan.id}
          />
        ))}

        {/* Render subscription plans with the selected interval */}
        {subscriptionPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            interval={interval}
            paymentType={PaymentTypes.RECURRING}
            metadata={metadata}
            isCurrentPlan={currentPlanId === plan.id}
          />
        ))}

        {/* Render one-time plans (always visible) */}
        {oneTimePlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            paymentType={PaymentTypes.ONE_TIME}
            metadata={metadata}
            isCurrentPlan={currentPlanId === plan.id}
          />
        ))}
      </div>
    </div>
  );
} 