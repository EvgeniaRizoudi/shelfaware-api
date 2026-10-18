import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class PositionsService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.position.findMany({
            include: {
                departments: true,
                roles: true,
            },
        });
    }
}
