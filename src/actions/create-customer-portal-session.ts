'use server';

import { auth } from "@/lib/auth";
import { getBaseUrlWithLocale } from "@/lib/urls/get-base-url";
import { createCustomerPortal } from "@/payment";
import { CreatePortalParams } from "@/payment/types";
import { getLocale } from "next-intl/server";
import { createSafeActionClient } from 'next-safe-action';
import { headers } from "next/headers";
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Portal schema for validation
const portalSchema = z.object({
  customerId: z.string().min(1, { message: 'Customer ID is required' }),
  returnUrl: z.string().url({ message: 'Return URL must be a valid URL' }).optional(),
});

/**
 * Create a customer portal session
 */
export const createPortalAction = actionClient
  .schema(portalSchema)
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
      const { customerId, returnUrl } = parsedInput;

      // Get the current locale from the request
      const locale = await getLocale();

      // Create the portal session with localized URL if no custom return URL is provided
      const baseUrlWithLocale = getBaseUrlWithLocale(locale);
      const returnUrlWithLocale = returnUrl || `${baseUrlWithLocale}/settings/billing`;
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