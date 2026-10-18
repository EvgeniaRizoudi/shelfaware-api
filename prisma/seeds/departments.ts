import type { PrismaClient } from '../../src/generated/prisma/client.js';
import { ROLE } from './roles.js';

export const DEPARTMENT = {
    FOOD: 1,
    BEVERAGE: 2,
    STORAGE: 3,
    ADMINISTRATION: 4,
    COLD: 5,
    HOT: 6,
    BREAKFAST: 7,
    BUTCHER: 8,
    PASTRY: 9,
    TAVERN_KITCHEN: 10,
    DISHES: 11,
    MAIN_BAR: 12,
    POOL_BAR: 13,
    MAIN_RESTAURANT: 14,
    TAVERN_BAR: 15,
} as const;

const D = DEPARTMENT;
const R = ROLE;

// Parents must come before their children (the child points at the parent's id).
const departments = [
    // top level
    { id: D.FOOD, name: "Food", parentId: null, roles: [R.ADMIN, R.KITCHEN_MANAGER, R.STOREKEEPER] },
    { id: D.BEVERAGE, name: "Beverage", parentId: null, roles: [R.ADMIN, R.SERVICE_MANAGER, R.STOREKEEPER] },
    { id: D.STORAGE, name: "Storage", parentId: null, roles: [R.ADMIN, R.STOREKEEPER] },
    { id: D.ADMINISTRATION, name: "Administration", parentId: null, roles: [R.ADMIN] },

    // under Food
    { id: D.COLD, name: "Cold", parentId: D.FOOD, roles: [R.KITCHEN, R.KITCHEN_MANAGER] },
    { id: D.HOT, name: "Hot", parentId: D.FOOD, roles: [R.KITCHEN, R.KITCHEN_MANAGER] },
    { id: D.BREAKFAST, name: "Breakfast", parentId: D.FOOD, roles: [R.KITCHEN, R.KITCHEN_MANAGER] },
    { id: D.BUTCHER, name: "Butcher", parentId: D.FOOD, roles: [R.KITCHEN, R.KITCHEN_MANAGER] },
    { id: D.PASTRY, name: "Pastry", parentId: D.FOOD, roles: [R.KITCHEN, R.KITCHEN_MANAGER] },
    { id: D.TAVERN_KITCHEN, name: "Tavern Kitchen", parentId: D.FOOD, roles: [R.KITCHEN, R.KITCHEN_MANAGER] },
    { id: D.DISHES, name: "Dishes", parentId: D.FOOD, roles: [R.KITCHEN] },

    // under Beverage
    { id: D.MAIN_BAR, name: "Main Bar", parentId: D.BEVERAGE, roles: [R.SERVICE, R.SERVICE_MANAGER] },
    { id: D.POOL_BAR, name: "Pool Bar", parentId: D.BEVERAGE, roles: [R.SERVICE, R.SERVICE_MANAGER] },
    { id: D.MAIN_RESTAURANT, name: "Main Restaurant", parentId: D.BEVERAGE, roles: [R.SERVICE, R.SERVICE_MANAGER] },
    { id: D.TAVERN_BAR, name: "Tavern Bar", parentId: D.BEVERAGE, roles: [R.SERVICE, R.SERVICE_MANAGER] },
];

export async function seedDepartments(prisma: PrismaClient) {
    for (const { roles, ...department } of departments) {
        const roleIds = roles.map((id) => ({ id }));
        await prisma.department.upsert({
            where: { id: department.id },
            update: { name: department.name, parentId: department.parentId, roles: { set: roleIds } },
            create: { ...department, roles: { connect: roleIds } },
        });
    }
}
