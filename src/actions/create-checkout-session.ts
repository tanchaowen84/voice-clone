'use server';

import { getSession } from "@/lib/server";
import { getBaseUrlWithLocale } from "@/lib/urls/get-base-url";
import { createCheckout, getPlanById } from "@/payment";
import { CreateCheckoutParams } from "@/payment/types";
import { getLocale } from "next-intl/server";
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Checkout schema for validation
// metadata is optional, and may contain referral information if you need
const checkoutSchema = z.object({
  planId: z.string().min(1, { message: 'Plan ID is required' }),
  priceId: z.string().min(1, { message: 'Price ID is required' }),
  metadata: z.record(z.string()).optional(),
});

/**
 * Create a checkout session for a price plan
 */
export const createCheckoutAction = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput }) => {
    // request the user to login before checkout
    const authSession = await getSession();
    if (!authSession) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    try {
      const { planId, priceId, metadata } = parsedInput;

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

      // add user id, name and email to metadata
      const updatedMetadata = metadata || {};
      updatedMetadata.userId = authSession.user.id;
      updatedMetadata.name = authSession.user.name;
      updatedMetadata.email = authSession.user.email;

      // Create the checkout session with localized URLs
      const baseUrlWithLocale = getBaseUrlWithLocale(locale);
      const successUrl = `${baseUrlWithLocale}/settings/billing?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrlWithLocale}/pricing`;
      const params: CreateCheckoutParams = {
        planId,
        priceId,
        customerEmail: authSession.user.email,
        metadata: updatedMetadata,
        successUrl,
        cancelUrl,
        locale,
      };

      const result = await createCheckout(params);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("create checkout session error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });