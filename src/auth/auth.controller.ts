import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import {
  ACCESS_DENIED,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
  UNAUTHORIZED,
} from '../infrastructure/app-constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @HttpCode(200)
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
  @HttpCode(200)
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.authService.findById(id);
      if (!user) {
        throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (e) {
      throw new HttpException(e.message, e.HttpStatus);
    }
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() userDto: CreateUserDto,
  ) {
    const jwtObject = await this.authService.login(userDto);
    response.cookie('auth', JSON.stringify(jwtObject));
    return jwtObject;
  }

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.create(userDto);
  }
}
