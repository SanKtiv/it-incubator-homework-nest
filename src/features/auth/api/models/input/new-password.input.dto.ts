import { IsString, Length } from 'class-validator';
//import { ConfirmationCodeIsValid } from '../../../../../infrastructure/decorators/confirmation-code-is-valid.decorator';

export class NewPasswordInputDto {
  @Length(6, 20, { message: 'Incorrect password length' })
  @IsString()
  newPassword: string;

  @IsString()
  recoveryCode: string;
}
