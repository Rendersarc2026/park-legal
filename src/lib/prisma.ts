import { PrismaClient } from '@prisma/client';
import path from 'path';
import dotenv from 'dotenv';

// Use dotenv to ensure environment variables are loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let localPrisma = globalForPrisma.prisma;

// In development, if the cached prisma instance is missing new models, recreate it
if (!localPrisma || (process.env.NODE_ENV !== 'production' && !('contactDetails' in localPrisma))) {
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
