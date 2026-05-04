import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username: rawUsername, password } = body;
    const username = rawUsername?.toLowerCase();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check for login lock (by username or IP)
    const [loginAttempt, ipAttempt] = await Promise.all([
      prisma.loginAttempt.findUnique({ where: { username } }),
      prisma.loginAttempt.findUnique({ where: { username: `ip_${ip}` } })
    ]);

    const activeLock = (loginAttempt?.lockUntil && loginAttempt.lockUntil > new Date()) ? loginAttempt : 
                      (ipAttempt?.lockUntil && ipAttempt.lockUntil > new Date()) ? ipAttempt : null;

    if (activeLock) {
      const remainingMinutes = Math.ceil((activeLock.lockUntil!.getTime() - Date.now()) / 1000 / 60);
      return NextResponse.json({ 
        error: `Too many failed attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.` 
      }, { status: 429 });
    }

    // If lock expired, reset attempts (optional but better UX)
    let currentAttempts = loginAttempt?.attempts || 0;
    if (loginAttempt?.lockUntil && loginAttempt.lockUntil <= new Date()) {
      currentAttempts = 0;
    }
    
    let currentIpAttempts = ipAttempt?.attempts || 0;
    if (ipAttempt?.lockUntil && ipAttempt.lockUntil <= new Date()) {
      currentIpAttempts = 0;
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin || !admin.isActive) {
      // Record failed attempt
      const attempts = currentAttempts + 1;
      const ipAttempts = currentIpAttempts + 1;
      const lockUntil = attempts >= 5 || ipAttempts >= 10 ? new Date(Date.now() + 5 * 60 * 1000) : null;
      
      await Promise.all([
        prisma.loginAttempt.upsert({
          where: { username },
          update: { attempts, lockUntil },
          create: { username, attempts, lockUntil },
        }),
        prisma.loginAttempt.upsert({
          where: { username: `ip_${ip}` },
          update: { attempts: ipAttempts, lockUntil },
          create: { username: `ip_${ip}`, attempts: ipAttempts, lockUntil },
        })
      ]);

      console.log(`Admin user not found or inactive for username: "${username}" (IP: ${ip})`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (isPasswordCorrect) {
      // Reset attempts on success
      await Promise.all([
        prisma.loginAttempt.deleteMany({ where: { username } }),
        prisma.loginAttempt.deleteMany({ where: { username: `ip_${ip}` } })
      ]);

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

    // Record failed attempt for existing user with wrong password
    const attempts = currentAttempts + 1;
    const ipAttempts = currentIpAttempts + 1;
    const lockUntil = attempts >= 5 || ipAttempts >= 10 ? new Date(Date.now() + 5 * 60 * 1000) : null;
    
    await Promise.all([
      prisma.loginAttempt.upsert({
        where: { username },
        update: { attempts, lockUntil },
        create: { username, attempts, lockUntil },
      }),
      prisma.loginAttempt.upsert({
        where: { username: `ip_${ip}` },
        update: { attempts: ipAttempts, lockUntil },
        create: { username: `ip_${ip}`, attempts: ipAttempts, lockUntil },
      })
    ]);

    console.log('Invalid password for:', username, `(IP: ${ip})`);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
