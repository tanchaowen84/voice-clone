# Payment Module

This module provides a flexible payment integration with Stripe, supporting both subscription and one-time payments.

## Structure

- `/payment/types.ts` - Type definitions for the payment module
- `/payment/index.ts` - Main payment interface and global provider instance
- `/payment/provider/stripe.ts` - Stripe payment provider implementation
- `/payment/config/payment-config.ts` - Payment plans configuration
- `/actions/create-checkout-session.ts` - Server actions for creating checkout session
- `/actions/create-customer-portal-session.ts` - Server actions for creating portal session
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

# Stripe Price IDs
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_LIFETIME=price_...
```

## Payment Plans

Payment plans are defined in `/payment/config/payment-config.ts`. Each plan can have multiple pricing options (monthly, yearly, one-time) with the following structure:

```typescript
{
  id: "pro",
  name: "Pro Plan",
  description: "For professional users",
  isFree: false,
  recommended: true,
  features: ["Feature 1", "Feature 2"],
  prices: [
    {
      productId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      type: "recurring",
      interval: "month",
      amount: 2900,
      currency: "USD",
      trialPeriodDays: 7
    },
    {
      productId: process.env.STRIPE_PRICE_PRO_YEARLY!,
      type: "recurring",
      interval: "year",
      amount: 24900,
      currency: "USD",
      trialPeriodDays: 7
    }
  ]
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
  priceId={process.env.STRIPE_PRICE_PRO_MONTHLY!}
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
  paymentType="recurring"
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

Custom webhook handlers can be registered using:

```typescript
registerWebhookHandler('checkout.session.completed', async (event) => {
  // Handle the event
});
```

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

// Register a webhook event handler
registerWebhookHandler(eventType: string, handler: WebhookEventHandler): void;

// Handle a webhook event
handleWebhookEvent(payload: string, signature: string): Promise<void>;

// Get plan by ID
getPlanById(planId: string): PricePlan | undefined;

// Get all available plans
getAllPlans(): PricePlan[];

// Find price in a plan by ID
findPriceInPlan(planId: string, priceId: string): Price | undefined;
``` 