import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/posts.schema';
import { PostQuery } from '../api/models/input/posts.input.dto';
import {PostsOutputDto, postsOutputDto} from "../api/models/output/posts.output.dto";

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async findById(id: string): Promise<PostsOutputDto | HttpException | null> {
    try {
      const postDocument = await this.PostModel.findById(id);
      if (!postDocument) throw new NotFoundException();
      return postsOutputDto(postDocument);
    } catch (e) {
      return null;
    }
  }

  async findPaging(query: PostQuery, id?: string): Promise<PostDocument[]> {
    //const filter = id ? {blogId: id} : {}
    const filter = this.filter(id);
    return this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
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
