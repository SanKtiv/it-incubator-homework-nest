import { IsString, Length, Matches } from 'class-validator';
import { LoginIsExist } from '../../../../../infrastructure/decorators/login-is-exist.decorator';
import { EmailIsExist } from '../../../../../infrastructure/decorators/email-is-exist.decorator';
import {ApiProperty} from "@nestjs/swagger";

export class UsersInputDto {
  //@LoginIsExist()
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 10
  })
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10, { message: 'Login length incorrect' })
  @IsString()
  login: string;

  @ApiProperty({
    type: String,
    minLength: 6,
    maxLength: 20
  })
  @Length(6, 20, { message: 'Password length incorrect' })
  @IsString()
  password: string;

  //@EmailIsExist()
  @ApiProperty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'This email can not exist',
  })

  @ApiProperty()
  @IsString()
  email: string;
}
