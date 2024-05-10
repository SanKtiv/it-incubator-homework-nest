import { IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  loginOrEmail: string;

  @IsString()
  password: string;
}
