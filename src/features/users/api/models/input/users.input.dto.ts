import {buildMessage, IsString, Length, Matches} from "class-validator";

export class UsersInputDto {
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  @IsString()
  login: string;

  @Length(6, 20)
  @IsString()
  password: string;

  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsString()
  email: string;
}
