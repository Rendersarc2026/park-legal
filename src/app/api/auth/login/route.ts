import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serverError } from '@/lib/api';
import { setSessionCookie, signSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

const MAX_USER_ATTEMPTS = 5;
const MAX_IP_ATTEMPTS = 10;
const LOCK_DURATION_MS = 5 * 60 * 1000;

/**
 * A hash of a throwaway value with the same cost factor as real passwords. When
 * the username does not exist we still compare against this, so response time
 * cannot be used to tell real usernames from fake ones.
 */
const DUMMY_HASH = bcrypt.hashSync(randomBytes(32).toString('hex'), 10);

/** x-forwarded-for is a client-supplied list; only the first hop is meaningful. */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first && first.length <= 45 ? first : 'unknown';
}

function isLocked(attempt: { lockUntil: Date | null } | null): boolean {
  return !!attempt?.lockUntil && attempt.lockUntil > new Date();
}

/** Attempts reset once a lock has expired. */
function currentAttempts(attempt: { attempts: number; lockUntil: Date | null } | null): number {
  if (!attempt) return 0;
  if (attempt.lockUntil && attempt.lockUntil <= new Date()) return 0;
  return attempt.attempts;
}

async function recordFailure(username: string, ipKey: string, userAttempts: number, ipAttempts: number) {
  const attempts = userAttempts + 1;
  const ipCount = ipAttempts + 1;
  const lockUntil =
    attempts >= MAX_USER_ATTEMPTS || ipCount >= MAX_IP_ATTEMPTS
      ? new Date(Date.now() + LOCK_DURATION_MS)
      : null;

  await Promise.all([
    prisma.loginAttempt.upsert({
      where: { username },
      update: { attempts, lockUntil },
      create: { username, attempts, lockUntil },
    }),
    prisma.loginAttempt.upsert({
      where: { username: ipKey },
      update: { attempts: ipCount, lockUntil },
      create: { username: ipKey, attempts: ipCount, lockUntil },
    }),
  ]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body?.username === 'string' ? body.username.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const ipKey = `ip_${getClientIp(request)}`;

    const [userAttempt, ipAttempt] = await Promise.all([
      prisma.loginAttempt.findUnique({ where: { username } }),
      prisma.loginAttempt.findUnique({ where: { username: ipKey } }),
    ]);

    const activeLock = isLocked(userAttempt) ? userAttempt : isLocked(ipAttempt) ? ipAttempt : null;

    if (activeLock?.lockUntil) {
      const remainingMinutes = Math.ceil((activeLock.lockUntil.getTime() - Date.now()) / 1000 / 60);
      return NextResponse.json(
        {
          error: `Too many failed attempts. Please try again in ${remainingMinutes} minute${
            remainingMinutes > 1 ? 's' : ''
          }.`,
        },
        { status: 429 }
      );
    }

    const userAttempts = currentAttempts(userAttempt);
    const ipAttempts = currentAttempts(ipAttempt);

    const admin = await prisma.adminUser.findUnique({ where: { username } });

    // Always run a bcrypt comparison, even for an unknown user, so that timing
    // cannot be used to enumerate valid usernames.
    const isPasswordCorrect = await bcrypt.compare(password, admin?.password ?? DUMMY_HASH);

    if (!admin || !admin.isActive || !isPasswordCorrect) {
      await recordFailure(username, ipKey, userAttempts, ipAttempts);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await Promise.all([
      prisma.loginAttempt.deleteMany({ where: { username } }),
      prisma.loginAttempt.deleteMany({ where: { username: ipKey } }),
    ]);

    const response = NextResponse.json({ success: true });
    setSessionCookie(response, await signSession(admin.username));
    return response;
  } catch (err) {
    return serverError('Login error:', err);
  }
}
