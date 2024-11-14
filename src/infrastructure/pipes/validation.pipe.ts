import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { BlogsQueryRepositoryMongo } from '../../features/blogs/infrastructure/mongodb/blogs.query.repository-mongo';
import { Types } from 'mongoose';

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
export class paramIdIsMongoIdPipe implements PipeTransform {
  constructor() {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // if (Types.ObjectId.isValid(value)) return value;for mongo
    if (Types.UUID.isValid(value)) return value;
    throw new NotFoundException();
  }
}
