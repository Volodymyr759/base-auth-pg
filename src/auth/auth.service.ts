import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash, compare } from 'bcryptjs';
import { Roles } from '../infrastructure/enums/roles.enum';
import {
  ALREADY_REGISTERED_ERROR,
  CREATE_USER,
  GET_All_USERS_DTO,
  GET_ROLE_ID_BY_ROLE_NAME,
  JWT_EXPIRATION_TIME_FOR_REFRESH,
} from '../infrastructure/app-constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { Users } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(userDto: CreateUserDto) {
    const userFromDb = await this.find(userDto.login);
    if (userFromDb) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
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
    newUser.activationcode = Math.floor(Math.random() * 10e-9).toString();

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
}
