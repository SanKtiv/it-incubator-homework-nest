import { generateOptionsInjectionToken } from '@nestjs/common/module-utils/utils';
import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsInputDto } from '../api/models/input/posts.input.dto';
import { PostDocument } from '../domain/posts.schema';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async createPost(
    inputDto: PostsInputDto,
    blogName: string,
  ): Promise<PostDocument> {
    return this.postsRepository.create(inputDto, blogName);
  }
}
