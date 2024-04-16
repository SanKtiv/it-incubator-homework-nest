import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/posts.schema';
import { PostsInputDto } from '../api/models/input/posts.input.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async create(inputDto: PostsInputDto, blogName: string) {
    return this.PostModel.createPost(inputDto, blogName, this.PostModel);
  }
}
