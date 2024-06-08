import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsInputDto } from '../api/models/input/posts.input.dto';
import { PostDocument } from '../domain/posts.schema';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import {
  PostsOutputDto,
  postsOutputDto,
} from '../api/models/output/posts.output.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: PostsInputDto): Promise<PostsOutputDto> {
    const blogDocument = await this.blogsRepository.findById(dto.blogId);

    if (!blogDocument) throw new NotFoundException();

    const postDocument = await this.postsRepository.create(
      dto,
      blogDocument.name,
    );

    return postsOutputDto(postDocument);
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
