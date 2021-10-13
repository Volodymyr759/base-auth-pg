import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsEmail } from 'class-validator';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  @Length(4, 50, { message: 'Email should be 4-50 characters' })
  email: string;

  @Column()
  @Length(1, 255, {
    message: 'Password hash is required and should be 1-255 characters',
  })
  passwordhash: string;

  @Column()
  @Length(1, 255, {
    message: 'Refresh token is required and should be 1-255 characters',
  })
  refreshtoken: string;

  @Column()
  roleid: number;

  @Column()
  isactivated: boolean;

  @Column()
  @Length(1, 255, {
    message: 'Activation code is required and should be 1-255 characters',
  })
  activationcode: string;
}
