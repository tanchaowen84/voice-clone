'use server';

import { getSession } from "@/lib/server";
import { getBaseUrlWithLocale } from "@/lib/urls/urls";
import { createCustomerPortal } from "@/payment";
import { CreatePortalParams } from "@/payment/types";
import { getLocale } from "next-intl/server";
import { createSafeActionClient } from 'next-safe-action';
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
    const authSession = await getSession();
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
    } catch (error) {
      console.error("create customer portal error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });