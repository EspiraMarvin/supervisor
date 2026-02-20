import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE_NAME = 'sc_session';

export type SupervisorSession = {
  supervisorId: string;
  username: string;
  email: string;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
}

export async function signSupervisorSession(
  payload: SupervisorSession,
): Promise<string> {
  const key = getSecretKey();
  return await new SignJWT({
    username: payload.username,
    email: payload.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('supervisor-copilot')
    .setAudience('supervisor')
    .setSubject(payload.supervisorId)
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifySupervisorSession(
  token: string,
): Promise<SupervisorSession | null> {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, {
      issuer: 'supervisor-copilot',
      audience: 'supervisor',
    });

    const supervisorId = payload.sub;
    const username = payload.username;
    const email = payload.email;

    if (
      typeof supervisorId !== 'string' ||
      typeof username !== 'string' ||
      typeof email !== 'string'
    ) {
      return null;
    }

    return { supervisorId, username, email };
  } catch {
    return null;
  }
}

