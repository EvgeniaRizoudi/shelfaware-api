import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class DepartmentsService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.department.findMany({
            include: {
                positions: true,
                roles: true,
            },
        });
    }
}
