import { IsString, Length, Matches } from 'class-validator';
import {LoginIsExist} from "../../../../../infrastructure/decorators/login-is-exist.decorator";
import {EmailIsExist} from "../../../../../infrastructure/decorators/email-is-exist.decorator";

export class UsersInputDto {
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10, {message: 'Login length incorrect'})
  @IsString()
  @LoginIsExist()
  login: string;

  @Length(6, 20, {message: 'Password length incorrect'})
  @IsString()
  password: string;

  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'This email can not exist',
  })
  @IsString()
  @EmailIsExist()
  email: string;
}
