import { Injectable } from '@nestjs/common';
import { PostsQueryRepositoryTypeOrm } from './postgresql/posts.query.repository-typeorm';
import { PostQuery } from '../api/models/input/posts.input.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(protected postsQueryRepository: PostsQueryRepositoryTypeOrm) {}

  async getPostById(id: string) {
    await this.postsQueryRepository.findById_RAW(id);
  }

  async getPostsPaging(
    query: PostQuery,
    blogId: string | null,
    userId?: string | null,
  ) {
    return this.postsQueryRepository.getPostsPaging(query, blogId);
  }
}
