const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const schema = require('./schema');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ DATABASE_URL environment variable is missing. Database operations via Drizzle ORM will fail until configured in .env");
}

// In serverless environments (like Firebase Cloud Functions), it is highly recommended
// to limit the pool size ('max: 1') to prevent running out of database connections 
// when multiple function instances scale horizontally.
// Disable prefetch/prepare as it is not supported for "Transaction" pool mode in Supabase
const client = connectionString 
  ? postgres(connectionString, { max: 1, ssl: 'require', prepare: false })
  : null;

const db = client ? drizzle(client, { schema }) : null;

module.exports = {
  db,
  ...schema
};
