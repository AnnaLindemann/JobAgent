import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";


const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
  prisma?: PrismaClient;
};

const pgPool =
  globalForDb.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pgPool;
}

const adapter = new PrismaPg(pgPool);

export const prisma =
  globalForDb.prisma ??
  new PrismaClient({
    adapter,
      });

if (process.env.NODE_ENV !== "production") {
  globalForDb.prisma = prisma;
}