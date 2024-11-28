import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BlogQuery } from '../../api/models/input/blogs.input.dto';
import {
  BlogsViewDto,
  BlogsViewPagingDto,
  sqlBlogPagingViewModel,
  sqlBlogsViewDto,
} from '../../api/models/output/blogs.view.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogsTable } from '../../domain/blog.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class BlogsQueryRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById(id: string): Promise<BlogsViewDto> {
    const blogDocument = await this.dataSource
      .getRepository(BlogsTable)
      .findOneBy({ id: id });

    if (!blogDocument) throw new NotFoundException();

    return sqlBlogsViewDto(blogDocument);
  }

  // async getBlogsPaging(query: BlogQuery): Promise<BlogsViewPagingDto> {
  //   const searchName = query.searchNameTerm;
  //
  //   const blogs = this.dataSource
  //     .getRepository(BlogsTable)
  //     .createQueryBuilder('blog');
  //
  //   if (searchName)
  //     blogs.where('blog.name ~* :nameTerm', { nameTerm: searchName });
  //
  //   const totalBlogs = await blogs.getCount();
  //
  //   const pagingBlogs = await blogs
  //     .orderBy(`blog.${query.sortBy}`, query.sortDirection)
  //     .skip((query.pageNumber - 1) * query.pageSize)
  //     .take(query.pageSize)
  //     .getMany();
  //
  //   return sqlBlogPagingViewModel(query, totalBlogs, pagingBlogs);
  // }

  async findById_RAW(id: string): Promise<BlogsViewDto> {
    const query = `
    SELECT b."id", b."name", b."description", b."websiteUrl", b."createdAt", b."isMembership"
    FROM public."blogs" AS b
    WHERE b."id" = $1;`;

    const [blog] = await this.dataSource.query(query, [id]);

    if (!blog) throw new NotFoundException();

    return sqlBlogsViewDto(blog);
  }

  async getBlogsPaging(query: BlogQuery): Promise<BlogsViewPagingDto> {
    const pageSize = query.pageSize;
    const pageOffSet = (query.pageNumber - 1) * query.pageSize;

    const blogsPagingQuery = `
    SELECT b."id", b."name", b."description", b."websiteUrl", b."createdAt", b."isMembership"
    FROM "blogs" AS b
    WHERE b."name" ~* $1
    ORDER BY b."${query.sortBy}" ${query.sortDirection}
    LIMIT $2 OFFSET $3`;

    const parametersBlogsPaging = [query.searchNameTerm, pageSize, pageOffSet];

    const countBlogsQuery = `
    SELECT COUNT(*)
    FROM "blogs" AS b
    WHERE b."name" ~* $1`;

    const parametersCount = [query.searchNameTerm];

    const [totalBlogs] = await this.dataSource
        .query(countBlogsQuery, parametersBlogsPaging);

    try {
      const pagingBlogs = await this.dataSource
          .query(blogsPagingQuery, parametersCount);

      return sqlBlogPagingViewModel(query, totalBlogs.count, pagingBlogs);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
