import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersQueryRepositoryMongo } from '../../features/users/infrastructure/mongodb/users.query.repository-mongo';

@ValidatorConstraint({ name: 'EmailIsExist', async: false })
@Injectable()
export class EmailIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersQueryRepository: UsersQueryRepositoryMongo) {}
  async validate(value: any, args: ValidationArguments) {
    const result = await this.usersQueryRepository.emailIsExist(value);
    return !(result === 1);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Login or email already exist';
  }
}

export function EmailIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EmailIsExistConstraint,
    });
  };
}
