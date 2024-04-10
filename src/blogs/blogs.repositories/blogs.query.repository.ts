import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Blog, BlogDocument, BlogsModelType} from '../blogs.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogsModelType) {}

  async findById(id: string): Promise<BlogDocument | null> {
    try {
      const newId = new Types.ObjectId(id);
      return this.blogModel.findById(newId);
    } catch (e) {
      return null;
    }
  }

  async findAll() {
    return this.blogModel.find().exec();
  }

  async getTotalBlogs() {
    return this.blogModel.countDocuments()
  }

  async getTotalBlogsByName(name: string) {

    return this.blogModel
        .countDocuments({name: {$regex: name, $options: 'i'}})
  }

  async getBlogsWithPaging(query: any): Promise<BlogDocument[]> {

    if (query.searchNameTerm) {

      return this.blogModel
          .find({name: {$regex: query.searchNameTerm, $options: 'i'}})
          .sort({[query.sortBy]: query.sortDirection})
          .skip((+query.pageNumber - 1) * +query.pageSize)
          .limit(+query.pageSize)
          .lean()
    }

    return this.blogModel
        .find()
        .sort({[query.sortBy]: query.sortDirection})
        .skip((+query.pageNumber - 1) * +query.pageSize)
        .limit(+query.pageSize)
        .lean()
  }
}
