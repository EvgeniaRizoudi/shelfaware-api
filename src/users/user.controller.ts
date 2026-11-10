import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { UpdateProfileDto } from './dto/user-profile.dto.js';
import { UserService } from './user.service.js';
import type { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

@Controller('user-update')
export class UserUpdateController {
  constructor(private readonly userService: UserService) {}

  @Patch('user')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
  ) {
    if (!req.session.userId) {
      throw new UnauthorizedException();
    }
    return this.userService.updateProfile(req.session.userId, updateProfileDto);
  }
}
