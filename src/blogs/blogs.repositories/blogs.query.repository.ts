import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogs.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

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
}
