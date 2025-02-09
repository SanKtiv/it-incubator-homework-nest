import { Injectable } from '@nestjs/common';
import { PostsRepositoryTypeOrm } from './postgresql/posts.repository-typeorm';
import { PostsInputDto } from '../api/models/input/posts.input.dto';
import { PostsTable } from '../domain/posts.table';

@Injectable()
export class PostsRepository {
  constructor(private readonly postsRepository: PostsRepositoryTypeOrm) {}

  create(dto: PostsTable) {
    return this.postsRepository.create(dto);
  }
}
