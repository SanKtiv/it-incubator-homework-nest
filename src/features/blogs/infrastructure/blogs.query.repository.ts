import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogsModelType } from '../domain/blogs.schema';
import { Types } from 'mongoose';
import { BlogQuery } from '../api/models/input/blogs.input.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogsModelType) {}

  async findById(id: string): Promise<BlogDocument | null> {
    try {
      return this.BlogModel.findById(new Types.ObjectId(id));
    } catch (e) {
      return null;
    }
  }

  async getTotalBlogsByName(searchNameTerm: string | null) {
    let filter = {};
    if (searchNameTerm)
      filter = { name: { $regex: searchNameTerm, $options: 'i' } };
    return this.BlogModel.countDocuments(filter);
  }

  async getBlogsWithPaging(query: BlogQuery): Promise<BlogDocument[]> {
    let filter = {};

    if (query.searchNameTerm)
      filter = { name: { $regex: query.searchNameTerm, $options: 'i' } };

    return this.BlogModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
  }
}
