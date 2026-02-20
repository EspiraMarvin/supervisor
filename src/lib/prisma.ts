import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;

  // during build time, use a valid placeholder URL that won't actually connect
  const connectionString =
    databaseUrl ||
    'postgresql://placeholder:placeholder@localhost:5432/placeholder';

  // use pg adapter for all cases
  const pool = new Pool({
    connectionString,
    max: 1,
    // don't actually try to connect during build
    allowExitOnIdle: true,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
