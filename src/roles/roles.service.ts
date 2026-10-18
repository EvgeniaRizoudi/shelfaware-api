import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class RolesService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.role.findMany({
            include: {
                departments: true,
            },
        });
    }
}
