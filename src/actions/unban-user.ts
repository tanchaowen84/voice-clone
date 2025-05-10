'use server';

import db from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Unban user schema for validation
const unbanUserSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
});

/**
 * Unban a user
 */
export const unbanUserAction = actionClient
  .schema(unbanUserSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { userId } = parsedInput;

      await db
        .update(user)
        .set({
          banned: false,
          banReason: null,
          banExpires: null,
        })
        .where(eq(user.id, userId));

      return {
        success: true,
      };
    } catch (error) {
      console.error('Unban user error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unban user',
      };
    }
  });
