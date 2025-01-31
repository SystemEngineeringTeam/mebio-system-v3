import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';

// ref: https://github.com/chimame/remix-prisma-d1-on-cloudflare-pages/blob/e98cfb57b80e836186ef587a69941b61fe5cd09d/app/database/client.ts

export async function injectPrismaClient(db: D1Database): Promise<PrismaClient> {
  const adapter = new PrismaD1(db);
  return new PrismaClient({ adapter });
}
