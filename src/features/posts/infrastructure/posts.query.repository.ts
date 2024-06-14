import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/posts.schema';
import { PostQuery } from '../api/models/input/posts.input.dto';
import {
  PostsOutputDto,
  postsOutputDto,
  PostsPaging,
  postsPaging,
} from '../api/models/output/posts.output.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async findById(
    id: string,
    userId?: string,
  ): Promise<PostsOutputDto | HttpException> {
    const postDocument = await this.PostModel.findById(id);

    if (!postDocument) throw new NotFoundException();

    return postsOutputDto(postDocument, userId);
  }

  async findPaging(query: PostQuery, id?: string): Promise<PostsPaging> {
    //const filter = id ? {blogId: id} : {}
    const filter = this.filter(id);

    const totalPosts = await this.PostModel.countDocuments(filter);

    const posts = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);

    return postsPaging(query, totalPosts, posts);
  }

  async countDocuments(id?: string): Promise<number> {
    //const filter = id ? {blogId: id} : {}
    const filter = this.filter(id);
    return this.PostModel.countDocuments(filter);
  }

  private filter(id: string | undefined): object {
    return id ? { blogId: id } : {};
  }
}
