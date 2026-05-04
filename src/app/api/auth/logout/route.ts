import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the admin_token cookie
  response.cookies.set({
    name: 'admin_token',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
