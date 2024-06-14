import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogsModelType } from '../domain/blogs.schema';
import { Types } from 'mongoose';
import { BlogQuery } from '../api/models/input/blogs.input.dto';
import {
  blogPagingViewModel,
  BlogsViewDto,
  blogsViewDto,
  BlogsViewPagingDto,
} from '../api/models/output/blogs.view.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogsModelType) {}

  async findById(id: string): Promise<BlogsViewDto | HttpException> {
    const blogDocument = await this.BlogModel.findById(id);
    if (!blogDocument) throw new NotFoundException();
    return blogsViewDto(blogDocument);
  }

  async getTotalBlogsByName(searchNameTerm: string | null) {
    let filter = {};
    if (searchNameTerm)
      filter = { name: { $regex: searchNameTerm, $options: 'i' } };
    return this.BlogModel.countDocuments(filter);
  }

  async getBlogsWithPaging(query: BlogQuery): Promise<BlogsViewPagingDto> {
    let filter = {};

    if (query.searchNameTerm)
      filter = { name: { $regex: query.searchNameTerm, $options: 'i' } };

    const totalBlogs = await this.BlogModel.countDocuments(filter);

    const pagingBlogs = await this.BlogModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);

    return blogPagingViewModel(query, totalBlogs, pagingBlogs);
  }
}
