import type { PrismaClient } from '../../src/generated/prisma/client.js';
import { DEPARTMENT } from './departments.js';
import { ROLE } from './roles.js';

const D = DEPARTMENT;
const R = ROLE;

const KITCHEN_LINES = [D.COLD, D.HOT, D.BREAKFAST, D.BUTCHER, D.PASTRY, D.TAVERN_KITCHEN];
const SERVICE_POINTS = [D.MAIN_BAR, D.POOL_BAR, D.MAIN_RESTAURANT, D.TAVERN_BAR];

// A position is a job title. It exists once and lists the departments where it can be chosen.
const positions = [
    // kitchen
    { id: 1, name: "Chef", departments: KITCHEN_LINES, roles: [R.KITCHEN_MANAGER] },
    { id: 2, name: "Sous Chef", departments: KITCHEN_LINES, roles: [R.KITCHEN_MANAGER] },
    { id: 3, name: "Cook", departments: KITCHEN_LINES, roles: [R.KITCHEN] },
    { id: 4, name: "Pastry Chef", departments: [D.PASTRY], roles: [R.KITCHEN] },
    { id: 5, name: "Butcher", departments: [D.BUTCHER], roles: [R.KITCHEN] },
    { id: 6, name: "Dishwasher", departments: [D.DISHES], roles: [R.KITCHEN] },

    // service
    { id: 7, name: "Waiter", departments: [D.MAIN_RESTAURANT, D.POOL_BAR, D.TAVERN_BAR], roles: [R.SERVICE] },
    { id: 8, name: "Bartender", departments: SERVICE_POINTS, roles: [R.SERVICE] },
    { id: 9, name: "Service Manager", departments: [D.BEVERAGE], roles: [R.SERVICE_MANAGER] },

    // management and support
    { id: 10, name: "FnB Manager", departments: [D.FOOD, D.BEVERAGE], roles: [R.SERVICE_MANAGER, R.KITCHEN_MANAGER] },
    { id: 11, name: "Storekeeper", departments: [D.STORAGE], roles: [R.STOREKEEPER] },
    { id: 12, name: "Admin", departments: [D.ADMINISTRATION], roles: [R.ADMIN] },
];

export async function seedPositions(prisma: PrismaClient) {
    for (const position of positions) {
        const departmentIds = position.departments.map((id) => ({ id }));
        const roleIds = position.roles.map((id) => ({ id }));
        await prisma.position.upsert({
            where: { id: position.id },
            update: {
                name: position.name,
                departments: { set: departmentIds },
                roles: { set: roleIds },
            },
            create: {
                id: position.id,
                name: position.name,
                departments: { connect: departmentIds },
                roles: { connect: roleIds },
            },
        });
    }
}
