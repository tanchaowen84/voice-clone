import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

/**
 * https://orm.drizzle.team/docs/get-started/neon-new
 * https://orm.drizzle.team/docs/connect-overview
 *
 * Using the browser-compatible Neon HTTP driver for better compatibility with Next.js
 * This avoids the Node.js-specific modules that cause build issues
 */
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

export default db;
