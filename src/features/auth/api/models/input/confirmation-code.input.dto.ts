import { IsString } from 'class-validator';
import { ConfirmationCodeIsValid } from '../../../../../infrastructure/decorators/confirmation-code-is-valid.decorator';

export class ConfirmationCodeDto {
  //@ConfirmationCodeIsValid()
  @IsString()
  code: string;
}
