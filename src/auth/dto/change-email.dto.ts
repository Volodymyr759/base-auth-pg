import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail()
  @MinLength(4, {
    message: 'Email is too short. Minimal length is 4 characters',
  })
  @MaxLength(50, {
    message: 'Email is too long. Maximal length is 50 characters',
  })
  oldEmail: string;

  @IsEmail()
  @MinLength(4, {
    message: 'Email is too short. Minimal length is 4 characters',
  })
  @MaxLength(50, {
    message: 'Email is too long. Maximal length is 50 characters',
  })
  newEmail: string;

  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimal length is 6 characters',
  })
  @MaxLength(10, {
    message: 'Password is too long. Maximal length is 10 characters',
  })
  password: string;
}
