import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, SESSION_MAX_AGE, verifySession, type AdminSession } from '@/lib/jwt';

export { AUTH_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from '@/lib/jwt';
export type { AdminSession } from '@/lib/jwt';

/**
 * Reads and verifies the admin session from the request cookie. Route handlers
 * must call this themselves — the proxy only covers /admin page navigations, not
 * /api requests.
 */
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(AUTH_COOKIE)?.value);
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/**
 * Guard for admin route handlers. Returns either a 401 response to return
 * immediately, or the verified session.
 */
export async function requireAuth(): Promise<
  { session: AdminSession; response: null } | { session: null; response: NextResponse }
> {
  const session = await getSession();

  if (!session) {
    return { session: null, response: unauthorized() };
  }

  return { session, response: null };
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE,
    value: '',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
  });
}
