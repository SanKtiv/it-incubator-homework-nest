import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';
import { BlogsRepositoryMongo } from '../infrastructure/mongodb/blogs.repository-mongo';
import {
  BlogsViewDto,
  blogsViewDto_SQL,
} from '../api/models/output/blogs.view.dto';
import { BlogsRepositorySql } from '../infrastructure/postgresdb/blogs.repository-sql';
import { BlogsTable } from '../domain/blog.entity';
import {BlogsRepository} from "../infrastructure/blogs.repository";
import {BlogsServicesDto} from "../api/models/input/blogs.services.dto";

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async createBlog(
    dto: BlogsInputDto,
  ): Promise<BlogsViewDto> {
    const blogEntity = new BlogsTable()

    blogEntity.name = dto.name
    blogEntity.websiteUrl = dto.websiteUrl
    blogEntity.description = dto.description
    blogEntity.isMembership = false
    blogEntity.createdAt = new Date()

    const blog = await this.blogsRepository.create(
        blogEntity,
    );

    return blogsViewDto_SQL(blog);
  }

  async updateBlog(id: string, inputUpdate: BlogsInputDto) {
    await this.existBlog(id);

    //await this.blogsRepository.updateById_RAW(id, inputUpdate);
  }

  async existBlog(id: string): Promise<BlogsTable> {
    const blog = await this.blogsRepository.find(id);

    if (!blog) throw new NotFoundException();

    return blog;
  }

  async deleteBlogById(id: string): Promise<void> {
    await this.existBlog(id);

    //await this.blogsRepository.deleteById_RAW(id);
  }
}
