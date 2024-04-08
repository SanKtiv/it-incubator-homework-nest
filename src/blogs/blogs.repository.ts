import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blogs.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async create(inputBody: any): Promise<Blog> {
    const createdBlog = new this.blogModel(inputBody);
    return createdBlog.save();
  }

  async findById(id: string): Promise<Blog | null> {
    try {
      return this.blogModel.findById(id);
    } catch (error) {
      throw new Error('Cannot find blog by id');
    }
  }

  async findAll() {
    return this.blogModel.find().exec();
  }

  async updateById(id: string, inputUpdate: any) {
    await this.blogModel.findByIdAndUpdate(id, inputUpdate);
  }

  async deleteById(id: string): Promise<void> {
    await this.blogModel.findByIdAndDelete(id);
  }

  async deleteAll(): Promise<void> {
    await this.blogModel.deleteMany();
  }
}
