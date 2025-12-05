import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: Resource.Database.connectionString,
  },
});
