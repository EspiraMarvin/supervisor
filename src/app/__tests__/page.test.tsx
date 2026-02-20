import { render, screen } from '@testing-library/react';

// mock auth to avoid loading jose (ESM) in Jest environment
jest.mock('@/lib/auth/server', () => ({
  __esModule: true,
  requireSupervisorSession: jest.fn(async () => ({
    supervisorId: 'sup-1',
    username: 'Marvin Espira',
    email: 'espiramarvin@gmail.com',
  })),
}));

import DashboardPage from '@/app/page';

// mock Next.js Link component
jest.mock('next/link', () => {
  return function Link({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// mock prisma client
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    session: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// import mocked prisma
import prisma from '@/lib/prisma';

describe('DashboardPage', () => {
  beforeEach(() => {
    // reset mocks
    jest.clearAllMocks();
  });

  describe('Header and Title', () => {
    it('should render "Shamiri Supervisor Copilot" in the DOM', async () => {
      // mock data
      const mockSessions = [
        {
          id: '1',
          groupId: 'GRP-001',
          date: new Date('2026-02-15'),
          transcript: 'Test transcript',
          duration: 45,
          concept: 'Growth Mindset',
          status: 'PROCESSED',
          fellowId: 'fellow-1',
          fellow: {
            id: 'fellow-1',
            name: 'John Doe',
            email: 'john@example.com',
            age: 20,
          },
          analysis: null,
          _count: {
            feedback: 0,
          },
        },
      ];

      const mockAllSessions = [
        { status: 'PROCESSED' },
        { status: 'SAFE' },
        { status: 'FLAGGED_FOR_REVIEW' },
      ];

      // setup mocks
      (prisma.session.findMany as jest.Mock)
        // call for paginated sessions
        .mockResolvedValueOnce(mockSessions)
        // call for all sessions stats
        .mockResolvedValueOnce(mockAllSessions);

      (prisma.session.count as jest.Mock).mockResolvedValue(3);

      // render component
      const component = await DashboardPage({
        searchParams: Promise.resolve({}),
      });
      render(component);

      // assert
      const heading = screen.getByRole('heading', {
        name: /shamiri supervisor copilot/i,
        level: 1,
      });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Shamiri Supervisor Copilot');
    });

    it('should render subtitle text', async () => {
      // mock data
      (prisma.session.findMany as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      (prisma.session.count as jest.Mock).mockResolvedValue(0);

      // render
      const component = await DashboardPage({
        searchParams: Promise.resolve({}),
      });
      render(component);

      // assert
      expect(
        screen.getByText(
          /review and monitor therapy sessions conducted by fellows/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Total Sessions Stats Card', () => {
    it('should display correct total sessions count', async () => {
      // mock data with specific counts
      const mockSessions = [
        {
          id: '1',
          groupId: 'GRP-001',
          date: new Date('2026-02-15'),
          transcript: 'Test transcript 1',
          duration: 45,
          concept: 'Growth Mindset',
          status: 'PROCESSED',
          fellowId: 'fellow-1',
          fellow: {
            id: 'fellow-1',
            name: 'John Doe',
            email: 'john@example.com',
            age: 20,
          },
          analysis: null,
          _count: {
            feedback: 0,
          },
        },
      ];

      const mockAllSessions = [
        { status: 'PROCESSED' },
        { status: 'PROCESSED' },
        { status: 'SAFE' },
        { status: 'SAFE' },
        { status: 'SAFE' },
        { status: 'FLAGGED_FOR_REVIEW' },
        { status: 'FLAGGED_FOR_REVIEW' },
      ];

      // setup mocks - total of 7 sessions
      (prisma.session.findMany as jest.Mock)
        .mockResolvedValueOnce(mockSessions)
        .mockResolvedValueOnce(mockAllSessions);

      (prisma.session.count as jest.Mock).mockResolvedValue(7);

      // render component
      const component = await DashboardPage({
        searchParams: Promise.resolve({}),
      });
      render(component);

      // assert - check for Total Sessions card in stats section
      const statsSection = screen.getByText('Total Sessions', {
        selector: '.text-sm.font-medium.text-gray-600',
      });
      const statsCard = statsSection.closest('.bg-white.rounded-lg');

      // Find the count value within this card
      const countElement = statsCard?.querySelector('.text-3xl.font-bold');
      expect(countElement).toHaveTextContent('7');
    });

    it('should display zero when there are no sessions', async () => {
      // mock empty data
      (prisma.session.findMany as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      (prisma.session.count as jest.Mock).mockResolvedValue(0);

      // render component
      const component = await DashboardPage({
        searchParams: Promise.resolve({}),
      });
      render(component);

      // assert - find stats card specifically
      const statsSection = screen.getByText('Total Sessions', {
        selector: '.text-sm.font-medium.text-gray-600',
      });
      const statsCard = statsSection.closest('.bg-white.rounded-lg');
      const countElement = statsCard?.querySelector('.text-3xl.font-bold');
      expect(countElement).toHaveTextContent('0');
    });

    it('should calculate and display processed sessions correctly', async () => {
      const mockAllSessions = [
        { status: 'PROCESSED' },
        { status: 'PROCESSED' },
        { status: 'PROCESSED' },
        { status: 'SAFE' },
        { status: 'FLAGGED_FOR_REVIEW' },
      ];

      (prisma.session.findMany as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockAllSessions);

      (prisma.session.count as jest.Mock).mockResolvedValue(5);

      // render component
      const component = await DashboardPage({
        searchParams: Promise.resolve({}),
      });
      render(component);

      // assert - check processed count is 3
      const processedLabel = screen.getByText('Processed');
      const processedCard = processedLabel.closest('.bg-white.rounded-lg');
      const countElement = processedCard?.querySelector('.text-3xl.font-bold');
      expect(countElement).toHaveTextContent('3');
    });

    it('should calculate and display flagged sessions correctly', async () => {
      const mockAllSessions = [
        { status: 'PROCESSED' },
        { status: 'FLAGGED_FOR_REVIEW' },
        { status: 'FLAGGED_FOR_REVIEW' },
        { status: 'FLAGGED_FOR_REVIEW' },
        { status: 'SAFE' },
      ];

      (prisma.session.findMany as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockAllSessions);

      (prisma.session.count as jest.Mock).mockResolvedValue(5);

      // render component
      const component = await DashboardPage({
        searchParams: Promise.resolve({}),
      });
      render(component);

      // assert - check flagged count is 3
      const flaggedLabel = screen.getByText('Flagged for Review');
      const flaggedCard = flaggedLabel.closest('.bg-white.rounded-lg');
      const countElement = flaggedCard?.querySelector('.text-3xl.font-bold');
      expect(countElement).toHaveTextContent('3');
    });

    it('should calculate and display safe sessions correctly', async () => {
      const mockAllSessions = [
        { status: 'SAFE' },
        { status: 'SAFE' },
        { status: 'SAFE' },
        { status: 'SAFE' },
        { status: 'PROCESSED' },
        { status: 'FLAGGED_FOR_REVIEW' },
      ];

      (prisma.session.findMany as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockAllSessions);

      (prisma.session.count as jest.Mock).mockResolvedValue(6);

      // render component
      const component = await DashboardPage({
        searchParams: Promise.resolve({}),
      });
      render(component);

      // assert - check safe count is 4
      const safeLabel = screen.getByText('Safe');
      const safeCard = safeLabel.closest('.bg-white.rounded-lg');
      const countElement = safeCard?.querySelector('.text-3xl.font-bold');
      expect(countElement).toHaveTextContent('4');
    });
  });

  describe('Stats Cards Layout', () => {
    it('should render all four stats cards', async () => {
      const mockAllSessions = [
        { status: 'PROCESSED' },
        { status: 'SAFE' },
        { status: 'FLAGGED_FOR_REVIEW' },
      ];

      (prisma.session.findMany as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockAllSessions);

      (prisma.session.count as jest.Mock).mockResolvedValue(3);

      // render component
      const component = await DashboardPage({
        searchParams: Promise.resolve({}),
      });
      render(component);

      // assert all cards are present
      expect(
        screen.getAllByText('Total Sessions').length,
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Processed')).toBeInTheDocument();
      expect(screen.getByText('Flagged for Review')).toBeInTheDocument();
      expect(screen.getByText('Safe')).toBeInTheDocument();
    });
  });
});
