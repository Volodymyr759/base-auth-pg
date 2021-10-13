import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MinLength(4, {
    message: 'Login is too short. Minimal length is 4 characters',
  })
  @MaxLength(50, {
    message: 'Login is too long. Maximal length is 30 characters',
  })
  login: string;

  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimal length is 6 characters',
  })
  @MaxLength(10, {
    message: 'Password is too long. Maximal length is 10 characters',
  })
  password: string;
}
