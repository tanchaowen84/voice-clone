'use client';

import { CustomerPortalButton } from '@/components/payment/customer-portal-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePayment } from '@/hooks/use-payment';
import { LocaleLink } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { formatDate, formatPrice } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { PlanIntervals } from '@/payment/types';
import { RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function BillingCard() {
  const t = useTranslations('Dashboard.settings.billing');

  const {
    isLoading: isLoadingPayment,
    error: paymentError,
    subscription,
    currentPlan,
    refetch
  } = usePayment();
  const isFreePlan = currentPlan?.isFree || false;
  const isLifetimeMember = currentPlan?.isLifetime || false;
  console.log('billing card, currentPlan', currentPlan);

  // Get user session for customer ID
  const { data: session, isPending: isLoadingSession } = authClient.useSession();
  const currentUser = session?.user;
  console.log('billing card, currentUser', currentUser);

  // Get subscription price details
  const currentPrice = subscription && currentPlan?.prices.find(
    price => price.priceId === subscription?.priceId
  );

  // Format next billing date if subscription is active
  const nextBillingDate = subscription?.currentPeriodEnd
    ? formatDate(subscription.currentPeriodEnd)
    : null;

  // Determine if we are in a loading state
  const isPageLoading = isLoadingPayment || isLoadingSession;
  // console.log('billing card, isLoadingPayment', isLoadingPayment, 'isLoadingSession', isLoadingSession);

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
  if (paymentError) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('currentPlan.title')}</CardTitle>
            <CardDescription>{t('currentPlan.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-destructive text-sm">{paymentError}</div>
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
    <div className="grid md:grid-cols-2 gap-8">
      <Card className={cn("w-full max-w-lg md:max-w-xl overflow-hidden pt-6 pb-0 flex flex-col")}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t('currentPlan.title')}
          </CardTitle>
          <CardDescription>
            {t('currentPlan.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
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

              {subscription.status === 'trialing' && subscription.currentPeriodEnd && (
                <div className="text-amber-500">
                  {t('trialEnds')} {formatDate(subscription.currentPeriodEnd)}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="mt-2 px-6 py-4 flex justify-end items-center bg-muted rounded-none">
            {/* user is on free plan, show upgrade plan button */}
            {isFreePlan && (
              <Button
                variant="default"
                className="cursor-pointer"
                asChild
              >
                <LocaleLink href="/pricing">
                  {t('upgradePlan')}
                </LocaleLink>
              </Button>
            )}

            {/* user is lifetime member, show manage billing button */}
            {isLifetimeMember && currentUser?.customerId && (
              <CustomerPortalButton
                customerId={currentUser.customerId}
                className=""
              >
                {t('manageBilling')}
              </CustomerPortalButton>
            )}

            {/* user has subscription, show manage subscription button */}
            {subscription && currentUser?.customerId && (
              <CustomerPortalButton
                customerId={currentUser.customerId}
                className=""
              >
                {t('manageSubscription')}
              </CustomerPortalButton>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}