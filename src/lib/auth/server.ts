import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE_NAME,
  verifySupervisorSession,
  type SupervisorSession,
} from './token';

export async function getSupervisorSession(): Promise<SupervisorSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySupervisorSession(token);
}

export async function requireSupervisorSession(): Promise<SupervisorSession> {
  const session = await getSupervisorSession();
  if (!session) redirect('/login');
  return session;
}

