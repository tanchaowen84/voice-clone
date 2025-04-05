'use client';

import { getUserSubscriptionAction } from '@/actions/get-user-subscription';
import { CustomerPortalButton } from '@/components/payment/customer-portal-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/use-current-user';
import { LocaleLink } from '@/i18n/navigation';
import { formatDate, formatPrice } from '@/lib/formatter';
import { getAllPlans } from '@/payment';
import { PlanIntervals, Subscription } from '@/payment/types';
import { RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

export default function BillingCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.billing');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>('');
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const currentUser = useCurrentUser();
  const isLifetimeMember = currentUser?.lifetimeMember === true;

  // Get all available plans
  const plans = getAllPlans();

  // Fetch user subscription data if user has a subscription ID
  const fetchUserSubscription = async () => {
    setLoading(true);
    setError('');

    try {
      // Only fetch subscription data if user has a subscription ID and is not a lifetime member
      if (currentUser?.subscriptionId && !isLifetimeMember) {
        const result = await getUserSubscriptionAction();
        if (result?.data?.success && result.data.data) {
          setSubscription(result.data.data);
        } else {
          setError(result?.data?.error || t('errorMessage'));
        }
      } else {
        // Set subscription to null if user doesn't have one or is a lifetime member
        setSubscription(null);
      }
    } catch (error) {
      console.error('fetch subscription data error:', error);
      setError(t('errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSubscription();
  }, [currentUser]);

  // Use useMemo to derive values from subscription state
  const { currentPlan, currentPrice, nextBillingDate, canUpgrade } = useMemo(() => {
    // Determine current plan based on user status
    const currentPlan = isLifetimeMember
      ? plans.find(plan => plan.isLifetime)
      : subscription
        ? plans.find(plan => plan.id === subscription?.planId)
        : plans.find(plan => plan.isFree);

    // Determine current price details if subscription exists
    const currentPrice = subscription && currentPlan?.prices.find(
      price => price.productId === subscription?.priceId
    );

    // Calculate next billing date for subscriptions
    const nextBillingDate = subscription?.currentPeriodEnd
      ? formatDate(subscription.currentPeriodEnd)
      : null;

    // Determine if the user can upgrade (not a lifetime member)
    const canUpgrade = !isLifetimeMember;

    return { currentPlan, currentPrice, nextBillingDate, canUpgrade };
  }, [isLifetimeMember, plans, subscription]);

  return (
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
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : error ? (
            <div className="text-destructive text-sm">{error}</div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="font-medium">{currentPlan?.name}</div>
                <Badge variant={currentPlan?.isFree || isLifetimeMember ? 'outline' : 'default'}>
                  {isLifetimeMember
                    ? t('status.lifetime')
                    : subscription?.status === 'active'
                      ? t('status.active')
                      : subscription?.status === 'trialing'
                        ? t('status.trial')
                        : t('status.free')}
                </Badge>
              </div>

              {/* Subscription plan details */}
              {subscription && currentPrice && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    {formatPrice(currentPrice.amount, currentPrice.currency)} / {currentPrice.interval === PlanIntervals.MONTH ?
                      t('interval.month') :
                      currentPrice.interval === PlanIntervals.YEAR ?
                        t('interval.year') :
                        t('interval.oneTime')}
                  </div>

                  {nextBillingDate && (
                    <div>{t('nextBillingDate')} {nextBillingDate}</div>
                  )}

                  {subscription.status === 'trialing' && (
                    <div className="text-amber-500">
                      {t('trialEnds')} {formatDate(subscription.currentPeriodEnd)}
                    </div>
                  )}
                </div>
              )}

              {/* Free plan message */}
              {currentPlan?.isFree && (
                <div className="text-sm text-muted-foreground">
                  {t('freePlanMessage')}
                </div>
              )}

              {/* Lifetime access message */}
              {isLifetimeMember && (
                <div className="text-sm text-muted-foreground">
                  {t('lifetimeMessage')}
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter>
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : error ? (
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={fetchUserSubscription}
            >
              <RefreshCwIcon className="size-4 mr-1" />
              {t('retry')}
            </Button>
          ) : (
            <div className="grid w-full gap-3 lg:grid-cols-2">
              {/* Manage subscription button */}
              {subscription && currentUser?.customerId && (
                <CustomerPortalButton
                  customerId={currentUser.customerId}
                  className="w-full"
                >
                  {t('manageSubscription')}
                </CustomerPortalButton>
              )}

              {/* View pricing plans button - only shown if user can upgrade */}
              {canUpgrade && (
                <Button
                  variant={subscription ? "outline" : "default"}
                  className="w-full cursor-pointer"
                  asChild
                >
                  <LocaleLink href="/pricing">
                    {/* <RocketIcon className="size-4 mr-2" /> */}
                    {'Change Plan'}
                  </LocaleLink>
                </Button>
              )}

              {/* Lifetime member billing history button */}
              {isLifetimeMember && currentUser?.customerId && (
                <CustomerPortalButton
                  customerId={currentUser.customerId}
                  className="w-full"
                >
                  {t('viewBillingHistory')}
                </CustomerPortalButton>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}