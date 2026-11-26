import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PrismaService } from '../prisma.service.js';
import { Roles } from './roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. which roles did the route ask for?
    const roles = this.reflector.get(Roles, context.getHandler());

    // 2. no @Roles label on the route: everyone logged in may pass
    if (!roles) {
      return true;
    }

    // 3. does this user have at least one of those roles, in any department?
    const request = context.switchToHttp().getRequest<Request>();
    const match = await this.prisma.userDepartmentRole.findFirst({
      where: {
        userId: request.session.userId,
        role: { name: { in: roles } },
      },
    });

    if (!match) {
      throw new ForbiddenException();
    }
    return true;
  }
}
