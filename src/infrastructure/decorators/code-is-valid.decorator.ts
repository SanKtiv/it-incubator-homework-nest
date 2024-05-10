import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../features/auth/application/auth.service';

@ValidatorConstraint({ name: 'CodeIsConfirmed', async: false })
@Injectable()
export class CodeIsConfirmedConstraint implements ValidatorConstraintInterface {
  constructor(private readonly authService: AuthService) {}

  async validate(value: any, args: ValidationArguments) {
    return this.authService.confirmationCodeIsValid(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Confirmation code is incorrect, expired or already been applied';
  }
}

export function CodeIsConfirmed(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: CodeIsConfirmedConstraint,
    });
  };
}
