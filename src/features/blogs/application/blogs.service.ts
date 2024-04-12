import { Injectable } from '@nestjs/common';
import {
  BlogsInputDto,
  CreatingBlogDto,
} from '../api/models/input/blogs.input.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogsViewDto } from '../api/models/output/blogs.view.dto';
import { BlogDocument } from '../domain/blogs.schema';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async createBlog(dto: BlogsInputDto): Promise<BlogDocument> {
    return this.blogsRepository.create(dto);
  }

  async updateBlog(blog: BlogDocument, inputUpdate: BlogsInputDto) {
    Object.assign(blog, inputUpdate);
    // blog.name = inputUpdate.name
    // blog.description = inputUpdate.description
    // blog.websiteUrl = inputUpdate.websiteUrl
    await this.blogsRepository.save(blog);
  }

  async deleteBlog(id: string): Promise<void> {
    await this.blogsRepository.remove(id);
  }
}
