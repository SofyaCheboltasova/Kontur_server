import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCurrentController } from './users-current.controller';
import { AuthService } from '../auth/auth.service';

@Module({
  providers: [UsersService, AuthService],
  exports: [UsersService],
  controllers: [UsersCurrentController],
})
export class UsersModule {}
