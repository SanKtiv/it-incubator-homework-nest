import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogs.schema';
import { Model, Types } from 'mongoose';
import { CreatingBlogDto } from '../blogs.dto/blogs.input.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async create(blogDto: CreatingBlogDto): Promise<BlogDocument> {
    const createdBlog = new this.blogModel(blogDto);
    await createdBlog.save();
    return createdBlog as BlogDocument;
  }

  async save(blogDto: BlogDocument) {
    return blogDto.save();
  }

  async updateById(id: string, inputUpdate: any) {
    try {
      const resultUpdate = await this.blogModel.findByIdAndUpdate(
        id,
        inputUpdate,
      );
      console.log('resultUpdat', resultUpdate);
    } catch (e) {
      return null;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.blogModel.findByIdAndDelete(id);
  }

  async deleteAll(): Promise<void> {
    await this.blogModel.deleteMany();
  }
}
