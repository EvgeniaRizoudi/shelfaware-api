import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma.service.js';
import { UpdateProfileDto } from './dto/user-profile.dto.js';
import { AuthService } from '../auth/auth.service.js';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        password: dto.password ? await argon2.hash(dto.password) : undefined,
      },
    });

    return this.authService.getCurrentUser(userId);
  }
}
