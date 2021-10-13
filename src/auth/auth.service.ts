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
  JWT_EXPIRATION_TIME,
  JWT_EXPIRATION_TIME_FOR_REFRESH,
  NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from '../infrastructure/app-constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { Users } from './user.entity';
import { UserRepository } from './users.repository';
import { IUserProfile } from '../infrastructure/interfaces/user-profile.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

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
