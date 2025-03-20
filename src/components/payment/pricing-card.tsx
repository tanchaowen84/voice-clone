'use client';

import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanInterval, PricePlan, Price, PaymentType } from '@/payment/types';
import { CheckoutButton } from './checkout-button';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: PricePlan;
  interval: PlanInterval;
  paymentType?: PaymentType; // 'recurring' or 'one_time'
  email?: string;
  metadata?: Record<string, string>;
  className?: string;
  isCurrentPlan?: boolean;
}

/**
 * Format a price for display
 * @param price Price amount in currency units (dollars, euros, etc.)
 * @param currency Currency code
 * @returns Formatted price string
 */
function formatPrice(price: number | undefined, currency: string): string {
  if (price === undefined) {
    return 'Free';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  });

  return formatter.format(price / 100); // Convert from cents to dollars
}

/**
 * Get the appropriate price object for the selected interval and payment type
 * @param plan The price plan
 * @param interval The selected interval (month or year)
 * @param paymentType The payment type (recurring or one_time)
 * @returns The price object or undefined if not found
 */
function getPriceForPlan(
  plan: PricePlan, 
  interval: PlanInterval,
  paymentType: PaymentType = 'recurring'
): Price | undefined {
  if (plan.isFree) {
    return undefined;
  }
  
  return plan.prices.find(price => {
    if (paymentType === 'one_time') {
      return price.type === 'one_time';
    }
    return price.type === 'recurring' && price.interval === interval;
  });
}

/**
 * Pricing Card Component
 * 
 * Displays a single pricing plan with features and action button
 */
export function PricingCard({
  plan,
  interval,
  paymentType = 'recurring',
  email,
  metadata,
  className,
  isCurrentPlan = false,
}: PricingCardProps) {
  const price = getPriceForPlan(plan, interval, paymentType);
  const formattedPrice = plan.isFree ? 'Free' : price ? formatPrice(price.amount, price.currency) : 'Not Available';
  
  // Generate pricing label based on payment type and interval
  let priceLabel = '';
  if (!plan.isFree && price) {
    if (paymentType === 'one_time') {
      priceLabel = 'lifetime';
    } else if (interval === 'month') {
      priceLabel = '/month';
    } else if (interval === 'year') {
      priceLabel = '/year';
    }
  }

  const isPlanAvailable = plan.isFree || !!price;
  const hasTrialPeriod = price?.trialPeriodDays && price.trialPeriodDays > 0;

  return (
    <Card 
      className={cn(
        "flex flex-col h-full overflow-hidden transition-all",
        plan.recommended && "border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/20",
        isCurrentPlan && "border-green-500 shadow-lg shadow-green-100 dark:shadow-green-900/20",
        className
      )}
    >
      <CardHeader>
        {plan.recommended && (
          <div className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full w-fit mb-3">
            Recommended
          </div>
        )}
        {isCurrentPlan && (
          <div className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-full w-fit mb-3">
            Current Plan
          </div>
        )}
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription className="min-h-12">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <div className="mb-3">
          <span className="text-3xl font-bold">{formattedPrice}</span>
          {priceLabel && (
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              {priceLabel}
            </span>
          )}
        </div>

        {hasTrialPeriod && (
          <div className="mb-4">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
              {price.trialPeriodDays}-day free trial
            </span>
          </div>
        )}

        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {plan.isFree ? (
          <div className="w-full">
            <div className="px-3 py-2 text-sm text-center bg-gray-100 dark:bg-gray-800 rounded-md w-full">
              Free Plan - No Payment Required
            </div>
          </div>
        ) : isCurrentPlan ? (
          <div className="w-full">
            <div className="px-3 py-2 text-sm text-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md w-full">
              Your Current Plan
            </div>
          </div>
        ) : isPlanAvailable && price ? (
          <CheckoutButton
            planId={plan.id}
            priceId={price.productId}
            email={email}
            metadata={metadata}
            className="w-full"
          >
            {paymentType === 'one_time' ? 'Purchase Now' : 'Subscribe Now'}
          </CheckoutButton>
        ) : (
          <div className="w-full">
            <div className="px-3 py-2 text-sm text-center bg-gray-100 dark:bg-gray-800 rounded-md w-full">
              Not Available
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 