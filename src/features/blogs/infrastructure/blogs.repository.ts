import { Injectable } from '@nestjs/common';
import { BlogsRepositoryTypeOrm } from './postgresdb/blogs.repository-typeorm';
import { BlogsServicesDto } from '../api/models/input/blogs.services.dto';
import { BlogsTable } from '../domain/blog.entity';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';

@Injectable()
export class BlogsRepository {
  constructor(private readonly blogsRepository: BlogsRepositoryTypeOrm) {}

  async create(dto: BlogsTable) {
    return this.blogsRepository.createBlog(dto);
  }

  async findById(id: string) {
    return this.blogsRepository.findById(id);
  }

  async updateById(id: string, inputUpdate: BlogsInputDto) {
    return this.blogsRepository.updateBlogById(id, inputUpdate);
  }

  async deleteById(id: string) {
    return this.blogsRepository.deleteOne(id);
  }

  async clear() {}
}
