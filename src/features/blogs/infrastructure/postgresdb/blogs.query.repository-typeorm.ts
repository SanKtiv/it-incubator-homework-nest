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
  blogsPagingModelOutput,
  blogsViewModel,
} from '../../api/models/output/blogs.view.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogsTable } from '../../domain/blog.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class BlogsQueryRepositoryTypeOrm {
  constructor(
    @InjectRepository(BlogsTable) protected repository: Repository<BlogsTable>,
  ) {}

  private get builder() {
    return this.repository.createQueryBuilder('b');
  }

  async findById(id: string): Promise<BlogsTable | null> {
    return this.repository.findOneBy({ id });
  }

  async getBlogsPaging(query: BlogQuery): Promise<BlogsViewPagingDto> {
    const searchName = query.searchNameTerm;

    const blogs = this.builder;

    if (searchName)
      blogs.where('blog.name ~* :nameTerm', { nameTerm: searchName });

    const totalBlogs = await blogs.getCount();

    const pagingBlogs = await blogs
      .orderBy(`b.${query.sortBy}`, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    return blogsPagingModelOutput(query, totalBlogs, pagingBlogs);
  }

  async findById_RAW(id: string): Promise<BlogsViewDto | undefined> {
    const findBlogByIdQuery = `
    SELECT b."id", b."name", b."description", b."websiteUrl", b."createdAt", b."isMembership"
    FROM public."blogs" AS b
    WHERE b."id" = $1;`;

    try {
      const [blog] = await this.repository.query(findBlogByIdQuery, [id]);

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

    const [totalBlogs] = await this.repository.query(
      countBlogsQuery,
      parametersCount,
    );

    try {
      const pagingBlogs = await this.repository.query(
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
