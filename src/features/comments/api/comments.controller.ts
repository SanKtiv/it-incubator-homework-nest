import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { commentOutputDto } from './models/output/comment.output.dto';
import { paramIdPipe } from '../../../infrastructure/pipes/validation.pipe';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':commentId')
  async getCommentById(@Param('commentId', paramIdPipe) id: string) {
    const commentDocument = await this.commentsQueryRepository.findById(id);
    return commentOutputDto(commentDocument!);
  }
}
