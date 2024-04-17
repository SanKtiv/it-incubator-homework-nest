import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../../features/blogs/infrastructure/blogs.query.repository';
import { UsersQueryRepository } from '../../features/users/infrastructure/users.query.repository';
import {PostsQueryRepository} from "../../features/posts/infrastructure/posts.query.repository";

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
    if (!blog) throw new NotFoundException();
    return value;
  }
}

@Injectable()
export class paramIdPipe implements PipeTransform {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository
  ) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    let result: any = undefined;

    if (metadata.data === 'blogId')
      result = await this.blogsQueryRepository.findById(value);

    if (metadata.data === 'userId')
      result = await this.usersQueryRepository.findById(value);

    if (metadata.data === 'postId')
      result = await this.postsQueryRepository.findById(value);

    if (!result) throw new NotFoundException();

    return value;
  }
}
