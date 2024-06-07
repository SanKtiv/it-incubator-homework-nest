import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentDocument } from '../domain/comment.schema';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  const;
  async createComment(dto: object): Promise<CommentDocument> {
    const commentDocument = await this.commentsRepository.create(dto);
    return this.commentsRepository.save(commentDocument);
  }
}
