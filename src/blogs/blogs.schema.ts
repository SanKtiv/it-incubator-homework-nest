import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { BlogsInputDto, CreatingBlogDto } from './blogs.dto/blogs.input.dto';

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

  // createBlog(dto: BlogsInputDto, BlogModel:Model<Blog>) {
  //   return new BlogModel(dto)
  // }

  static createBlog(dto: BlogsInputDto, BlogModel: Model<Blog>) {
    const blogModel = new BlogModel(dto);
    blogModel.createdAt = new Date().toISOString();
    blogModel.isMembership = false;
    return blogModel;
  }
}

export type BlogDocument = HydratedDocument<Blog>;

export type BlogsModelType = Model<BlogDocument> & BlogsStaticMethodsType;

export const BlogSchema = SchemaFactory.createForClass(Blog);

// BlogSchema.methods = {
//   createBlog: Blog.prototype.createBlog
// }

export type BlogsStaticMethodsType = {
  createBlog: (
    dto: BlogsInputDto,
    BlogModel: Model<BlogDocument>,
  ) => BlogDocument;
};

BlogSchema.statics = {
  createBlog: Blog.createBlog,
};
