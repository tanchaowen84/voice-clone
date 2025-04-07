'use server';

import db from "@/db";
import { subscription } from "@/db/schema";
import { getSession } from "@/lib/server";
import { getAllPlans } from "@/payment";
import { PaymentTypes } from "@/payment/types";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from 'next-safe-action';
import { z } from "zod";

// Create a safe action client
const actionClient = createSafeActionClient();

// Input schema
const schema = z.object({
  userId: z.string(),
});

/**
 * Get user lifetime membership status directly from the database
 * 
 * NOTICE: If you first add lifetime plan and then delete it, 
 * the user with lifetime plan should be considered as a lifetime member as well,
 * in order to do this, you have to update the logic to check the lifetime status,
 * for example, just check the planId is `lifetime` or not.
 */
export const getUserLifetimeStatusAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { userId } = parsedInput;

    // Get the current user session for authorization
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // Only allow users to check their own status unless they're admins
    if (session.user.id !== userId && session.user.role !== 'admin') {
      return {
        success: false,
        error: 'Not authorized to view this user data',
      };
    }

    try {
      // Get lifetime plans
      const plans = getAllPlans();
      const lifetimePlanIds = plans
        .filter(plan => plan.isLifetime)
        .map(plan => plan.id);

      // Check if there are any lifetime plans defined in the system
      if (lifetimePlanIds.length === 0) {
        return {
          success: false,
          error: 'No lifetime plans defined in the system',
        };
      }

      // Query the database for one-time payments with lifetime plans
      const result = await db
        .select({ id: subscription.id, planId: subscription.planId, type: subscription.type })
        .from(subscription)
        .where(
          and(
            eq(subscription.userId, userId),
            eq(subscription.type, PaymentTypes.ONE_TIME),
            eq(subscription.status, 'completed') // TODO: change to enum
          )
        );

      // Check if any subscription has a lifetime plan
      const hasLifetimeSubscription = result.some(subscription =>
        lifetimePlanIds.includes(subscription.planId)
      );

      return {
        success: true,
        isLifetimeMember: hasLifetimeSubscription,
      };
    } catch (error) {
      console.error("get user lifetime status error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  }); 