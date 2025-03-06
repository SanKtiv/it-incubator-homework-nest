import { Injectable } from '@nestjs/common';
import { PostsRepositoryTypeOrm } from './postgresql/posts.repository-typeorm';
import { PostsTable } from '../domain/posts.table';

@Injectable()
export class PostsRepository {
  constructor(private readonly postsRepository: PostsRepositoryTypeOrm) {}

  async create(dto: PostsTable): Promise<PostsTable> {
    return this.postsRepository.create(dto);
  }

  async findPostsById(id: string): Promise<PostsTable | null | undefined> {
    return this.postsRepository.findById(id);
  }

  async clear(): Promise<void> {
    await this.postsRepository.clear();
  }
}
