import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/token';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL('/login', request.url));
  res.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}
