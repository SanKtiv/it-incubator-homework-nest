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

export const blogsOutputDto = (blogDocument: BlogDocument): BlogsViewDto => ({
  id: blogDocument._id.toString(),
  name: blogDocument.name,
  description: blogDocument.description,
  websiteUrl: blogDocument.websiteUrl,
  createdAt: blogDocument.createdAt,
  isMembership: blogDocument.isMembership,
});

export const blogsViewModel = (blog: BlogsTable): BlogsViewDto => ({
  id: blog.id,
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt.toISOString(),
  isMembership: blog.isMembership,
});

export const blogPagingOutputModel = (
  query: BlogQuery,
  totalBlogs: number,
  blogsPaging: BlogDocument[],
) =>
  new BlogsViewPagingDto(
    Math.ceil(totalBlogs / query.pageSize),
    query.pageNumber,
    query.pageSize,
    totalBlogs,
    blogsPaging.map((blog) => blogsOutputDto(blog)),
  );

export const blogsPagingModelOutput = (
  query: BlogQuery,
  totalBlogs: number,
  blogsPaging: BlogsTable[],
) =>
  new BlogsViewPagingDto(
    Math.ceil(+totalBlogs / query.pageSize),
    query.pageNumber,
    query.pageSize,
    +totalBlogs,
    blogsPaging.map((blog) => blogsViewModel(blog)),
  );
