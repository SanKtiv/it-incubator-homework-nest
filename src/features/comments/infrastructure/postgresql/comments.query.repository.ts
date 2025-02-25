import { Injectable } from '@nestjs/common';
import { CommentsQueryRepositoryTypeOrm } from './comments.query.repository-typeorm';
import { QueryDto } from '../../../../infrastructure/models/query.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(protected repository: CommentsQueryRepositoryTypeOrm) {}

  async getCommentByd(id: string, userId: string | null) {
    return this.repository.findById(id, userId)
  }

  async getCommentsPaging(
    query: QueryDto,
    postId: string,
    userId: string | null,
  ) {
    return this.repository.paging(query, postId, userId);
  }
}
