import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentDocument } from '../domain/comment.schema';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createComment(dto: {}): Promise<CommentDocument> {
    const commentDocument = await this.commentsRepository.create(dto);
    return this.commentsRepository.save(commentDocument);
  }
}
