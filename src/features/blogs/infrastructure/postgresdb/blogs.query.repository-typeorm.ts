import { Injectable } from '@nestjs/common';
import { BlogQuery } from '../../api/models/input/blogs.input.dto';
import {
  BlogsViewPagingDto,
  blogsPagingModelOutput,
} from '../../api/models/output/blogs.view.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogsTable } from '../../domain/blog.entity';

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
    console.log('query =', query);
    const blogs = this.builder;

    if (searchName)
      blogs.where('b.name ~* :nameTerm', { nameTerm: searchName });

    const pagingBlogs = await blogs
      .orderBy(`b.${query.sortBy}`, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    const totalBlogs = await blogs.getCount();

    return blogsPagingModelOutput(query, totalBlogs, pagingBlogs);
  }
}
