import { IsString, Matches } from 'class-validator';

export class EmailRecoveryDto {
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'This email can not exist',
  })
  @IsString()
  email: string;
}
