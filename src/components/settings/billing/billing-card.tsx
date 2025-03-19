'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomerPortalButton } from '@/components/payment/customer-portal-button';
import { CheckoutButton } from '@/components/payment/checkout-button';
import { getAllPlans } from '@/payment';
import { PricePlan } from '@/payment/types';

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
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title', {defaultValue: 'Billing & Subscription'})}</h1>
          <p className="text-muted-foreground mt-2">
            {t('description', {defaultValue: 'Manage your subscription and billing information'})}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('currentPlan.title', {defaultValue: 'Current Plan'})}</CardTitle>
              <CardDescription>{t('currentPlan.description', {defaultValue: 'Your current subscription details'})}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{currentPlan?.name}</div>
                    <Badge variant={currentPlan?.isFree ? 'outline' : 'default'}>
                      {billingData.subscription?.status === 'active' ? 
                        t('status.active', {defaultValue: 'Active'}) : 
                       billingData.subscription?.status === 'trialing' ? 
                        t('status.trial', {defaultValue: 'Trial'}) : 
                        t('status.free', {defaultValue: 'Free'})}
                    </Badge>
                  </div>
                  
                  {billingData.subscription && currentPrice && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        {formatPrice(currentPrice.amount, currentPrice.currency)} / {currentPrice.interval === 'month' ? 
                          t('interval.month', {defaultValue: 'month'}) : 
                         currentPrice.interval === 'year' ? 
                          t('interval.year', {defaultValue: 'year'}) : 
                          t('interval.oneTime', {defaultValue: 'one-time'})}
                      </div>
                      
                      {nextBillingDate && (
                        <div>{t('nextBillingDate', {defaultValue: 'Next billing date:'})} {nextBillingDate}</div>
                      )}
                      
                      {billingData.subscription.status === 'trialing' && (
                        <div className="text-amber-500">
                          {t('trialEnds', {defaultValue: 'Trial ends:'})} {new Intl.DateTimeFormat('en-US', { 
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
                      {t('freePlanMessage', {defaultValue: 'You are currently on the free plan with limited features.'})}
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
                  {t('manageSubscription', {defaultValue: 'Manage Subscription'})}
                </CustomerPortalButton>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t('upgradeMessage', {defaultValue: 'Upgrade to a paid plan to access more features'})}
                </div>
              )}
            </CardFooter>
          </Card>

          {/* Payment Method Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('paymentMethod.title', {defaultValue: 'Payment Method'})}</CardTitle>
              <CardDescription>{t('paymentMethod.description', {defaultValue: 'Manage your payment methods'})}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : billingData.subscription ? (
                <div className="text-sm">
                  <p>{t('paymentMethod.manageMessage', {defaultValue: 'Manage your payment methods through the Stripe Customer Portal.'})}</p>
                  <p className="mt-2 text-muted-foreground">
                    {t('paymentMethod.securityMessage', {defaultValue: 'You can add, remove, or update your payment methods securely through the Stripe portal.'})}
                  </p>
                </div>
              ) : (
                <div className="text-sm">
                  <p>{t('paymentMethod.noMethodsMessage', {defaultValue: 'No payment methods on file.'})}</p>
                  <p className="mt-2 text-muted-foreground">
                    {t('paymentMethod.upgradePromptMessage', {defaultValue: 'You\'ll be prompted to add a payment method when upgrading to a paid plan.'})}
                  </p>
                </div>
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
                  {t('managePaymentMethods', {defaultValue: 'Manage Payment Methods'})}
                </CustomerPortalButton>
              ) : (
                <div />
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Upgrade Options */}
        {!loading && !billingData.subscription && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t('upgradePlan.title', {defaultValue: 'Upgrade Your Plan'})}</h2>
              <p className="text-muted-foreground mt-1">
                {t('upgradePlan.description', {defaultValue: 'Choose a plan that works for you'})}
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
                      <CardContent className="flex-grow">
                        <div className="mb-4">
                          <span className="text-3xl font-bold">
                            {formatPrice(price.amount, price.currency)}
                          </span>
                          <span className="text-muted-foreground">
                            {price.interval === 'month' ? 
                              `/${t('interval.month', {defaultValue: 'month'})}` : 
                             price.interval === 'year' ? 
                              `/${t('interval.year', {defaultValue: 'year'})}` : 
                              ''}
                          </span>
                        </div>

                        {price.trialPeriodDays && price.trialPeriodDays > 0 && (
                          <Badge variant="outline" className="mb-4">
                            {t('trialDays', {
                              defaultValue: '{{days}} day trial',
                              days: price.trialPeriodDays
                            })}
                          </Badge>
                        )}

                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-5 w-5 text-primary flex-shrink-0 mr-2"
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
                            defaultValue: 'Upgrade to {{planName}}',
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
                              className="h-5 w-5 text-primary flex-shrink-0 mr-2"
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
                        <span className="text-xl font-bold mb-2">{t('customPricing', {defaultValue: 'Custom Pricing'})}</span>
                        <Button className="w-full md:w-auto" variant="default" asChild>
                          <a href="mailto:sales@yourcompany.com">{t('contactSales', {defaultValue: 'Contact Sales'})}</a>
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
            <h2 className="text-2xl font-bold tracking-tight">{t('billingHistory.title', {defaultValue: 'Billing History'})}</h2>
            <p className="text-muted-foreground mt-1">
              {t('billingHistory.description', {defaultValue: 'View and download your past invoices'})}
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
                    {t('billingHistory.accessMessage', {defaultValue: 'Access your billing history through the Stripe Customer Portal'})}
                  </p>
                  <CustomerPortalButton 
                    customerId={billingData.user.customerId}
                    className="mt-4"
                  >
                    {t('viewBillingHistory', {defaultValue: 'View Billing History'})}
                  </CustomerPortalButton>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    {t('billingHistory.noHistoryMessage', {defaultValue: 'No billing history available'})}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 