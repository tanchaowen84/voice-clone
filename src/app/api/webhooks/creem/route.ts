import type { CreemWebhookEvent } from '@/payment/types';
import { verifyCreemWebhookSignature } from '@/utils/creem/verify-signature';
import {
  addCreditsToCustomer,
  createOrUpdateCustomer,
  createOrUpdateSubscription,
} from '@/utils/supabase/subscriptions';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const headersList = headers();
    const signature = (await headersList).get('creem-signature') || '';

    // Verify the webhook signature
    if (
      !signature ||
      !verifyCreemWebhookSignature(body, signature, CREEM_WEBHOOK_SECRET)
    ) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(body) as CreemWebhookEvent;

    // Handle different event types
    switch (event.eventType) {
      case 'checkout.completed':
        await handleCheckoutCompleted(event);
        break;
      case 'subscription.active':
        await handleSubscriptionActive(event);
        break;
      case 'subscription.paid':
        await handleSubscriptionPaid(event);
        break;
      case 'subscription.canceled':
        await handleSubscriptionCanceled(event);
        break;
      case 'subscription.expired':
        await handleSubscriptionExpired(event);
        break;
      case 'subscription.trialing':
        await handleSubscriptionTrialing(event);
        break;
      default:
        console.log(
          `Unhandled event type: ${event.eventType} ${JSON.stringify(event)}`
        );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
}

async function handleCheckoutCompleted(event: CreemWebhookEvent) {
  const checkout = event.object;
  console.log('Processing completed checkout:', checkout);

  try {
    // Create or update customer
    const customerId = await createOrUpdateCustomer(
      checkout.customer,
      checkout.metadata?.user_id // Make sure to pass user_id in metadata when creating checkout
    );

    // Check if this is a credit purchase
    if (checkout.metadata?.product_type === 'credits') {
      await addCreditsToCustomer(
        customerId,
        checkout.metadata?.credits,
        checkout.order.id,
        `Purchased ${checkout.metadata?.credits} credits`
      );
    }
    // If subscription exists, create or update it
    else if (checkout.subscription) {
      await createOrUpdateSubscription(checkout.subscription, customerId);
    }
  } catch (error) {
    console.error('Error handling checkout completed:', error);
    throw error;
  }
}

async function handleSubscriptionActive(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log('Processing active subscription:', subscription);

  try {
    // Create or update customer
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );

    // Create or update subscription
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error('Error handling subscription active:', error);
    throw error;
  }
}

async function handleSubscriptionPaid(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log('Processing paid subscription:', subscription);

  try {
    // Update subscription status and period
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error('Error handling subscription paid:', error);
    throw error;
  }
}

async function handleSubscriptionCanceled(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log('Processing canceled subscription:', subscription);

  try {
    // Update subscription status
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error('Error handling subscription canceled:', error);
    throw error;
  }
}

async function handleSubscriptionExpired(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log('Processing expired subscription:', subscription);

  try {
    // Update subscription status
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error('Error handling subscription expired:', error);
    throw error;
  }
}

async function handleSubscriptionTrialing(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log('Processing trialing subscription:', subscription);

  try {
    // Update subscription status
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error('Error handling subscription trialing:', error);
    throw error;
  }
}
