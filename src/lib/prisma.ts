import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;

  // check if using prisma accelerate URL (prisma:// or prisma+postgres://)
  if (
    databaseUrl?.startsWith('prisma://') ||
    databaseUrl?.startsWith('prisma+postgres://')
  ) {
    return new PrismaClient({
      accelerateUrl: databaseUrl,
    }).$extends(withAccelerate());
  }

  //  check for local dev with Prisma Dev (postgres://) or standard Postgres (postgresql://)
  if (
    databaseUrl?.startsWith('postgres://') ||
    databaseUrl?.startsWith('postgresql://')
  ) {
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  // fallback to standard prismaClient to use DATABASE_URL from prisma.config.ts
  throw new Error(
    'DATABASE_URL must be set and start with postgres://, prisma://, or prisma+postgres://',
  );
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
