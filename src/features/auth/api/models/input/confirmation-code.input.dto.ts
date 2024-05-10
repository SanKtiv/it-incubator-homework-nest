import { IsString } from 'class-validator';
import { CodeIsConfirmed } from '../../../../../infrastructure/decorators/code-is-valid.decorator';

export class ConfirmationCodeDto {
  @CodeIsConfirmed()
  @IsString()
  code: string;
}
