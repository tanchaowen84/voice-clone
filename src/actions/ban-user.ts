'use server';

import db from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Ban user schema for validation
const banUserSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
  reason: z.string().optional(),
  expiresAt: z.date().nullable(),
});

/**
 * Ban a user
 */
export const banUserAction = actionClient
  .schema(banUserSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { userId, reason, expiresAt } = parsedInput;

      await db
        .update(user)
        .set({
          banned: true,
          banReason: reason,
          banExpires: expiresAt,
        })
        .where(eq(user.id, userId));

      return {
        success: true,
      };
    } catch (error) {
      console.error('Ban user error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to ban user',
      };
    }
  });
