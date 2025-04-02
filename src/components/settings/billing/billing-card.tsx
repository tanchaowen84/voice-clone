'use client';

import { getUserBillingDataAction } from '@/actions/get-user-billing-data';
import { CheckoutButton } from '@/components/payment/create-checkout-button';
import { CustomerPortalButton } from '@/components/payment/customer-portal-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/use-current-user';
import { getAllPlans } from '@/payment';
import { Subscription } from '@/payment/types';
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

export default function BillingCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.billing');
  const currentUser = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Fetch real subscription data
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        if (!currentUser) {
          setLoading(false);
          return;
        }

        // Use an empty object as default params if we don't have customer ID
        const params = {
          // Safely access customerId if it exists on the user object
          customerId: (currentUser as any)?.customerId || undefined,
        };

        const result = await getUserBillingDataAction(params);

        if (result?.data?.success && result.data.data) {
          // Now the API just returns the subscription directly
          setSubscription(result.data.data);
        } else if (result?.data?.error) {
          setError(result.data.error);
        } else {
          setError('Failed to fetch subscription data');
        }
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError('Failed to load subscription information');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [currentUser]);

  // Get all available plans
  const plans = getAllPlans();

  // Find current plan details if subscription exists
  const currentPlan = subscription
    ? plans.find(plan => plan.id === subscription?.planId)
    : plans.find(plan => plan.isFree);

  // Determine current price details if subscription exists
  const currentPrice = subscription && currentPlan?.prices.find(
    price => price.productId === subscription?.priceId
  );

  // Calculate next billing date
  const nextBillingDate = subscription?.currentPeriodEnd
    ? new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(subscription.currentPeriodEnd)
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
            ) : error ? (
              <div className="text-destructive text-sm">{error}</div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="font-medium">{currentPlan?.name}</div>
                  <Badge variant={currentPlan?.isFree ? 'outline' : 'default'}>
                    {subscription?.status === 'active' ?
                      t('status.active') :
                      subscription?.status === 'trialing' ?
                        t('status.trial') :
                        t('status.free')}
                  </Badge>
                </div>

                {subscription && currentPrice && (
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

                    {subscription.status === 'trialing' && (
                      <div className="text-amber-500">
                        {t('trialEnds')} {new Intl.DateTimeFormat('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }).format(subscription.currentPeriodEnd)}
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
            ) : error ? (
              <div className="text-sm text-muted-foreground">
                {t('upgradeMessage')}
              </div>
            ) : subscription && (currentUser as any)?.customerId ? (
              <CustomerPortalButton
                customerId={(currentUser as any).customerId}
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
      {!loading && !error && !subscription && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('upgradePlan.title')}</h2>
            <p className="text-muted-foreground mt-1">
              {t('upgradePlan.description')}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {plans
              .filter(plan => !plan.isFree && !plan.name.toLowerCase().includes('enterprise'))
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
        </div>
      )}
    </div>
  );
} 