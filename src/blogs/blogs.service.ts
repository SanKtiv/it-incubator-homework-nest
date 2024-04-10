import { Injectable } from '@nestjs/common';
import { BlogsInputDto, CreatingBlogDto } from './blogs.dto/blogs.input.dto';
import { BlogsRepository } from './blogs.repositories/blogs.repository';
import { BlogsViewDto } from './blogs.dto/blogs.view.dto';
import { BlogDocument } from './blogs.schema';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async createBlog(dto: BlogsInputDto): Promise<BlogDocument> {
    return this.blogsRepository.create(dto);
  }
}
