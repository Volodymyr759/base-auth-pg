import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ type: String, required: true, minLength: 4, maxLength: 30 })
    @IsEmail()
    @MinLength(4, { message: 'Email is too short. Minimal length is 4 characters' })
    @MaxLength(30, { message: 'Email is too long. Maximal length is 30 characters' })
    email: string;

    @ApiProperty({ type: String, required: true, minLength: 6, maxLength: 10 })
    @IsString()
    @MinLength(6, { message: 'Old password is too short. Minimal length is 6 characters' })
    @MaxLength(10, { message: 'Old password is too long. Maximal length is 10 characters' })
    oldPassword: string;

    @ApiProperty({ type: String, required: true, minLength: 6, maxLength: 10 })
    @IsString()
    @MinLength(6, { message: 'New password is too short. Minimal length is 6 characters' })
    @MaxLength(10, { message: 'New password is too long. Maximal length is 10 characters' })
    newPassword: string;
}
