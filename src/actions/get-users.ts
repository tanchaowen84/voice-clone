'use server';

import db from '@/db';
import { user } from '@/db/schema';
import { asc, desc, ilike, or, sql } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Define the schema for getUsers parameters
const getUsersSchema = z.object({
  pageIndex: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sorting: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean(),
      })
    )
    .optional()
    .default([]),
});

// Create a safe action for getting users
export const getUsersAction = actionClient
  .schema(getUsersSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { pageIndex, pageSize, search, sorting } = parsedInput;

      const where = search
        ? or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
        : undefined;

      const offset = pageIndex * pageSize;

      // Get the sort configuration
      const sortConfig = sorting[0];

      const [items, [{ count }]] = await Promise.all([
        db
          .select()
          .from(user)
          .where(where)
          .orderBy(
            sortConfig?.id === 'name'
              ? sortConfig.desc
                ? desc(user.name)
                : asc(user.name)
              : sortConfig?.id === 'email'
                ? sortConfig.desc
                  ? desc(user.email)
                  : asc(user.email)
                : sortConfig?.id === 'createdAt'
                  ? sortConfig.desc
                    ? desc(user.createdAt)
                    : asc(user.createdAt)
                  : sortConfig?.id === 'role'
                    ? sortConfig.desc
                      ? desc(user.role)
                      : asc(user.role)
                    : sortConfig?.id === 'banned'
                      ? sortConfig.desc
                        ? desc(user.banned)
                        : asc(user.banned)
                      : user.createdAt
          )
          .limit(pageSize)
          .offset(offset),
        db.select({ count: sql`count(*)` }).from(user).where(where),
      ]);

      return {
        success: true,
        data: {
          items,
          total: Number(count),
        },
      };
    } catch (error) {
      console.error('get users error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      };
    }
  });
