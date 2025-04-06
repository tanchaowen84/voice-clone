'use client';

import { getCustomerSubscriptionAction } from '@/actions/get-customer-subscription';
import { CustomerPortalButton } from '@/components/payment/customer-portal-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LocaleLink } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { formatDate, formatPrice } from '@/lib/formatter';
import { getAllPlans } from '@/payment';
import { PlanIntervals, Subscription } from '@/payment/types';
import { RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function BillingCard() {
  const t = useTranslations('Dashboard.settings.billing');
  const [error, setError] = useState<string | undefined>('');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  // Get user session
  const { data: session, isPending: isLoadingSession } = authClient.useSession();
  const currentUser = session?.user;
  console.log('billing card, currentUser:', currentUser);

  // Check if user is a lifetime member
  const isLifetimeMember = currentUser?.lifetimeMember === true;
  const hasCustomerId = Boolean(currentUser?.customerId);

  // Get all available plans
  const plans = getAllPlans();
  console.log('billing card, plans:', plans);

  // Determine current plan based on user status
  const currentPlan = isLifetimeMember
    ? plans.find(plan => plan.isLifetime)
    : subscription
      ? plans.find(plan => plan.id === subscription?.planId)
      : plans.find(plan => plan.isFree);
  console.log('billing card, currentPlan:', currentPlan);

  // Show upgrade button if user is on free plan
  const canUpgrade = currentPlan?.isFree;
  console.log('billing card, canUpgrade:', canUpgrade);

  // Get subscription price details
  const currentPrice = subscription && currentPlan?.prices.find(
    price => price.priceId === subscription?.priceId
  );
  console.log('billing card, currentPrice:', currentPrice);

  // Format next billing date if subscription is active
  const nextBillingDate = subscription?.currentPeriodEnd
    ? formatDate(subscription.currentPeriodEnd)
    : null;
  console.log('billing card, nextBillingDate:', nextBillingDate);

  // Fetch customer subscription data
  const fetchSubscription = async () => {
    console.log('fetchSubscription, isLifetimeMember:', isLifetimeMember, 'hasCustomerId:', hasCustomerId);
    // Skip fetching if user is a lifetime member
    if (isLifetimeMember) return;

    // Skip fetching if user doesn't have a customer ID
    if (!hasCustomerId) return;

    setIsLoadingSubscription(true);
    setError('');

    try {
      const result = await getCustomerSubscriptionAction();

      if (result?.data?.success && result.data.data) {
        setSubscription(result.data.data);
      } else {
        setError(result?.data?.error || t('errorMessage'));
      }
    } catch (error) {
      console.error('Fetch subscription error:', error);
      setError(t('errorMessage'));
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // Fetch subscription when user data is available
  useEffect(() => {
    if (!isLoadingSession && currentUser) {
      fetchSubscription();
    }
  }, [isLoadingSession, currentUser]);

  // Determine if we are in a loading state
  const isLoading = isLoadingSession || isLoadingSubscription;

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('currentPlan.title')}</CardTitle>
            <CardDescription>{t('currentPlan.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('currentPlan.title')}</CardTitle>
            <CardDescription>{t('currentPlan.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-destructive text-sm">{error}</div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={fetchSubscription}
            >
              <RefreshCwIcon className="size-4 mr-1" />
              {t('retry')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('currentPlan.title')}</CardTitle>
          <CardDescription>{t('currentPlan.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-medium">
              {currentPlan?.name}
            </div>
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
        </CardContent>
        <CardFooter>
          <div className="grid w-full gap-3">
            {/* Manage subscription button - only shown if user has a customer ID */}
            {hasCustomerId && currentUser?.customerId && (
              <CustomerPortalButton
                customerId={currentUser.customerId}
                className="w-full"
              >
                {t('manageBilling')}
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
                  {t('upgradePlan')}
                </LocaleLink>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}