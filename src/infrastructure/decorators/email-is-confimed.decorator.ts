import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../../features/users/infrastructure/mongodb/users.query.repository';
import { AuthService } from '../../features/auth/application/auth.service';

@ValidatorConstraint({ name: 'EmailIsConfirmed', async: false })
@Injectable()
export class EmailIsConfirmedConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authService: AuthService,
  ) {}
  async validate(value: any, args: ValidationArguments) {
    const result = await this.usersQueryRepository.emailIsExist(value);

    if (result !== 1) return false;

    const emailConfirmed = await this.authService.emailIsConfirmed(value);

    if (emailConfirmed) return false;

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Email is not exist or already confirmed';
  }
}

export function EmailIsConfirmed(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EmailIsConfirmedConstraint,
    });
  };
}
