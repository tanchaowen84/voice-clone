'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { PaymentType, PaymentTypes, PlanInterval, PlanIntervals, Price, PricePlan } from '@/payment/types';
import { Check } from 'lucide-react';
import { CheckoutButton } from './create-checkout-button';

interface PricingCardProps {
  plan: PricePlan;
  interval?: PlanInterval; // 'month' or 'year'
  paymentType?: PaymentType; // 'recurring' or 'one_time'
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
function formatPrice(price: number, currency: string): string {
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
  interval?: PlanInterval,
  paymentType?: PaymentType
): Price | undefined {
  if (plan.isFree) { // Free plan has no price
    return undefined;
  }

  // non-free plans must have a price
  return plan.prices.find(price => {
    if (paymentType === PaymentTypes.ONE_TIME) {
      return price.type === PaymentTypes.ONE_TIME;
    }
    return price.type === PaymentTypes.RECURRING && price.interval === interval;
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
  paymentType,
  metadata,
  className,
  isCurrentPlan = false,
}: PricingCardProps) {
  // price of free plan is undefined
  const price = getPriceForPlan(plan, interval, paymentType);

  // generate formatted price and price label
  let formattedPrice = '';
  let priceLabel = '';
  if (plan.isFree) {
    formattedPrice = '$0';
  } else if (price && price.amount > 0) { // price is available
    formattedPrice = formatPrice(price.amount, price.currency);
    if (interval === PlanIntervals.MONTH) {
      priceLabel = '/month';
    } else if (interval === PlanIntervals.YEAR) {
      priceLabel = '/year';
    }
  } else {
    formattedPrice = 'Not Available';
  }

  // check if plan is not free and has a price
  const isPaidPlan = !plan.isFree && !!price;
  const hasTrialPeriod = price?.trialPeriodDays && price.trialPeriodDays > 0;

  return (
    <Card
      className={cn(
        "flex flex-col h-full",
        plan.recommended && "relative",
        isCurrentPlan && "border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/20",
        className
      )}
    >
      {plan.recommended && (
        <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 text-xs font-medium border border-purple-200 dark:border-purple-800 shadow-sm">
          Popular
        </span>
      )}
      {isCurrentPlan && (
        <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 text-xs font-medium border border-blue-200 dark:border-blue-800 shadow-sm">
          Current Plan
        </span>
      )}

      <CardHeader>
        <CardTitle className="font-medium">{plan.name}</CardTitle>

        <div className="flex items-baseline gap-2">
          <span className="my-4 block text-4xl font-semibold">
            {formattedPrice}
          </span>
          {priceLabel && <span className="text-2xl">{priceLabel}</span>}
        </div>

        <CardDescription className="text-sm">{plan.description}</CardDescription>

        {plan.isFree ? (
          <Button asChild variant="outline" className="mt-4 w-full">
            {/* TODO: add link to signup page */}
            <LocaleLink href="/auth/login">Get Started For Free</LocaleLink>
          </Button>
        ) : isCurrentPlan ? (
          <Button disabled className="mt-4 w-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-800 border border-blue-200 dark:border-blue-700">
            Your Current Plan
          </Button>
        ) : isPaidPlan ? (
          <CheckoutButton
            planId={plan.id}
            priceId={price.productId}
            metadata={metadata}
            className="mt-4 w-full cursor-pointer"
          >
            {paymentType === PaymentTypes.ONE_TIME ? 'Get Lifetime Access' : 'Get Started'}
          </CheckoutButton>
        ) : (
          <Button disabled className="mt-4 w-full">
            Not Available
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <hr className="border-dashed" />

        {hasTrialPeriod && (
          <div className="my-4">
            <span className="inline-block px-2.5 py-1.5 text-xs font-medium rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 shadow-sm">
              {price.trialPeriodDays}-day free trial
            </span>
          </div>
        )}

        <ul className="list-outside space-y-4 text-sm">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="size-4 text-green-500 dark:text-green-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 