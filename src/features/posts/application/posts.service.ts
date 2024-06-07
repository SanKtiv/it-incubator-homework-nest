import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
    const postDocument = await this.postsRepository.create(inputDto, blogName);
    return this.postsRepository.save(postDocument);
  }

  async savePost(postDocument: PostDocument): Promise<PostDocument> {
    return this.postsRepository.save(postDocument);
  }

  async updatePost(id: string, postUpdateDto: PostsInputDto) {
    const postDocument = await this.postsRepository.findById(id);
    if (!postDocument) throw new NotFoundException();
    Object.assign(postDocument, postUpdateDto);
    await this.postsRepository.save(postDocument);
  }

  async deletePost(id: string): Promise<void | HttpException> {
    const result = await this.postsRepository.remove(id);
    if (!result) throw new NotFoundException();
  }
}
