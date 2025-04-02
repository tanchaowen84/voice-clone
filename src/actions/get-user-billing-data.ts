'use server';

import { auth } from "@/lib/auth";
import { getSubscription, getPaymentProvider } from "@/payment";
import { Subscription } from "@/payment/types";
import { createSafeActionClient } from 'next-safe-action';
import { headers } from "next/headers";
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Define a schema for fetching user billing data
const userSchema = z.object({
  customerId: z.string().optional(),
  subscriptionId: z.string().optional(),
});

/**
 * Get user subscription data - only returns the subscription data
 */
export const getUserBillingDataAction = actionClient
  .schema(userSchema)
  .action(async ({ parsedInput }) => {
    const { customerId, subscriptionId } = parsedInput;
    
    // Get the current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }
    
    try {
      // Get the effective customer ID (from session or input)
      const effectiveCustomerId = session.user.customerId || customerId;
      
      // If we have a subscription ID, fetch the subscription details directly
      let subscriptionData = null;
      if (subscriptionId) {
        subscriptionData = await getSubscription({ subscriptionId });
      } 
      // If we have a customer ID but no subscription ID, try to find the active subscription for this customer
      else if (effectiveCustomerId) {
        // Get the payment provider to access its methods
        const provider = getPaymentProvider();
        
        // Find the customer's most recent active subscription
        try {
          const subscriptions = await provider.listCustomerSubscriptions({ 
            customerId: effectiveCustomerId 
          });
          
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
          }
        } catch (err) {
          console.error("Error fetching customer subscriptions:", err);
          // Continue without subscription data
        }
      }
      
      return {
        success: true,
        data: subscriptionData,
      };
    } catch (error: any) {
      console.error("Error fetching user subscription data:", error);
      return {
        success: false,
        error: error.message || 'Failed to fetch user subscription data',
      };
    }
  }); 