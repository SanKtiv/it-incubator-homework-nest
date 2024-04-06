import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blogs.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(createBlog: any) {
    const createdBlog = new this.blogModel(createBlog);
    return createdBlog.save();
  }

  async findAll() {
    return this.blogModel.find().exec();
  }
}
