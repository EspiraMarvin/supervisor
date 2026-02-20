import Link from 'next/link';
import prisma from '@/lib/prisma';
import { requireSupervisorSession } from '@/lib/auth/server';

type SessionStatus =
  | 'PROCESSED'
  | 'FLAGGED_FOR_REVIEW'
  | 'SAFE'
  | 'NEEDS_FOLLOWUP';

type SessionWithRelations = {
  id: string;
  groupId: string;
  date: Date;
  transcript: string;
  duration: number;
  concept: string;
  status: SessionStatus;
  fellowId: string;
  fellow: {
    id: string;
    name: string;
    email: string;
    age: number | null;
  };
  analysis: {
    id: string;
    riskLevel: string;
  } | null;
  _count: {
    feedback: number;
  };
};

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 10;

async function getSessions(supervisorId: string, page: number = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [sessions, totalCount, allSessions] = await Promise.all([
    prisma.session.findMany({
      where: {
        fellow: {
          supervisorId,
        },
      },
      skip,
      take: ITEMS_PER_PAGE,
      include: {
        fellow: true,
        analysis: true,
        _count: {
          select: { feedback: true },
        },
      },
      orderBy: {
        date: 'desc',
      },
    }),
    prisma.session.count({
      where: {
        fellow: {
          supervisorId,
        },
      },
    }),
    prisma.session.findMany({
      where: {
        fellow: {
          supervisorId,
        },
      },
      select: {
        status: true,
      },
    }),
  ]);

  // calculate stats from all sessions
  const stats = {
    total: totalCount,
    processed: allSessions.filter(
      (s: { status: string }) => s.status === 'PROCESSED',
    ).length,
    flagged: allSessions.filter(
      (s: { status: string }) => s.status === 'FLAGGED_FOR_REVIEW',
    ).length,
    safe: allSessions.filter((s: { status: string }) => s.status === 'SAFE')
      .length,
  };

  return { sessions, totalCount, stats, currentPage: page };
}

function getStatusColor(status: SessionStatus) {
  switch (status) {
    case 'SAFE':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'FLAGGED_FOR_REVIEW':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PROCESSED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'NEEDS_FOLLOWUP':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusLabel(status: SessionStatus) {
  switch (status) {
    case 'SAFE':
      return 'Safe';
    case 'FLAGGED_FOR_REVIEW':
      return 'Flagged for Review';
    case 'PROCESSED':
      return 'Processed';
    case 'NEEDS_FOLLOWUP':
      return 'Needs Follow-up';
    default:
      return status;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supervisor = await requireSupervisorSession();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const {
    sessions,
    totalCount,
    stats,
    currentPage: page,
  } = await getSessions(supervisor.supervisorId, currentPage);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const skip = (page - 1) * ITEMS_PER_PAGE;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shamiri Supervisor Copilot
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Review and monitor therapy sessions conducted by Fellows
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Signed in as{' '}
                <span className="font-medium">{supervisor.username}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{totalCount}</span> Total Sessions
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-red-600">
                  {stats.flagged}
                </span>{' '}
                Flagged
              </div>
              <form action="/api/auth/logout" method="post" className="ml-2">
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600">
              Total Sessions
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600">Processed</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {stats.processed}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600">
              Flagged for Review
            </div>
            <div className="mt-2 text-3xl font-bold text-red-600">
              {stats.flagged}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600">Safe</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {stats.safe}
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Sessions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fellow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concept
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Analysis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session: SessionWithRelations) => (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-700 font-medium text-sm">
                            {session.fellow.name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {session.fellow.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.fellow.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(session.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(session.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.groupId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {session.concept}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          session.status,
                        )}`}
                      >
                        {getStatusLabel(session.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {session.analysis ? (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">
                            Available
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/sessions/${session.id}`}
                        className="text-gray-700 hover:text-indigo-900 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                {/* mobile screen pagination */}
                <Link
                  href={`/?page=${page - 1}`}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page <= 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </Link>
                <Link
                  href={`/?page=${page + 1}`}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page >= totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </Link>
              </div>

              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{skip + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(skip + ITEMS_PER_PAGE, totalCount)}
                    </span>{' '}
                    of <span className="font-medium">{totalCount}</span>{' '}
                    sessions
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    {/* prev btn */}
                    <Link
                      href={`/?page=${page - 1}`}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        page <= 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>

                    {/* page no.s */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => {
                        // show first page, last page, current page, and pages around current
                        const showPage =
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= page - 1 && pageNum <= page + 1);

                        const showEllipsis =
                          (pageNum === 2 && page > 3) ||
                          (pageNum === totalPages - 1 && page < totalPages - 2);

                        if (showEllipsis) {
                          return (
                            <span
                              key={pageNum}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <Link
                            key={pageNum}
                            href={`/?page=${pageNum}`}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === page
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </Link>
                        );
                      },
                    )}

                    {/* next btn */}
                    <Link
                      href={`/?page=${page + 1}`}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        page >= totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
