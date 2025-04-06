'use server';

import { auth } from "@/lib/auth";
import { createSafeActionClient } from 'next-safe-action';
import { headers } from "next/headers";
import db from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

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
      // Query the database directly for the user's lifetime status
      const result = await db
        .select({ lifetimeMember: user.lifetimeMember })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      // Return the result
      return {
        success: true,
        isLifetimeMember: Boolean(result[0]?.lifetimeMember),
      };
    } catch (error) {
      console.error("get user lifetime status error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  }); 