import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(name: string, email: string, password: string, confirmPassword: string, department_id: number, position_id: number, roles: string[]) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: { email: ['Email already in use'] },
      });
    }

    const hash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: { name, email, password: hash, department_id, position_id, roles },
    });

    return { id: user.id, email: user.email, name: user.name, department: department_id, position: position_id, roles: roles };
  }
}