import { BlogDocument } from '../../../domain/blogs.schema';
import { BlogQuery } from '../input/blogs.input.dto';
import { BlogsTable } from '../../../domain/blog.entity';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import retryTimes = jest.retryTimes;

export class BlogsViewDto {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean,
  ) {}
}

export class BlogsViewPagingDto {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: BlogsViewDto[],
  ) {}
}

export const blogsViewDto = (blogDocument: BlogDocument): BlogsViewDto => ({
  id: blogDocument._id.toString(),
  name: blogDocument.name,
  description: blogDocument.description,
  websiteUrl: blogDocument.websiteUrl,
  createdAt: blogDocument.createdAt,
  isMembership: blogDocument.isMembership,
});

export const sqlBlogsViewDto = (blogDocument: BlogsTable): BlogsViewDto =>
  new BlogsViewDto(
    blogDocument.id,
    blogDocument.name,
    blogDocument.description,
    blogDocument.websiteUrl,
    blogDocument.createdAt.toISOString(),
    blogDocument.isMembership,
  );

export const blogPagingViewModel = (
  query: BlogQuery,
  totalBlogs: number,
  blogsPaging: BlogDocument[],
) =>
  new BlogsViewPagingDto(
    Math.ceil(totalBlogs / query.pageSize),
    query.pageNumber,
    query.pageSize,
    totalBlogs,
    blogsPaging.map((blog) => blogsViewDto(blog)),
  );

export const sqlBlogPagingViewModel = (
  query: BlogQuery,
  totalBlogs: number,
  blogsPaging: BlogsTable[],
) =>
  new BlogsViewPagingDto(
    Math.ceil(totalBlogs / query.pageSize),
    query.pageNumber,
    query.pageSize,
    totalBlogs,
    blogsPaging.map((blog) => sqlBlogsViewDto(blog)),
  );
