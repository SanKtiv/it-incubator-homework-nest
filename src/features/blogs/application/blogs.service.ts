import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';
import { BlogsRepositoryMongo } from '../infrastructure/mongodb/blogs.repository-mongo';
import { BlogDocument } from '../domain/blogs.schema';
import {
  BlogsViewDto,
  blogsViewDto,
  blogsViewDto_SQL,
} from '../api/models/output/blogs.view.dto';
import { BlogsRepositorySql } from '../infrastructure/postgresdb/blogs.repository-sql';
import { BlogsTable } from '../domain/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepositoryMongo: BlogsRepositoryMongo,
    private readonly blogsRepositorySql: BlogsRepositorySql,
  ) {}

  async createBlog(
    dto: BlogsInputDto,
    isMembership?: boolean,
  ): Promise<BlogsViewDto> {
    const blogDocument = await this.blogsRepositorySql.create_RAW(
      dto,
      isMembership,
    );

    return blogsViewDto_SQL(blogDocument);
  }

  async updateBlog(id: string, inputUpdate: BlogsInputDto) {
    const blogDocument = await this.existBlog(id);

    Object.assign(blogDocument, inputUpdate);

    await this.blogsRepositorySql.save(blogDocument);
  }

  async existBlog(id: string): Promise<BlogsTable> {
    const blogDocument = await this.blogsRepositorySql.findById_RAW(id);

    if (!blogDocument) throw new NotFoundException();

    return blogDocument;
  }

  async deleteBlogById(id: string): Promise<void> {
    const blogDocument = await this.existBlog(id);

    await this.blogsRepositorySql.deleteOne_RAW(blogDocument);
  }
}
