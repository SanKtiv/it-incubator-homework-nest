import { Injectable } from '@nestjs/common';
import { PostsQueryRepositoryTypeOrm } from './postgresql/posts.query.repository-typeorm';
import { PostQuery } from '../api/models/input/posts.input.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(protected postsQueryRepository: PostsQueryRepositoryTypeOrm) {}

  async getPostById(id: string, userId?: string | null) {
    return this.postsQueryRepository.findById(id, userId);
  }

  async getPostsPaging(
    query: PostQuery,
    blogId: string,
    userId?: string,
  ) {
    return this.postsQueryRepository.getPostsPaging(query, blogId, userId);
  }
}
