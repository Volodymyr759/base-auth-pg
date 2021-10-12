import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UserRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserRepository])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
