'use client';

import { CheckoutButton } from '@/components/payment/checkout-button';
import { CustomerPortalButton } from '@/components/payment/customer-portal-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllPlans } from '@/payment';
import { PricePlan } from '@/payment/types';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

// Utility function to format prices
const formatPrice = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);
};

// Mock user data - in a real app, this would come from your auth system
const mockUser = {
  id: 'user_123',
  email: 'user@example.com',
  customerId: 'cus_mock123', // Stripe customer ID
  name: 'John Doe',
};

// Mock subscription data
const mockSubscription = {
  id: 'sub_mock123',
  status: 'active' as const,
  planId: 'pro',
  priceId: 'price_mock123',
  interval: 'month' as const,
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
};

// Mock trial subscription data
const mockTrialSubscription = {
  id: 'sub_mocktrial123',
  status: 'trialing' as const,
  planId: 'pro',
  priceId: 'price_mocktrial123',
  interval: 'month' as const,
  currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
};

// Helper function to check if a plan is an enterprise plan based on metadata
const isEnterprisePlan = (plan: PricePlan): boolean => {
  return plan.id === 'enterprise' || plan.name.toLowerCase().includes('enterprise');
};

export default function BillingCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.billing');

  const [loading, setLoading] = useState(true);
  const [billingData, setBillingData] = useState<{
    subscription: typeof mockSubscription | typeof mockTrialSubscription | null;
    user: typeof mockUser;
  }>({
    subscription: null,
    user: mockUser,
  });

  // Simulate fetching billing data
  useEffect(() => {
    const fetchBillingData = async () => {
      // In a real app, you would fetch this data from an API endpoint or server action
      // Example: const { data } = await getUserBillingData();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Randomly select between different subscription states
      const random = Math.random();
      let subscription = null;
      if (random < 0.33) {
        subscription = mockSubscription;
      } else if (random < 0.66) {
        subscription = mockTrialSubscription;
      }

      setBillingData({
        user: mockUser,
        subscription,
      });

      setLoading(false);
    };

    fetchBillingData();
  }, []);

  // Get all available plans
  const plans = getAllPlans();

  // Find current plan details if subscription exists
  const currentPlan = billingData.subscription
    ? plans.find(plan => plan.id === billingData.subscription?.planId)
    : plans.find(plan => plan.isFree);

  // Determine current price details if subscription exists
  const currentPrice = billingData.subscription && currentPlan?.prices.find(
    price => price.productId === billingData.subscription?.priceId
  );

  // Calculate next billing date
  const nextBillingDate = billingData.subscription?.currentPeriodEnd
    ? new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(billingData.subscription.currentPeriodEnd)
    : null;

  return (
    <div className="space-y-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('currentPlan.title')}</CardTitle>
            <CardDescription>{t('currentPlan.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="font-medium">{currentPlan?.name}</div>
                  <Badge variant={currentPlan?.isFree ? 'outline' : 'default'}>
                    {billingData.subscription?.status === 'active' ?
                      t('status.active') :
                      billingData.subscription?.status === 'trialing' ?
                        t('status.trial') :
                        t('status.free')}
                  </Badge>
                </div>

                {billingData.subscription && currentPrice && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      {formatPrice(currentPrice.amount, currentPrice.currency)} / {currentPrice.interval === 'month' ?
                        t('interval.month') :
                        currentPrice.interval === 'year' ?
                          t('interval.year') :
                          t('interval.oneTime')}
                    </div>

                    {nextBillingDate && (
                      <div>{t('nextBillingDate')} {nextBillingDate}</div>
                    )}

                    {billingData.subscription.status === 'trialing' && (
                      <div className="text-amber-500">
                        {t('trialEnds')} {new Intl.DateTimeFormat('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }).format(billingData.subscription.currentPeriodEnd)}
                      </div>
                    )}
                  </div>
                )}

                {currentPlan?.isFree && (
                  <div className="text-sm text-muted-foreground">
                    {t('freePlanMessage')}
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter>
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : billingData.subscription ? (
              <CustomerPortalButton
                customerId={billingData.user.customerId}
                className="w-full"
              >
                {t('manageSubscription')}
              </CustomerPortalButton>
            ) : (
              <div className="text-sm text-muted-foreground">
                {t('upgradeMessage')}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Upgrade Options */}
      {!loading && !billingData.subscription && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('upgradePlan.title')}</h2>
            <p className="text-muted-foreground mt-1">
              {t('upgradePlan.description')}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {plans
              .filter(plan => !plan.isFree && !isEnterprisePlan(plan))
              .map(plan => {
                // Get monthly price if available, otherwise first price
                const price = plan.prices.find(p => p.type === 'recurring' && p.interval === 'month') || plan.prices[0];
                if (!price) return null;

                return (
                  <Card key={plan.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grow">
                      <div className="mb-4">
                        <span className="text-3xl font-bold">
                          {formatPrice(price.amount, price.currency)}
                        </span>
                        <span className="text-muted-foreground">
                          {price.interval === 'month' ?
                            `/${t('interval.month')}` :
                            price.interval === 'year' ?
                              `/${t('interval.year')}` :
                              ''}
                        </span>
                      </div>

                      {price.trialPeriodDays && price.trialPeriodDays > 0 && (
                        <Badge variant="outline" className="mb-4">
                          {t('trialDays', {
                            days: price.trialPeriodDays
                          })}
                        </Badge>
                      )}

                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="h-5 w-5 text-primary shrink-0 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <CheckoutButton
                        planId={plan.id}
                        priceId={price.productId}
                        email={billingData.user.email}
                        metadata={{ userId: billingData.user.id }}
                        className="w-full"
                      >
                        {t('upgradeToPlan', {
                          planName: plan.name
                        })}
                      </CheckoutButton>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>

          {/* Enterprise Plan */}
          {plans
            .filter(plan => isEnterprisePlan(plan))
            .map(plan => (
              <Card key={plan.id} className="bg-muted/40">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <ul className="space-y-2 mb-6 md:mb-0">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-primary shrink-0 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col items-start md:items-end">
                      <span className="text-xl font-bold mb-2">{t('customPricing')}</span>
                      <Button className="w-full md:w-auto" variant="default" asChild>
                        <a href="mailto:sales@yourcompany.com">{t('contactSales')}</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Billing History */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('billingHistory.title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('billingHistory.description')}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : billingData.subscription ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  {t('billingHistory.accessMessage')}
                </p>
                <CustomerPortalButton
                  customerId={billingData.user.customerId}
                  className="mt-4"
                >
                  {t('viewBillingHistory')}
                </CustomerPortalButton>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  {t('billingHistory.noHistoryMessage')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 