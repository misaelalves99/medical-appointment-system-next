import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export function createPostgresClient(connectionString: string) {
  const pool = new Pool({ connectionString });
  return {
    db: drizzle(pool),
    pool,
  };
}
