import { Injectable } from '@nestjs/common';
import { CommentsRepositoryTypeOrm } from './postgresql/comments.repository-typeorm';
import { CommentsTable } from '../domain/comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(protected repository: CommentsRepositoryTypeOrm) {}

  async createComment(comment: CommentsTable): Promise<CommentsTable> {
    return this.repository.create(comment);
  }

  async getCommentById(id: string): Promise<CommentsTable | null> {
    return this.repository.findOneById(id)
  }

  async updateComment() {}

  async deleteOneById() {}

  async clear() {}
}
