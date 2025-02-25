import { Injectable } from '@nestjs/common';
import { BlogsRepositoryTypeOrm } from './postgresdb/blogs.repository-typeorm';
import { BlogsServicesDto } from '../api/models/input/blogs.services.dto';
import { BlogsTable } from '../domain/blog.entity';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';

@Injectable()
export class BlogsRepository {
  constructor(private readonly blogsRepository: BlogsRepositoryTypeOrm) {}

  async createBlog(dto: BlogsTable): Promise<BlogsTable> {
    return this.blogsRepository.create(dto);
  }

  async findBlogById(id: string): Promise<BlogsTable | null> {
    return this.blogsRepository.findById(id);
  }

  async updateBlogById(id: string, inputUpdate: BlogsInputDto) {
    return this.blogsRepository.updateById(id, inputUpdate);
  }

  async deleteBlogById(id: string) {
    return this.blogsRepository.deleteOne(id);
  }

  async clear(): Promise<void> {
    await this.blogsRepository.clear();
  }
}
