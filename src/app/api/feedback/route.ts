import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SessionStatus, RiskLevel } from '@prisma/client';
import { z } from 'zod';
import { getSupervisorSessionFromRequest } from '@/lib/auth/request';

// mark this route as dynamic to prevent build-time execution
export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  sessionId: z.string().min(1),
  validated: z.boolean().optional(),
  rejected: z.boolean().optional(),
  overrideStatus: z
    .enum(['PROCESSED', 'FLAGGED_FOR_REVIEW', 'SAFE', 'NEEDS_FOLLOWUP'])
    .nullable()
    .optional(),
  overrideRisk: z.enum(['SAFE', 'RISK']).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supervisorSession = await getSupervisorSessionFromRequest(request);
    if (!supervisorSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = BodySchema.parse(await request.json());
    const { sessionId, validated, rejected, overrideStatus, overrideRisk, notes } =
      parsed;

    // ensure supervisor can only leave feedback on assigned fellows' sessions
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        fellow: {
          supervisorId: supervisorSession.supervisorId,
        },
      },
      select: { id: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // create feedback
    const feedback = await prisma.feedback.create({
      data: {
        sessionId,
        validated: validated ?? false,
        rejected: rejected ?? false,
        overrideStatus: overrideStatus as SessionStatus | null,
        overrideRisk: overrideRisk as RiskLevel | null,
        notes: notes || null,
        superVisorId: supervisorSession.supervisorId,
      },
    });

    // if there's a status override, update the session
    if (overrideStatus) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: overrideStatus as SessionStatus },
      });
    }

    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 },
    );
  }
}
