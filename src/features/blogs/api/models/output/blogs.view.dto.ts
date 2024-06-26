import { BlogDocument } from '../../../domain/blogs.schema';
import { BlogQuery } from '../input/blogs.input.dto';

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

export const blogsViewDto = (blogDocument: BlogDocument) =>
  new BlogsViewDto(
    blogDocument._id.toString(),
    blogDocument.name,
    blogDocument.description,
    blogDocument.websiteUrl,
    blogDocument.createdAt,
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
