const postgres = require('postgres');
const sql = postgres("postgresql://postgres.jpndxwivezindljsgtgo:Maddy-bgmistore@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres");

async function main() {
  console.log("Running migration to add 'name' column...");
  try {
    await sql`ALTER TABLE uc_prices ADD COLUMN IF NOT EXISTS name text DEFAULT '';`;
    console.log("Success! Added 'name' column to uc_prices table.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await sql.end();
  }
}

main();
