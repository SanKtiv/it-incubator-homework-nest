import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogsModelType } from '../domain/blogs.schema';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';
import { Types } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogsModelType,
  ) {}

  async create(blogDto: BlogsInputDto): Promise<BlogDocument> {
    return this.BlogModel.createBlog(blogDto, this.BlogModel);
  }

  async save(blogDto: BlogDocument): Promise<BlogDocument> {
    return blogDto.save();
  }

  async findById(id: string): Promise<BlogDocument | null> {
    try {
      return this.BlogModel.findById(id);
    } catch (e) {
    throw new Error('Error finding blog by blogId');
  }
  }

  async remove(id: string): Promise<BlogDocument | null> {
    try {
      return this.BlogModel.findByIdAndDelete(id);
    } catch (e) {
      throw new Error('Error DB');
    }
  }

  async deleteAll(): Promise<void> {
    await this.BlogModel.deleteMany();
  }
}
