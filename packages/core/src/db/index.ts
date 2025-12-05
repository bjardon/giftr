import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

let connectionString: string | undefined;

// Dinamically set the connection string based on the build environment
//  - Use SST database connectionString if in SST environment (Local or AWS)
//  - Use DATABASE_URL environment variable if not in SST environment (Vercel)
if (process.env.SST_STAGE) {
  const { Resource } = await import("sst");
  // @ts-ignore -- ignore the type error on non-SST build
  connectionString = Resource.Database.connectionString;
} else {
  connectionString = process.env.DATABASE_URL;
}

if (!connectionString) {
  throw new Error("Connection string is not set");
}

export const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

export * from "./schema";
