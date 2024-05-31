import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../../features/blogs/infrastructure/blogs.query.repository';
import { UsersQueryRepository } from '../../features/users/infrastructure/users.query.repository';
import { PostsQueryRepository } from '../../features/posts/infrastructure/posts.query.repository';
import { CommentsQueryRepository } from '../../features/comments/infrastructure/comments.query.repository';
import { Types } from 'mongoose';
import { UsersService } from '../../features/users/application/users.service';

@Injectable()
export class bodyPipe implements PipeTransform {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    return value;
  }
}

@Injectable()
export class paramIdIsMongoIdPipe implements PipeTransform {
  constructor() {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (Types.ObjectId.isValid(value)) return value;
    throw new NotFoundException();
  }
}

@Injectable()
export class paramIdPipe implements PipeTransform {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly usersService: UsersService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    console.log(metadata);
    let result: any = undefined;

    try {
      new Types.ObjectId(value);
    } catch (e) {
      throw new NotFoundException();
    }
    //value = new Types.ObjectId(value)

    // if (metadata.data === 'blogId')
    //   result = await this.blogsQueryRepository.findById(value);

    if (metadata.data === 'userId')
      result = await this.usersService.existUserWithId(value);

    // if (metadata.data === 'postId')
    //   result = await this.postsQueryRepository.findById(value);
    //
    // if (metadata.data === 'commentId')
    //   result = await this.commentsQueryRepository.findById(value);

    if (!result) throw new NotFoundException();

    return value;
  }
}
