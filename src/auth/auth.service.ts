import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash, compare } from 'bcryptjs';
import { Roles } from '../infrastructure/enums/roles.enum';
import {
  CREATE_USER,
  GET_All_USERS_DTO,
  GET_ROLE_ID_BY_ROLE_NAME,
  GET_ROLE_NAME_BY_ROLE_ID,
  JWT_EXPIRATION_TIME,
  JWT_EXPIRATION_TIME_FOR_REFRESH,
  JWT_SECRET,
  NOT_FOUND_ERROR,
  UPDATE_USER_EMAIL,
  UPDATE_USER_PASSWORD_HASH,
  UPDATE_USER_REFRESH_TOKEN,
  WRONG_PASSWORD_ERROR,
} from '../infrastructure/app-constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { Users } from './user.entity';
import { UserRepository } from './users.repository';
import { IUserProfile } from '../infrastructure/interfaces/user-profile.interface';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async changeEmail(changeEmailDto: ChangeEmailDto) {
    const userFromDb = await this.find(changeEmailDto.oldEmail);
    if (!userFromDb) {
      throw new Error();
    }
    const isPasswordCorrect = await compare(
      changeEmailDto.password,
      userFromDb.passwordhash,
    );
    if (!isPasswordCorrect) {
      throw new Error();
    }
    userFromDb.email = changeEmailDto.newEmail;
    await this.userRepository.query(UPDATE_USER_EMAIL, [
      userFromDb.id,
      changeEmailDto.newEmail,
    ]);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const userFromDb = await this.find(changePasswordDto.email);
    if (!userFromDb) {
      throw new Error();
    }
    const isPasswordCorrect = await compare(
      changePasswordDto.oldPassword,
      userFromDb.passwordhash,
    );
    if (!isPasswordCorrect) {
      throw new Error();
    }
    userFromDb.passwordhash = await hash(
      changePasswordDto.newPassword,
      await genSalt(),
    );
    await this.userRepository.query(UPDATE_USER_PASSWORD_HASH, [
      userFromDb.id,
      userFromDb.passwordhash,
    ]);
  }

  async create(userDto: CreateUserDto) {
    const refreshToken = await this.jwtService.signAsync(
      { email: userDto.login },
      { expiresIn: JWT_EXPIRATION_TIME_FOR_REFRESH },
    );
    const roles = await this.userRepository.query(GET_ROLE_ID_BY_ROLE_NAME, [
      Roles.User,
    ]);

    const newUser = new Users();
    newUser.email = userDto.login;
    newUser.passwordhash = await hash(userDto.password, await genSalt());
    newUser.refreshtoken = refreshToken;
    newUser.roleid = parseInt(roles[0].getroleidbyrolename);
    newUser.isactivated = false;
    newUser.activationcode = makeRandomString(50);

    await this.userRepository.query(CREATE_USER, [
      newUser.email,
      newUser.passwordhash,
      newUser.refreshtoken,
      newUser.roleid,
      newUser.isactivated,
      newUser.activationcode,
    ]);

    return newUser;
  }

  async delete(id: string) {
    const userToDelete = await this.findById(id);
    await this.userRepository.delete(id);
    return userToDelete;
  }

  async findAll(): Promise<UserDto[]> {
    const usersDto = await this.userRepository.query(GET_All_USERS_DTO);
    return usersDto;
  }

  async findById(id: string): Promise<UserDto> {
    const usersDto = await this.userRepository.query(
      GET_All_USERS_DTO + ' where id=$1',
      [id],
    );
    return usersDto;
  }

  async find(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const userFromDb = await this.find(forgotPassword.email);
    if (!userFromDb) {
      throw new Error();
    }
    const newPassword = makeRandomString(6);
    userFromDb.passwordhash = await hash(newPassword, await genSalt());
    await this.userRepository.query(UPDATE_USER_PASSWORD_HASH, [
      userFromDb.id,
      userFromDb.passwordhash,
    ]);
    return newPassword;
  }

  async login(userDto: CreateUserDto) {
    const userFromDb = await this.find(userDto.login);
    if (!userFromDb) {
      throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
    const isPasswordCorrect = await compare(
      userDto.password,
      userFromDb.passwordhash,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(WRONG_PASSWORD_ERROR, HttpStatus.BAD_REQUEST);
    }
    const userProfile: IUserProfile = {
      id: userFromDb.id,
      role: 'user', //todo: select userFromDb.roles,
      email: userFromDb.email,
    };

    const token = await this.jwtService.signAsync(userProfile, {
      expiresIn: JWT_EXPIRATION_TIME,
    });

    return {
      access_token: token,
      expires_in: JWT_EXPIRATION_TIME,
      token_type: 'bearer',
      refresh_token: userFromDb.refreshtoken,
      email: userFromDb.email,
      role: userProfile.role,
      userId: userFromDb.id,
    };
  }

  async refresh(refreshToken: string) {
    const decodedEmail = this.jwtService.verify(refreshToken, {
      secret: JWT_SECRET,
    }).email;
    const userFromDb = await this.find(decodedEmail);
    console.log('userFromDb:', userFromDb);
    if (!userFromDb) {
      throw new Error();
    }
    if (decodedEmail !== userFromDb.email) {
      throw new Error();
    }
    const roleNames = await this.userRepository.query(
      GET_ROLE_NAME_BY_ROLE_ID,
      [userFromDb.roleid],
    );
    const userProfile: IUserProfile = {
      id: userFromDb.id,
      email: userFromDb.email,
      role: roleNames[0].getrolenamebyroleid,
    };
    const newRefreshToken = await this.jwtService.signAsync(
      { email: decodedEmail },
      { expiresIn: JWT_EXPIRATION_TIME_FOR_REFRESH },
    );
    await this.userRepository.query(UPDATE_USER_REFRESH_TOKEN, [
      userFromDb.id,
      newRefreshToken,
    ]);
    const token = await this.jwtService.signAsync(userProfile, {
      expiresIn: JWT_EXPIRATION_TIME,
    });
    return {
      access_token: token,
      expires_in: JWT_EXPIRATION_TIME,
      token_type: 'bearer',
      refresh_token: newRefreshToken,
      email: userFromDb.email,
      role: userProfile.role,
      userId: userFromDb.id,
    };
  }
}

function makeRandomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
