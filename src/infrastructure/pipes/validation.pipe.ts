import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { BlogsQueryRepositoryMongo } from '../../features/blogs/infrastructure/mongodb/blogs.query.repository-mongo';
import { Types } from 'mongoose';
import { isUUID } from 'class-validator';

@Injectable()
export class bodyPipe implements PipeTransform {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepositoryMongo,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    return value;
  }
}

@Injectable()
export class paramIdIsUUIdPipe implements PipeTransform {
  constructor() {}

  // async transform(value: any, metadata: ArgumentMetadata) {
  //   if (Types.UUID.isValid(value)) return value;
  //   throw new NotFoundException();
  // }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!isUUID(value)) throw new NotFoundException();

    return value;
  }
}

@Injectable()
export class idPairGamePipe implements PipeTransform {
  constructor() {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!isUUID(value)) throw new BadRequestException();

    return value;
  }
}

@Injectable()
export class paramIdIsObjectIdPipe implements PipeTransform {
  constructor() {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (Types.ObjectId.isValid(value)) return value;
    throw new NotFoundException();
  }
}
