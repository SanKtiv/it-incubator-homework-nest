import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsModelType } from '../../domain/blogs.schema';
import { BlogQuery } from '../../api/models/input/blogs.input.dto';
import {
  blogPagingOutputModel,
  BlogsViewDto,
  blogsOutputDto,
  BlogsViewPagingDto,
} from '../../api/models/output/blogs.view.dto';

@Injectable()
export class BlogsQueryRepositoryMongo {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogsModelType) {}

  async findById(id: string): Promise<BlogsViewDto> {
    const blogDocument = await this.BlogModel.findById(id);

    if (!blogDocument) throw new NotFoundException();

    return blogsOutputDto(blogDocument);
  }

  async getBlogsPaging(query: BlogQuery): Promise<BlogsViewPagingDto> {
    let filter = {};

    if (query.searchNameTerm)
      filter = { name: { $regex: query.searchNameTerm, $options: 'i' } };

    const totalBlogs = await this.BlogModel.countDocuments(filter);

    const pagingBlogs = await this.BlogModel.find(filter)
      //.sort({ [query.sortBy]: query.sortDirection }) dont work with upper case
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);

    return blogPagingOutputModel(query, totalBlogs, pagingBlogs);
  }
}
