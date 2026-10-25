import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { randomBytes } from 'node:crypto';
import { ForgotDto } from './dto/forgot.dto.js';
import { ResetDto } from './dto/reset.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: { email: ['Email already in use'] },
      });
    }
    const positionIds = [...new Set(dto.positionIds)];
    const positions = await this.prisma.position.findMany({
      where: { id: { in: positionIds } },
    });
    if (positions.length !== positionIds.length) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: { positionIds: ['This position doesnt exist'] },
      });
    }
    for (const pair of dto.departmentRoles) {
      const allowed = await this.prisma.department.findFirst({
        where: {
          id: pair.departmentId,
          roles: { some: { id: pair.roleId } },
        },
      });
      if (!allowed) {
        throw new UnprocessableEntityException({
          message: 'Validation failed',
          errors: {
            departmentRoles: ['This role is not allowed in this department'],
          },
        });
      }
    }
    const hash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hash,
        departmentRoles: { create: dto.departmentRoles },
        positions: { connect: positionIds.map((id) => ({ id })) },
      },
      include: {
        departmentRoles: {
          include: { department: true, role: true },
        },
        positions: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      departmentRoles: user.departmentRoles,
      positions: user.positions,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        departmentRoles: { include: { department: true, role: true } },
        positions: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('validation.invalid_credentials');
    }
    const ok = await argon2.verify(user.password, dto.password);
    if (!ok) {
      throw new UnauthorizedException('validation.invalid_credentials');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      departmentRoles: user.departmentRoles,
      positions: user.positions,
    };
  }

  async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        departmentRoles: { include: { department: true, role: true } },
        positions: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      departmentRoles: user.departmentRoles,
      positions: user.positions,
    };
  }

  async forgotPassword(dto: ForgotDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      return;
    }

    const resetToken = await this.prisma.passwordToken.create({
      data: {
        token: randomBytes(32).toString('hex'),
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    await this.mail.sendResetEmail(user.email, resetToken.token);
    return;
  }

  async resetPassword(dto: ResetDto) {
    const resetToken = await this.prisma.passwordToken.findUnique({
      where: { token: dto.token },
    });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: { token: ['Invalid or expired token'] },
      });
    }

    const hash = await argon2.hash(dto.password);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hash },
      }),
      this.prisma.passwordToken.delete({ where: { id: resetToken.id } }),
    ]);
  }
}
