import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  @MinLength(4, {
    message: 'Email is too short. Minimal length is 4 characters',
  })
  @MaxLength(50, {
    message: 'Email is too long. Maximal length is 50 characters',
  })
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Old password is too short. Minimal length is 6 characters',
  })
  @MaxLength(10, {
    message: 'Old password is too long. Maximal length is 10 characters',
  })
  oldPassword: string;

  @IsString()
  @MinLength(6, {
    message: 'New password is too short. Minimal length is 6 characters',
  })
  @MaxLength(10, {
    message: 'New password is too long. Maximal length is 10 characters',
  })
  newPassword: string;
}
