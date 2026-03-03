import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prismaLogLevels: Prisma.LogLevel[] =
  process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"];

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: prismaLogLevels,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
