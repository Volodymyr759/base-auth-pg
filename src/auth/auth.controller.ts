import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getUsers() {
    return this.authService.findAll();
  }
}
