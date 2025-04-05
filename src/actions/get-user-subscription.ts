'use server';

import { auth } from "@/lib/auth";
import { getPaymentProvider, getSubscription } from "@/payment";
import { createSafeActionClient } from 'next-safe-action';
import { headers } from "next/headers";

// Create a safe action client
const actionClient = createSafeActionClient();

/**
 * Get user subscription data - only returns the subscription data
 */
export const getUserSubscriptionAction = actionClient
  .action(async () => {
    // Get the current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !session.user.customerId) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    try {
      // Get the effective customer ID (from session or input)
      const customerId = session.user.customerId;
      // const subscriptionId = session.user.subscriptionId;
      console.log('customerId:', customerId);

      let subscriptionData = null;
      // Get the payment provider to access its methods
      const provider = getPaymentProvider();

      // Find the customer's most recent active subscription
      const subscriptions = await provider.listCustomerSubscriptions({
        customerId: customerId
      });
      console.log('get user subscriptions:', subscriptions);

      // Find the most recent active subscription (if any)
      if (subscriptions && subscriptions.length > 0) {
        // First try to find an active subscription
        const activeSubscription = subscriptions.find(sub =>
          sub.status === 'active' || sub.status === 'trialing'
        );

        // If found, use it
        if (activeSubscription) {
          subscriptionData = activeSubscription;
        }
        // Otherwise, use the most recent subscription (first in the list, as they should be sorted by date)
        else if (subscriptions.length > 0) {
          subscriptionData = subscriptions[0];
        }
        console.log('find subscription:', subscriptionData, 'for customerId:', customerId);
      } else {
        console.log('no subscriptions found for customerId:', customerId);
      }

      return {
        success: true,
        data: subscriptionData,
      };
    } catch (error) {
      console.error("get user subscription data error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  }); 