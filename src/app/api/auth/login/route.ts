import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { SESSION_COOKIE_NAME, signSupervisorSession } from '@/lib/auth/token';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { email, password } = BodySchema.parse(json);

    const supervisor = await prisma.supervisor.findUnique({
      where: { email },
    });

    if (!supervisor) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const ok = await compare(password, supervisor.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const token = await signSupervisorSession({
      supervisorId: supervisor.id,
      username: supervisor.username,
      email: supervisor.email,
    });

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // common production misconfigurations
    if (error instanceof Error && error.message.includes('AUTH_SECRET')) {
      console.error('Login error (missing AUTH_SECRET):', error);
      return NextResponse.json(
        { error: 'Server auth misconfigured (AUTH_SECRET missing)' },
        { status: 500 },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      console.error('Login error (database/prisma):', error);
      return NextResponse.json(
        {
          error:
            'Login failed due to database configuration. Ensure migrations + seed ran on the production database.',
        },
        { status: 500 },
      );
    }

    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
