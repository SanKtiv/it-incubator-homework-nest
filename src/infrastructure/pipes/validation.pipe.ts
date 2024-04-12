import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus, BadRequestException, NotFoundException,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../../features/blogs/infrastructure/blogs.query.repository';

@Injectable()
export class ValidationPipe implements PipeTransform {
  // constructor(
  //     private readonly blogsQueryRepository: BlogsQueryRepository
  // ) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log('ValidationPipe start');
    // const blog = await this.blogsQueryRepository.findById(value);
    //
    // if (!blog) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return value;
  }
}

@Injectable()
export class paramBlogIdPipe implements PipeTransform {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const blog = await this.blogsQueryRepository.findById(value);
    if (!blog) throw new NotFoundException()
    return value;
  }
}
