import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':commentId')
  async getCommentById(@Param('commentId', paramIdIsMongoIdPipe) id: string) {
    return this.commentsQueryRepository.findById(id);
  }
}
