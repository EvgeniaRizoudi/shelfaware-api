import type { PrismaClient } from '../../src/generated/prisma/client.js';

export const ROLE = {
    ADMIN: 1,
    KITCHEN: 2,
    KITCHEN_MANAGER: 3,
    SERVICE: 4,
    SERVICE_MANAGER: 5,
    STOREKEEPER: 6,
} as const;

const roles = [
    { id: ROLE.ADMIN, name: "admin" },
    { id: ROLE.KITCHEN, name: "kitchen" },
    { id: ROLE.KITCHEN_MANAGER, name: "Kitchen Manager" },
    { id: ROLE.SERVICE, name: "service" },
    { id: ROLE.SERVICE_MANAGER, name: "Service Manager" },
    { id: ROLE.STOREKEEPER, name: "storekeeper" },
];

export async function seedRoles(prisma: PrismaClient) {
    for (const role of roles) {
        await prisma.role.upsert({
            where: { id: role.id },
            update: { name: role.name },
            create: role,
        });
    }
}
