import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateAnalysis } from '@/lib/ai-analysis';
import { getSupervisorSessionFromRequest } from '@/lib/auth/request';

// Mark this route as dynamic to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supervisorSession = await getSupervisorSessionFromRequest(request);
    if (!supervisorSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // get session with transcript
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        fellow: {
          supervisorId: supervisorSession.supervisorId,
        },
      },
      include: { fellow: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // check if analysis already exists
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { sessionId },
    });

    if (existingAnalysis) {
      return NextResponse.json(
        { error: 'Analysis already exists for this session' },
        { status: 400 },
      );
    }

    // generate AI analysis
    const startTime = Date.now();
    const analysisData = await generateAnalysis(
      session.transcript,
      session.concept,
    );
    const processingTime = Date.now() - startTime;

    // save analysis to database
    const analysis = await prisma.analysis.create({
      data: {
        sessionId,
        overallSummary: analysisData.overallSummary,
        contentCoverageScore: analysisData.contentCoverageScore,
        contentCoverageJustification: analysisData.contentCoverageJustification,
        contentCoverageQuotes: analysisData.contentCoverageQuotes,
        facilitationQualityScore: analysisData.facilitationQualityScore,
        facilitationQualityJustification:
          analysisData.facilitationQualityJustification,
        facilitationQualityQuotes: analysisData.facilitationQualityQuotes,
        protocolSafetyScore: analysisData.protocolSafetyScore,
        protocolSafetyJustification: analysisData.protocolSafetyJustification,
        protocolSafetyQuotes: analysisData.protocolSafetyQuotes,
        safetyFlag: analysisData.safetyFlag,
        riskLevel: analysisData.riskLevel,
        riskQuote: analysisData.riskQuote,
        riskReason: analysisData.riskReason,
        modelUsed: analysisData.modelUsed,
        processingTime,
      },
    });

    // update session status based on risk level
    if (analysisData.riskLevel === 'RISK') {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: 'FLAGGED_FOR_REVIEW' },
      });
    } else {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: 'PROCESSED' },
      });
    }

    return NextResponse.json({ success: true, analysis }, { status: 201 });
  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate analysis',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
