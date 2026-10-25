import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { seedRoles } from './seeds/roles.js';
import { seedDepartments } from './seeds/departments.js';
import { seedPositions } from './seeds/positions.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await seedRoles(prisma);
  await seedDepartments(prisma);
  await seedPositions(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

