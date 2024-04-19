import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/posts.schema';
import { Types } from 'mongoose';
import { PostQuery } from '../api/models/input/posts.input.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async findById(id: string): Promise<PostDocument | null> {
    try {
      return this.PostModel.findById(new Types.ObjectId(id));
    } catch (e) {
      return null;
    }
  }

  async findPaging(query: PostQuery, id?: string): Promise<PostDocument[]> {
    //const filter = id ? {blogId: id} : {}
    const filter = this.filter(id);
    return this.PostModel.find(filter)
      .sort({ createdAt: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
  }

  async countDocuments(id?: string): Promise<number> {
    //const filter = id ? {blogId: id} : {}
    const filter = this.filter(id);
    return this.PostModel.countDocuments(filter);
  }

  private filter(id: string | undefined): {} {
    return id ? { blogId: id } : {};
  }
}
