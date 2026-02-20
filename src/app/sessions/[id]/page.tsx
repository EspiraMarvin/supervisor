import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { RiskLevel } from '@prisma/client';
import Link from 'next/link';
import AnalysisCard from '@/components/AnalysisCard';
import FeedbackForm from '@/components/FeedbackForm';
import GenerateAnalysisButton from '@/components/GenerateAnalysisButton';
import { requireSupervisorSession } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

async function getSession(id: string) {
  const supervisor = await requireSupervisorSession();
  const session = await prisma.session.findFirst({
    where: {
      id,
      fellow: {
        supervisorId: supervisor.supervisorId,
      },
    },
    include: {
      fellow: true,
      analysis: true,
      feedback: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          supervisor: true,
        },
      },
    },
  });

  return { session, supervisor };
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getSession(id);
  const session = result.session;
  const supervisor = result.supervisor;

  if (!session) {
    notFound();
  }

  const hasRisk = session.analysis?.riskLevel === RiskLevel.RISK;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Session Details
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Review session transcript and AI-generated insights
              </p>
            </div>
          </div>
          <div className="mt-4">
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900 underline "
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* risk alert banner */}
      {hasRisk && (
        <div className="bg-red-50  border-red-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start">
              <div className="flex-shrink-0"></div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">
                  RISK DETECTED - IMMEDIATE ATTENTION REQUIRED
                </h3>
                <p className="mt-1 text-sm text-red-900">
                  This session contains indicators of potential self-harm or
                  crisis. Please review immediately and take appropriate action.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* left column - session info & transcript */}
          <div className="lg:col-span-2 space-y-6">
            {/* session info card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Session Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Fellow
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {session.fellow.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Date</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(session.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Group ID
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {session.groupId}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Duration
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {session.duration} minutes
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Concept Taught
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {session.concept}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Status
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.status === 'FLAGGED_FOR_REVIEW'
                          ? 'bg-red-100 text-red-800'
                          : session.status === 'SAFE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {session.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* transcript card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Session Transcript
              </h2>
              <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700 leading-relaxed">
                    {session.transcript}
                  </pre>
                </div>
              </div>
            </div>

            {/* supervisor feedback history */}
            {session.feedback.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Supervisor Feedback History
                </h2>
                <div className="space-y-4">
                  {session.feedback.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border-l-4 bg-gray-100 p-4 rounded"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-900">
                          {feedback.supervisor?.username || 'Supervisor'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(feedback.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {feedback.notes && (
                        <p className="text-sm text-gray-700 mt-2">
                          Feedback: {feedback.notes}
                        </p>
                      )}
                      <div className="mt-2 flex gap-4 text-xs">
                        <span
                          className={`font-medium ${
                            feedback.validated
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {feedback.validated ? 'Validated' : 'Not Validated'}
                        </span>
                        {feedback.rejected && (
                          <span className="font-medium text-red-500">
                            Rejected
                          </span>
                        )}
                        {feedback.overrideStatus && (
                          <span className="font-medium text-orange-500">
                            Override: {feedback.overrideStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - AI Analysis & Actions */}
          <div className="space-y-6">
            {session.analysis ? (
              <AnalysisCard analysis={session.analysis} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  AI Analysis
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  No AI analysis available for this session yet.
                </p>
                <GenerateAnalysisButton sessionId={session.id} />
              </div>
            )}

            {/* Supervisor Action Form */}
            <FeedbackForm
              sessionId={session.id}
              currentStatus={session.status}
              supervisorName={supervisor.username}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
