import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';
import {
  BlogsViewDto,
  blogsViewModel,
} from '../api/models/output/blogs.view.dto';
import { BlogsTable } from '../domain/blog.entity';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async createBlog(dto: BlogsInputDto): Promise<BlogsViewDto> {
    const blogEntity = new BlogsTable();

    blogEntity.name = dto.name;
    blogEntity.websiteUrl = dto.websiteUrl;
    blogEntity.description = dto.description;
    blogEntity.isMembership = false;
    blogEntity.createdAt = new Date();

    const blog = await this.blogsRepository.create(blogEntity);

    return blogsViewModel(blog);
  }

  async updateBlog(id: string, inputUpdate: BlogsInputDto): Promise<void> {
    const updateInfo = await this.blogsRepository.updateById(id, inputUpdate);

    if (updateInfo.affected != 1) throw new NotFoundException();
  }

  async existBlog(id: string): Promise<BlogsTable> {
    const blog = await this.blogsRepository.findById(id);

    if (!blog) throw new NotFoundException();

    return blog;
  }

  async deleteBlogById(id: string): Promise<void> {
    const result = await this.blogsRepository.deleteById(id);

    if (!result || result.affected != 1) throw new NotFoundException();
  }
}
