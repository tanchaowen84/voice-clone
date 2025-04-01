'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { PricePlan } from '@/payment/types';
import { PricingCard } from './pricing-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface PricingTableProps {
  plans: PricePlan[];
  email?: string;
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
  email,
  metadata,
  currentPlanId,
  className,
}: PricingTableProps) {
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  // Filter plans into free, subscription and one-time plans
  const freePlans = plans.filter(plan => plan.isFree);
  
  const subscriptionPlans = plans.filter(plan => 
    !plan.isFree && plan.prices.some(price => price.type === 'recurring')
  );
  
  const oneTimePlans = plans.filter(plan => 
    !plan.isFree && plan.prices.some(price => price.type === 'one_time')
  );

  // Check if any plan has a monthly price option
  const hasMonthlyOption = subscriptionPlans.some(plan => 
    plan.prices.some(price => price.type === 'recurring' && price.interval === 'month')
  );

  // Check if any plan has a yearly price option
  const hasYearlyOption = subscriptionPlans.some(plan => 
    plan.prices.some(price => price.type === 'recurring' && price.interval === 'year')
  );

  const handleIntervalChange = (value: string) => {
    setInterval(value as 'month' | 'year');
  };

  return (
    <div className={className}>
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
              <ToggleGroupItem value="month" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-4 py-2">
                Monthly
              </ToggleGroupItem>
            )}
            {hasYearlyOption && (
              <ToggleGroupItem value="year" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-4 py-2">
                Yearly
                {/* <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                  Save 25%
                </span> */}
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
            interval={interval}
            email={email}
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
            paymentType="recurring"
            email={email}
            metadata={metadata}
            isCurrentPlan={currentPlanId === plan.id}
          />
        ))}
        
        {/* Render one-time plans (always visible) */}
        {oneTimePlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            interval={interval}
            paymentType="one_time"
            email={email}
            metadata={metadata}
            isCurrentPlan={currentPlanId === plan.id}
          />
        ))}
      </div>
      
    </div>
  );
} 