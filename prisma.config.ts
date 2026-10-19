import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/*
 * This URL is used by the Prisma CLI only (migrate, db seed, studio).
 * Migrations must go through Neon's direct connection: the pooled one
 * (PgBouncer, transaction mode) breaks Prisma Migrate. The app itself
 * connects with the pooled DATABASE_URL in lib/db.ts.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED ?? env("DATABASE_URL"),
  },
});
