'use server';

import { getBaseUrlWithLocale } from "@/lib/urls/get-base-url";
import { createCheckout, createCustomerPortal, getPlanById } from "@/payment";
import { CreateCheckoutParams, CreatePortalParams } from "@/payment/types";
import { getLocale } from "next-intl/server";
import { createSafeActionClient } from 'next-safe-action';
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

// Portal schema for validation
const portalSchema = z.object({
  customerId: z.string().min(1, { message: 'Customer ID is required' }),
  returnUrl: z.string().url({ message: 'Return URL must be a valid URL' }).optional(),
});

/**
 * Create a checkout session for a price plan
 */
export const createCheckoutAction = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput }) => {
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

/**
 * Create a customer portal session
 */
export const createPortalAction = actionClient
  .schema(portalSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { customerId, returnUrl } = parsedInput;

      // Get the current locale from the request
      const locale = await getLocale();

      // Create the portal session with localized URL if no custom return URL is provided
      const baseUrlWithLocale = getBaseUrlWithLocale(locale);
      const returnUrlWithLocale = returnUrl || `${baseUrlWithLocale}/account/billing`;
      const params: CreatePortalParams = {
        customerId,
        returnUrl: returnUrlWithLocale,
      };

      const result = await createCustomerPortal(params);

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error("Error creating customer portal session:", error);
      return {
        success: false,
        error: error.message || 'Failed to create customer portal session',
      };
    }
  });