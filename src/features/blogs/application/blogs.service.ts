import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';
import { BlogsRepository } from '../infrastructure/mongodb/blogs.repository';
import { BlogDocument } from '../domain/blogs.schema';
import {
  BlogsViewDto,
  blogsViewDto, sqlBlogsViewDto,
} from '../api/models/output/blogs.view.dto';
import {BlogsSqlRepository} from "../infrastructure/postgresdb/blogs.sql.repository";
import {BlogsTable} from "../domain/blog.entity";

@Injectable()
export class BlogsService {
  constructor(
      private readonly blogsRepository: BlogsRepository,
      private readonly blogsSqlRepository: BlogsSqlRepository
  ) {}

  async createBlog(dto: BlogsInputDto): Promise<BlogsViewDto> {
    const blogDocument = await this.blogsSqlRepository.create(dto);
console.log(blogDocument)
    return sqlBlogsViewDto(blogDocument);
  }

  async updateBlog(id: string, inputUpdate: BlogsInputDto) {
    const blogDocument = await this.existBlog(id);

    Object.assign(blogDocument, inputUpdate);

    await this.blogsSqlRepository.save(blogDocument);
  }

  async existBlog(id: string): Promise<BlogsTable> {
    const blogDocument = await this.blogsSqlRepository.findById(id);

    if (!blogDocument) throw new NotFoundException();

    return blogDocument;
  }

  async deleteBlogById(id: string): Promise<void> {
    const blogDocument = await this.existBlog(id);

    await this.blogsSqlRepository.deleteOne(blogDocument);
  }
}
