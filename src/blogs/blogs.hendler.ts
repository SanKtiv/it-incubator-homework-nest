import { Injectable } from '@nestjs/common';
import { BlogDocument } from './blogs.schema';
import { BlogsViewDto } from './blogs.dto/blogs.view.dto';

@Injectable()
export class BlogsHandler {
  async blogViewDto(blog: BlogDocument): Promise<BlogsViewDto> {
    const blogViewDto: BlogsViewDto = new BlogsViewDto(
      blog._id.toString(),
      blog.name,
      blog.description,
      blog.websiteUrl,
      blog.createdAt,
      blog.isMembership,
    );
    return blogViewDto;
  }
}
