import { jwtVerify, SignJWT } from 'jose';

export const AUTH_COOKIE = 'admin_token';
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

export type AdminSession = { username: string };

/**
 * The secret is never allowed to fall back to a literal. A missing or weak
 * JWT_SECRET means anyone can mint an admin session, so we fail loudly instead.
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET is missing or too short. Set a random value of at least 32 characters.'
    );
  }

  return new TextEncoder().encode(secret);
}

export async function signSession(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(getJwtSecret());
}

export async function verifySession(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ['HS256'] });
    const username = payload.username;
    return typeof username === 'string' && username.length > 0 ? { username } : null;
  } catch {
    return null;
  }
}
