import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not set.');
}

function createClient() {
  return new PrismaClient({
    datasources: { db: { url: process.env.MONGODB_URI } },
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  }).$extends(withAccelerate());
}

type ExtendedPrismaClient = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as { prisma?: ExtendedPrismaClient };

// Reuse one client across hot reloads in dev; a fresh one per process in prod.
export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
