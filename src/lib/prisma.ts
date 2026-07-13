import { PrismaClient } from '@prisma/client';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not set.');
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  return new PrismaClient({
    datasources: { db: { url: process.env.MONGODB_URI } },
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  });
}

// Reuse one client across hot reloads in dev; a fresh one per process in prod.
export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
