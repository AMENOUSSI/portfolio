import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  // Neon's URLs say sslmode=require, which pg 8 treats as verify-full but pg 9
  // will weaken to libpq semantics. Ask for verify-full explicitly.
  const connectionString = url.replace(/sslmode=require\b/, "sslmode=verify-full");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

/** One client per process; reused across hot reloads in development. */
export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
