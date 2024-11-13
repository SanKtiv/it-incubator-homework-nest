import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.schema';
import { PostQuery } from '../../api/models/input/posts.input.dto';
import {
  PostsOutputDto,
  postsOutputDto,
  PostsPaging,
  postsPaging,
} from '../../api/models/output/posts.output.dto';

@Injectable()
export class PostsQueryRepositoryMongo {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async findById(id: string, userId?: string): Promise<PostsOutputDto> {
    const postDocument = await this.PostModel.findById(id);

    if (!postDocument) throw new NotFoundException();

    return postsOutputDto(postDocument, userId);
  }

  async findPaging(
    query: PostQuery,
    dto: { userId?: string; blogId?: string },
  ): Promise<PostsPaging> {
    const filter = dto.blogId ? { blogId: dto.blogId } : {};

    const totalPosts = await this.PostModel.countDocuments(filter);

    const posts = await this.PostModel.find(filter)
      //.sort({ [query.sortBy]: query.sortDirection }) dont work with upper case
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);

    return postsPaging(query, totalPosts, posts, dto.userId);
  }
}
