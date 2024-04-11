import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogsModelType } from '../domain/blogs.schema';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';
import {Types} from "mongoose";

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogsModelType,
  ) {}

  async create(blogDto: BlogsInputDto): Promise<BlogDocument> {
    const blogDocument = this.BlogModel.createBlog(blogDto, this.BlogModel);
    return blogDocument.save(); // все работает но просит await или иную типизацию
    // const model = new this.BlogModel() //реализация через методы экземпляра
    // const document = model.createBlog(blogDto, this.BlogModel);
    // return document.save();
  }

  async save(blogDto: BlogDocument): Promise<void> {
    await blogDto.save();
  }

  // async updateById(id: string, inputUpdate: any) {
  //   try {
  //     const resultUpdate = await this.BlogModel.findByIdAndUpdate(
  //       id,
  //       inputUpdate,
  //     );
  //     console.log('resultUpdate', resultUpdate)
  //   } catch (e) {
  //     return null;
  //   }
  // }

  async deleteById(id: string): Promise<boolean> {
      const newId = new Types.ObjectId(id)
      const result = await this.BlogModel.deleteOne(newId);
      return result.deletedCount === 1
  }

  async deleteAll(): Promise<void> {
    await this.BlogModel.deleteMany();
  }
}
