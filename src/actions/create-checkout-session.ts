'use server';

import { auth } from "@/lib/auth";
import { getBaseUrlWithLocale } from "@/lib/urls/get-base-url";
import { createCheckout, getPlanById } from "@/payment";
import { CreateCheckoutParams } from "@/payment/types";
import { getLocale } from "next-intl/server";
import { createSafeActionClient } from 'next-safe-action';
import { headers } from "next/headers";
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Checkout schema for validation
const checkoutSchema = z.object({
  planId: z.string().min(1, { message: 'Plan ID is required' }),
  priceId: z.string().min(1, { message: 'Price ID is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
  metadata: z.record(z.string()).optional(),
});

/**
 * Create a checkout session for a price plan
 */
export const createCheckoutAction = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput }) => {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    try {
      const { planId, priceId, email, metadata } = parsedInput;

      // Get the current locale from the request
      const locale = await getLocale();

      // Check if plan exists
      const plan = getPlanById(planId);
      if (!plan) {
        return {
          success: false,
          error: 'Plan not found',
        };
      }

      // Create the checkout session with localized URLs
      const baseUrlWithLocale = getBaseUrlWithLocale(locale);
      const successUrl = `${baseUrlWithLocale}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      // TODO: maybe add a cancel url as param, do not redirect to the cancel page
      const cancelUrl = `${baseUrlWithLocale}/payment/cancel`;
      const params: CreateCheckoutParams = {
        planId,
        priceId,
        customerEmail: email,
        metadata,
        successUrl,
        cancelUrl,
      };

      const result = await createCheckout(params);

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      return {
        success: false,
        error: error.message || 'Failed to create checkout session',
      };
    }
  });