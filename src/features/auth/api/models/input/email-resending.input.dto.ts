import { IsString, Matches } from 'class-validator';
import { EmailIsConfirmed } from '../../../../../infrastructure/decorators/email-is-confimed.decorator';

export class EmailResendingDto {
  //@EmailIsConfirmed()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'This email can not exist',
  })
  @IsString()
  email: string;
}
