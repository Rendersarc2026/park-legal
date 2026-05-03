import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const validUser = process.env.ADMIN_USERNAME || 'admin';
    const validPass = process.env.ADMIN_PASSWORD || 'admin';

    if (username === validUser && password === validPass) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretjwtsecret1234567890');
      
      const token = await new SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('12h')
        .sign(secret);

      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 12, // 12 hours
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
