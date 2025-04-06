'use client';

import { CustomerPortalButton } from '@/components/payment/customer-portal-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LocaleLink } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { formatDate, formatPrice } from '@/lib/formatter';
import { getAllPlans } from '@/payment';
import { PlanIntervals } from '@/payment/types';
import { RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';

export default function BillingCard() {
  const t = useTranslations('Dashboard.settings.billing');
  const [error, setError] = useState<string | undefined>('');
  
  // Use our subscription hook
  const { 
    subscription, 
    isLifetimeMember, 
    isFreePlan, 
    isLoading: isLoadingSubscription, 
    refetch,
    error: subscriptionError 
  } = useSubscription();

  // Get user session for customer ID
  const { data: session, isPending: isLoadingSession } = authClient.useSession();
  const currentUser = session?.user;

  // Get all available plans
  const plans = getAllPlans();

  // Determine current plan based on user status
  const currentPlan = isLifetimeMember
    ? plans.find(plan => plan.isLifetime)
    : subscription
      ? plans.find(plan => plan.id === subscription?.planId)
      : plans.find(plan => plan.isFree);

  // Get subscription price details
  const currentPrice = subscription && currentPlan?.prices.find(
    price => price.priceId === subscription?.priceId
  );

  // Format next billing date if subscription is active
  const nextBillingDate = subscription?.currentPeriodEnd
    ? formatDate(subscription.currentPeriodEnd)
    : null;

  // Determine if we are in a loading state
  const isPageLoading = isLoadingSubscription || isLoadingSession;

  // Handle errors from the subscription store
  const displayError = error || subscriptionError;

  // Render loading skeleton
  if (isPageLoading) {
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
  if (displayError) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('currentPlan.title')}</CardTitle>
            <CardDescription>{t('currentPlan.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-destructive text-sm">{displayError}</div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => refetch()}
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
          {/* Plan name and status */}
          <div className="flex items-center justify-between">
            <div className="text-3xl font-medium">
              {currentPlan?.name}
            </div>
            <Badge variant={isFreePlan || isLifetimeMember ? 'outline' : 'default'}>
              {isLifetimeMember
                ? t('status.lifetime')
                : subscription?.status === 'active'
                  ? t('status.active')
                  : subscription?.status === 'trialing'
                    ? t('status.trial')
                    : t('status.free')}
            </Badge>
          </div>

          {/* Free plan message */}
          {isFreePlan && (
            <div className="text-sm text-muted-foreground">
              {t('freePlanMessage')}
            </div>
          )}

          {/* Lifetime plan message */}
          {isLifetimeMember && (
            <div className="text-sm text-muted-foreground">
              {t('lifetimeMessage')}
            </div>
          )}

          {/* Subscription plan message */}
          {subscription && currentPrice && (
            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                {t('price')} {formatPrice(currentPrice.amount, currentPrice.currency)} / {currentPrice.interval === PlanIntervals.MONTH ?
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
        </CardContent>
        <CardFooter>
          <div className="w-full gap-4 flex flex-col">
            {/* Show upgrade plan button - only shown if user is on free plan */}
            {isFreePlan && (
              <Button
                variant="default"
                className="w-full cursor-pointer"
                asChild
              >
                <LocaleLink href="/pricing">
                  {t('upgradePlan')}
                </LocaleLink>
              </Button>
            )}

            {/* Manage billing button - only shown if user is lifetime member */}
            {isLifetimeMember && currentUser?.customerId && (
              <CustomerPortalButton
                customerId={currentUser.customerId}
                className="w-full"
              >
                {t('manageBilling')}
              </CustomerPortalButton>
            )}

            {/* Manage subscription button - only shown if user has subscription */}
            {subscription && currentUser?.customerId && (
              <CustomerPortalButton
                customerId={currentUser.customerId}
                className="w-full"
              >
                {t('manageSubscription')}
              </CustomerPortalButton>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}