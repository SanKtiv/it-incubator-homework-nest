import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from './blogs.schema';
import { BlogsViewDto } from './blogs.dto/blogs.view.dto';

@Injectable()
export class BlogsHandler {
  async blogViewDto(blog: BlogDocument): Promise<BlogsViewDto> {
    return new BlogsViewDto(
      blog._id.toString(),
      blog.name,
      blog.description,
      blog.websiteUrl,
      blog.createdAt,
      blog.isMembership,
    );
  }
}
