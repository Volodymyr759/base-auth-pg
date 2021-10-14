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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { RefreshToken } from '../infrastructure/interfaces/refresh-token.interface';
import { AuthService } from '../auth/auth.service';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
} from '../infrastructure/app-constants';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserDto } from './dto/user.dto';
import { IJwt } from '../infrastructure/interfaces/jwt.interface';

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
        throw new Error();
      }
      return user;
    } catch {
      throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
  }

  @Post('change-email')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async changeEmail(@Body() changeEmailDto: ChangeEmailDto) {
    try {
      await this.authService.changeEmail(changeEmailDto);
      return changeEmailDto.newEmail;
    } catch {
      throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
  }

  @Post('change-password')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    try {
      await this.authService.changePassword(changePasswordDto);
      return changePasswordDto.newPassword;
    } catch {
      throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('forgot-password')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const createdPassword = await this.authService.forgotPassword(
        forgotPasswordDto,
      );
      if (!createdPassword) {
        throw new Error();
      }
      return createdPassword;
    } catch {
      throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() userDto: CreateUserDto,
  ) {
    try {
      const jwtObject = await this.authService.login(userDto);
      if (!jwtObject) {
        throw new Error();
      }
      response.cookie('auth', JSON.stringify(jwtObject));
      return jwtObject;
    } catch {
      throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('refresh')
  @HttpCode(201)
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Body() refreshToken: RefreshToken,
  ): Promise<IJwt> {
    try {
      const jwtObject = await this.authService.refresh(refreshToken.token);
      response.cookie('auth', JSON.stringify(jwtObject));
      return jwtObject;
    } catch {
      throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async register(@Body() userDto: CreateUserDto) {
    try {
      const createdUser = await this.authService.create(userDto);
      if (!createdUser) {
        throw new Error();
      }
      return createdUser;
    } catch {
      throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
  }
}
