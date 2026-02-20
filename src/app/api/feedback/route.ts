import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SessionStatus, RiskLevel } from '@prisma/client';

// mark this route as dynamic to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      validated,
      rejected,
      overrideStatus,
      overrideRisk,
      notes,
      supervisorName,
    } = body;

    // validate required fields
    if (!sessionId || !supervisorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // create feedback
    const feedback = await prisma.feedback.create({
      data: {
        sessionId,
        validated: validated || false,
        rejected: rejected || false,
        overrideStatus: overrideStatus as SessionStatus | null,
        overrideRisk: overrideRisk as RiskLevel | null,
        notes: notes || null,
        supervisorName,
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
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 },
    );
  }
}
