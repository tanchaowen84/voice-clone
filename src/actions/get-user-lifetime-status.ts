'use server';

import { auth } from "@/lib/auth";
import { createSafeActionClient } from 'next-safe-action';
import { headers } from "next/headers";
import db from "@/db";
import { subscription } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { getAllPlans } from "@/payment";

// Create a safe action client
const actionClient = createSafeActionClient();

// Input schema
const schema = z.object({
  userId: z.string(),
});

/**
 * Get user's lifetime membership status directly from the database
 */
export const getUserLifetimeStatusAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { userId } = parsedInput;
    
    // Get the current user session for authorization
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
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
      
      if (lifetimePlanIds.length === 0) {
        return {
          success: false,
          error: 'No lifetime plans defined in the system',
        };
      }

      // Query the database for active lifetime subscriptions
      const result = await db
        .select({ id: subscription.id, planId: subscription.planId })
        .from(subscription)
        .where(
          and(
            eq(subscription.userId, userId),
            eq(subscription.status, 'active')
          )
        );

      // Check if any subscription has a lifetime plan
      const hasLifetimeSubscription = result.some(sub => 
        lifetimePlanIds.includes(sub.planId)
      );

      // Return the result
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