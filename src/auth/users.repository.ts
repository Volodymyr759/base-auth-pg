import { EntityRepository, Repository } from 'typeorm';
import { Users } from './user.entity';

@EntityRepository(Users)
export class UserRepository extends Repository<Users> {}
