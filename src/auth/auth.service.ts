import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GET_All_USERS_DTO } from '../infrastructure/app-constants';
import { UserDto } from './dto/user.dto';
// import { Users } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const usersDto = await this.userRepository.query(GET_All_USERS_DTO);
    return usersDto;
  }
}
