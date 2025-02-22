import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * https://orm.drizzle.team/docs/connect-overview
 * 
 * Drizzle ORM runs SQL queries on your database via database drivers.
 * Under the hood Drizzle will create a node-postgres driver instance.
 */
const db = drizzle(process.env.DATABASE_URL!);

export default db;
