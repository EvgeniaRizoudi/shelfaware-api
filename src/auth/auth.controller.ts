import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { ForgotDto } from './dto/forgot.dto.js';
import { ResetDto } from './dto/reset.dto.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import type { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.auth.register(registerDto);
  }

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
    @Req() req: Request,
  ) {
    const user = await this.auth.login(loginDto);
    req.session.userId = user.id;
    return user;
  }

  @Get('current-user')
  async currentUser(@Req() req: Request) {
    if (!req.session.userId) {
      throw new UnauthorizedException();
    }
    return this.auth.getCurrentUser(req.session.userId);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    if (!req.session.userId) {
      throw new UnauthorizedException();
    }
    return new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotDto: ForgotDto) {
    {
      return this.auth.forgotPassword(forgotDto);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: ResetDto) {
    return this.auth.resetPassword(resetDto);
  }
}
