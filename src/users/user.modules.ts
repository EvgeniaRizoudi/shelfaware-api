import { Module } from '@nestjs/common';
import { UserUpdateController } from './user.controller.js';
import { UserService } from './user.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [UserUpdateController],
  providers: [UserService],
})
export class UserModule {}
