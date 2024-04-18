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

  async savePost(postDocument: PostDocument): Promise<PostDocument> {
    return this.postsRepository.save(postDocument);
  }

  async updatePost(postDocument: PostDocument, postUpdateDto: PostsInputDto) {
    Object.assign(postDocument, postUpdateDto);
    await this.postsRepository.save(postDocument);
  }

  async deletePost(id: string): Promise<void> {
    await this.postsRepository.remove(id);
  }
}
