import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {BlogsInputDto, CreatingBlogDto} from "./blogs.dto/blogs.input.dto";

@Schema()
export class Blog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  isMembership: boolean;

  createBlog1(dto: BlogsInputDto) {
    this.name = dto.name
    this.description = dto.description
    this.websiteUrl = dto.websiteUrl
    this.createdAt = new Date().toISOString()
    this.isMembership = false
  }
}

export type BlogDocument = HydratedDocument<Blog>;

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.methods = {
  createBlog: Blog.prototype.createBlog1
}