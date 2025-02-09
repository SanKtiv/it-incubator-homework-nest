import { Injectable } from '@nestjs/common';
import { BlogsQueryRepositoryTypeOrm } from './postgresdb/blogs.query.repository-typeorm';
import {
  BlogsViewDto,
  blogsViewModel,
} from '../api/models/output/blogs.view.dto';
import { BlogQuery } from '../api/models/input/blogs.input.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(private readonly repository: BlogsQueryRepositoryTypeOrm) {}

  async findById(id: string): Promise<BlogsViewDto | null> {
    const blog = await this.repository.findById(id);

    if (blog) return blogsViewModel(blog);

    return null;
  }

  async findBlogs(query: BlogQuery) {
    return this.repository.getBlogsPaging(query);
  }
}
