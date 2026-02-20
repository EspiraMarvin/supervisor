import type { NextRequest } from 'next/server';
import {
  SESSION_COOKIE_NAME,
  verifySupervisorSession,
  type SupervisorSession,
} from './token';

export async function getSupervisorSessionFromRequest(
  request: NextRequest,
): Promise<SupervisorSession | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySupervisorSession(token);
}

