import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL || "";

export const client = postgres(databaseUrl, { prepare: false });
export const db = drizzle(client, { schema });

export * from "./schema";
export * from "drizzle-orm";
