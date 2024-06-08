import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import {
  CommentOutputDto,
  commentOutputDto,
} from '../api/models/output/comment.output.dto';
import { CommentServiceDto } from '../api/models/input/comment-service.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createComment(dto: CommentServiceDto): Promise<CommentOutputDto> {
    const postDocument = await this.postsRepository.findById(dto.postId);

    if (!postDocument) throw new NotFoundException();

    const userDocument = await this.usersRepository.findById(dto.userId);

    dto.userLogin = userDocument!.accountData.login;

    const commentDocument = await this.commentsRepository.create(dto);

    return commentOutputDto(commentDocument);
  }

  async createLikeStatus() {}
}
