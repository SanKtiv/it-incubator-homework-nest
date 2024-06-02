import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../../features/users/infrastructure/users.query.repository';

@ValidatorConstraint({ name: 'LoginIsExist', async: false })
@Injectable()
export class LoginIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  async validate(value: any, args: ValidationArguments) {
    const result = await this.usersQueryRepository.loginIsExist(value);
    return !(result === 1);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Login or email already exist';
  }
}

export function LoginIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: LoginIsExistConstraint,
    });
  };
}
