import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let localPrisma = globalForPrisma.prisma;

// In development, if the cached prisma instance is missing new models, recreate it
if (!localPrisma || (process.env.NODE_ENV !== 'production' && !('specialization' in localPrisma))) {
  localPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.MONGODB_URI,
      },
    },
  });
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = localPrisma;
  }
}

export const prisma = localPrisma;
