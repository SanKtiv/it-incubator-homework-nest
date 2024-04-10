import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from './blogs.schema';
import { BlogsViewDto, BlogsViewPagingDto } from './blogs.dto/blogs.view.dto';
import { BlogQuery } from './blogs.dto/blogs.input.dto';

@Injectable()
export class BlogsHandler {
  blogViewDto(blog: BlogDocument): BlogsViewDto {
    return new BlogsViewDto(
      blog._id.toString(),
      blog.name,
      blog.description,
      blog.websiteUrl,
      blog.createdAt,
      blog.isMembership,
    );
  }

  blogPagingViewModel(
    totalBlogs: number,
    blogsPaging: BlogDocument[],
    query: BlogQuery,
  ): BlogsViewPagingDto {
    return {
      pagesCount: Math.ceil(totalBlogs / +query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: totalBlogs,
      items: blogsPaging.map((blog) => this.blogViewDto(blog)),
    };
  }
}
