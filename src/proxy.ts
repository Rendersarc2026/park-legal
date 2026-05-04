import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretjwtsecret1234567890');
      await jwtVerify(token, secret);
    } catch (err) {
      console.error('Proxy auth error:', err);
      // Invalid or expired token
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // If already logged in, don't allow access to login page
  if (request.nextUrl.pathname === '/admin/login' && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretjwtsecret1234567890');
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch (err) {
      // Token invalid, allow login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
