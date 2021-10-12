import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import {
  ACCESS_DENIED,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
  UNAUTHORIZED,
} from '../infrastructure/app-constants';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    try {
      const users = await this.authService.findAll();
      return users;
    } catch {
      throw new HttpException(
        INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  getUserById() {
    return 'UserDto by id';
  }
}
