import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BlogQuery } from '../../api/models/input/blogs.input.dto';
import {
  BlogsViewDto,
  BlogsViewPagingDto,
  blogsPagingModelOutput,
  blogsViewModel,
} from '../../api/models/output/blogs.view.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepositoryRawSql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById_RAW(id: string): Promise<BlogsViewDto | undefined> {
    const findBlogByIdQuery = `
    SELECT b."id", b."name", b."description", b."websiteUrl", b."createdAt", b."isMembership"
    FROM public."blogs" AS b
    WHERE b."id" = $1;`;

    try {
      const [blog] = await this.dataSource.query(findBlogByIdQuery, [id]);

      if (!blog) return blog;

      return blogsViewModel(blog);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getBlogsPaging_RAW(query: BlogQuery): Promise<BlogsViewPagingDto> {
    const searchNameTerm =
      query.searchNameTerm === null ? '' : query.searchNameTerm;
    const pageSize = query.pageSize;
    const pageOffSet = (query.pageNumber - 1) * query.pageSize;

    const blogsPagingQuery = `
    SELECT b."id", b."name", b."description", b."websiteUrl", b."createdAt", b."isMembership"
    FROM "blogs" AS b
    WHERE b."name" ~* $1
    ORDER BY b."${query.sortBy}" ${query.sortDirection}
    LIMIT $2 OFFSET $3`;

    const parametersBlogsPaging = [searchNameTerm, pageSize, pageOffSet];

    const countBlogsQuery = `
    SELECT COUNT(*)
    FROM "blogs"
    WHERE "name" ~* $1`;

    const parametersCount = [searchNameTerm];

    const [totalBlogs] = await this.dataSource.query(
      countBlogsQuery,
      parametersCount,
    );

    try {
      const pagingBlogs = await this.dataSource.query(
        blogsPagingQuery,
        parametersBlogsPaging,
      );

      return blogsPagingModelOutput(query, totalBlogs.count, pagingBlogs);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
