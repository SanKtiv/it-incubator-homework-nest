import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../../features/blogs/infrastructure/mongodb/blogs.repository';

@ValidatorConstraint({ name: 'BlogIdIsExist', async: false })
@Injectable()
export class BlogIdIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async validate(value: any, args: ValidationArguments) {
    const result = await this.blogsRepository.findById(value);
    return !!result;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'this blogId is not exist';
  }
}

export function BlogIdIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: BlogIdIsExistConstraint,
    });
  };
}
