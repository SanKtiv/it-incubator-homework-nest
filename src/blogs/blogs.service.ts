import { Injectable } from '@nestjs/common';
import { BlogsInputDto, CreatingBlogDto } from './blogs.dto/blogs.input.dto';
import { BlogsRepository } from './blogs.repositories/blogs.repository';
import { BlogsViewDto } from './blogs.dto/blogs.view.dto';
import { BlogDocument } from './blogs.schema';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async createBlog(dto: BlogsInputDto): Promise<BlogDocument> {
    const blogDto: CreatingBlogDto = new CreatingBlogDto(
      dto.name,
      dto.description,
      dto.websiteUrl,
      new Date().toISOString(),
      false,
    );
    return this.blogsRepository.create(blogDto);
  }
}
