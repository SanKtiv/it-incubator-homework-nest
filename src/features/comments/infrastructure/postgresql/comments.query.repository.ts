import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsQueryRepositoryTypeOrm } from './comments.query.repository-typeorm';
import { QueryDto } from '../../../../infrastructure/models/query.dto';
import {
  commentModelOutput,
  CommentOutputDto,
} from '../../api/models/output/comment.output.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(protected repository: CommentsQueryRepositoryTypeOrm) {}

  async getCommentByd(
    id: string,
    userId: string | null,
  ): Promise<CommentOutputDto> {
    const comment = await this.repository.findById(id, userId);

    if (!comment) throw new NotFoundException();

    return commentModelOutput(comment);
  }

  async getCommentsPaging(
    query: QueryDto,
    postId: string,
    userId: string | null,
  ) {
    return this.repository.paging(query, postId, userId);
  }

  async testPaging() {
    return this.repository.testPaging();
  }
}
