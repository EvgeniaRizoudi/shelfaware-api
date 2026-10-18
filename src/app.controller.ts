import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prisma: PrismaService) {}

   @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
 async ping() {
    const users = await this.prisma.user.count();
    return { status: 'ok', users };
  }
}
