import { IsString, Length, Matches } from 'class-validator';

export class UsersInputDto {
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10, {message: 'Login length incorrect'})
  @IsString()
  login: string;

  @Length(6, 20, {message: 'Password length incorrect'})
  @IsString()
  password: string;

  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'This email can not exist',
  })
  @IsString()
  email: string;
}
