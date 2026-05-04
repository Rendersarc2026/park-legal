import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin || !admin.isActive) {
      console.log(`Admin user not found or inactive for username: "${username}"`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (isPasswordCorrect) {
      console.log('Login successful for:', username);
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

    console.log('Invalid password for:', username);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
