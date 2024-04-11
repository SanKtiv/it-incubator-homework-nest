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

  async updateBlog(blog: BlogDocument, inputUpdate: BlogsInputDto) {
    Object.assign(blog, inputUpdate);
    // blog.name = inputUpdate.name
    // blog.description = inputUpdate.description
    // blog.websiteUrl = inputUpdate.websiteUrl
    await this.blogsRepository.save(blog)
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.blogsRepository.deleteById(id)
  }
}
