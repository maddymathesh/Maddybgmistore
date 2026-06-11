import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users } from './drizzle/schema'

const connectionString = process.env.DATABASE_URL

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString!, { prepare: false })
const db = drizzle(client);

// Note: In a real application, you'd export `db` here and use it elsewhere
// instead of top-level await which might fail depending on the env setup.
export const allUsers = async () => await db.select().from(users);
