import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @MinLength(4, {
    message: 'Login is too short. Minimal length is 4 characters',
  })
  @MaxLength(30, {
    message: 'Login is too long. Maximal length is 30 characters',
  })
  email: string;
}
