import { drizzle } from 'drizzle-orm/neon-http';

/**
 * https://orm.drizzle.team/docs/get-started/neon-new
 * https://orm.drizzle.team/docs/connect-overview
 *
 * Using the browser-compatible Neon HTTP driver for better compatibility with Next.js
 * This avoids the Node.js-specific modules that cause build issues
 *
 * With the neon-http and neon-websockets drivers, you can access a Neon database from serverless environments over HTTP or WebSockets instead of TCP.
 * Querying over HTTP is faster for single, non-interactive transactions.
 */

// If you need to provide your existing drivers:
// import { neon } from '@neondatabase/serverless';
// const sql = neon(process.env.DATABASE_URL!);
// const db = drizzle({ client: sql });

// https://orm.drizzle.team/docs/connect-neon
const db = drizzle(process.env.DATABASE_URL!);

export default db;
