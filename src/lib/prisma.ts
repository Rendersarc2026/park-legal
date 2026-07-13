import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

function createClient(url: string) {
  return new PrismaClient({
    datasources: { db: { url } },
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  }).$extends(withAccelerate());
}

type ExtendedPrismaClient = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as { prisma?: ExtendedPrismaClient };

let _prisma: ExtendedPrismaClient | null = null;

export const prisma = new Proxy({} as any, {
  get(target, prop) {
    if (!_prisma) {
      const url = process.env.MONGODB_URI;
      if (!url) {
        throw new Error('MONGODB_URI is not set. Please configure it in your environment variables.');
      }
      _prisma = globalForPrisma.prisma ?? createClient(url);
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _prisma;
      }
    }
    return Reflect.get(_prisma, prop);
  }
}) as unknown as ExtendedPrismaClient;
