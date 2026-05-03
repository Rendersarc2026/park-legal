import { PrismaClient } from '@prisma/client';
import path from 'path';
import dotenv from 'dotenv';

// Use dotenv to ensure environment variables are loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || 
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.MONGODB_URI,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
