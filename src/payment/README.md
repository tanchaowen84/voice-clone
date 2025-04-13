# Payment Module

This module provides a flexible payment integration with Stripe, supporting both subscription and one-time payments.

## Structure

- `/payment/types.ts` - Type definitions for the payment module
- `/payment/index.ts` - Main payment interface and global provider instance
- `/payment/provider/stripe.ts` - Stripe payment provider implementation
- `/actions/payment.ts` - Server actions for payment operations
- `/app/api/webhooks/stripe/route.ts` - API route for Stripe webhook events
- `/app/[locale]/(marketing)/payment/success/page.tsx` - Success page for completed checkout
- `/app/[locale]/(marketing)/payment/cancel/page.tsx` - Cancel page for abandoned checkout
- `/components/payment/checkout-button.tsx` - Button component to initiate checkout
- `/components/payment/customer-portal-button.tsx` - Button component to access Stripe customer portal
- `/components/payment/pricing-card.tsx` - Component to display a single pricing plan
- `/components/payment/pricing-table.tsx` - Component to display all pricing plans
- `/app/[locale]/(marketing)/pricing/page.tsx` - Pricing page using the pricing table component
- `/app/[locale]/(dashboard)/settings/billing/page.tsx` - Account billing page to manage subscriptions

## Environment Variables

The following environment variables are required:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Public Stripe Variables (used in client components)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=price_...
```

## Payment Plans

Payment plans are defined in `src/config/website.tsx`. Each plan can have multiple pricing options (monthly, yearly, one-time) with the following structure:

```typescript
// In src/config/website.tsx
export const websiteConfig = {
  // ...other config
  payment: {
    provider: 'stripe',
    plans: {
      free: {
        id: "free",
        prices: [],
        isFree: true,
        isLifetime: false,
      },
      pro: {
        id: "pro",
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
            amount: 990,
            currency: "USD",
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY!,
            amount: 9900,
            currency: "USD",
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        recommended: true,
      },
      lifetime: {
        id: "lifetime",
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME!,
            amount: 19900,
            currency: "USD",
          },
        ],
        isFree: false,
        isLifetime: true,
      }
    }
  }
}
```

## Server Actions

The payment module uses server actions for payment operations:

### In `/actions/payment.ts`:

```typescript
// Create a checkout session
export const createCheckoutAction = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput }) => {
    // Implementation details
    // Returns { success: true, data: { url, id } } or { success: false, error }
  });

// Create a customer portal session
export const createPortalAction = actionClient
  .schema(portalSchema)
  .action(async ({ parsedInput }) => {
    // Implementation details
    // Returns { success: true, data: { url } } or { success: false, error }
  });
```

## Core Components

### CheckoutButton

Creates a Stripe checkout session and redirects the user:

```tsx
<CheckoutButton
  planId="pro"
  priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!}
  email="user@example.com"
  metadata={{ userId: "user_123" }}
  variant="default"
  size="default"
>
  Subscribe
</CheckoutButton>
```

### CustomerPortalButton

Redirects the user to the Stripe customer portal:

```tsx
<CustomerPortalButton 
  customerId="cus_123"
  returnUrl="/account/billing"
  variant="outline"
  size="default"
>
  Manage Subscription
</CustomerPortalButton>
```

### PricingTable

Displays all pricing plans with interval selection:

```tsx
<PricingTable
  plans={plans}
  email="user@example.com"
  metadata={{ userId: "user_123" }}
  currentPlanId="pro"
/>
```

### PricingCard

Displays a single pricing plan with checkout button:

```tsx
<PricingCard
  plan={plan}
  interval="month"
  paymentType="SUBSCRIPTION"
  email="user@example.com"
  metadata={{ userId: "user_123" }}
  isCurrentPlan={false}
/>
```

## Webhooks

Stripe webhook events are handled via `/app/api/webhooks/stripe/route.ts`, which calls the `handleWebhookEvent` function from the payment module.

The webhook handler processes events like:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

The webhook functionality is implemented in the `handleWebhookEvent` method of the payment module.

## Integration Steps

1. Set up Stripe account and get API keys
2. Create products and prices in the Stripe dashboard that match your pricing configuration
3. Add environment variables to your project
4. Set up webhook endpoints in the Stripe dashboard:
   - `https://your-domain.com/api/webhooks/stripe`
5. Add the pricing page and account billing components to your application
6. Use the `CheckoutButton` and `CustomerPortalButton` components where needed

## Error Handling

The payment module includes error handling for:

- Missing environment variables
- Failed checkout session creation
- Invalid webhooks
- User permission checks
- Network/API failures

## Testing

For testing, use Stripe's test mode and test credit cards:

- 4242 4242 4242 4242 - Successful payment
- 4000 0000 0000 3220 - 3D Secure authentication required
- 4000 0000 0000 9995 - Insufficient funds failure

## Global Functions

The main payment interface in `/payment/index.ts` provides these global functions:

```typescript
// Create a checkout session for a plan
createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult>;

// Create a customer portal session
createCustomerPortal(params: CreatePortalParams): Promise<PortalResult>;

// Get a customer by ID
getCustomer(params: GetCustomerParams): Promise<Customer | null>;

// Get a subscription by ID
getSubscription(params: GetSubscriptionParams): Promise<Subscription | null>;

// Handle a webhook event
handleWebhookEvent(payload: string, signature: string): Promise<void>;

// Get plan by ID
getPlanById(planId: string): PricePlan | undefined;

// Get all available plans
getAllPlans(): PricePlan[];

// Find price in a plan by ID
findPriceInPlan(planId: string, priceId: string): Price | undefined;
``` 