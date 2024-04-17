import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Post, PostDocument, PostModelType} from '../domain/posts.schema';
import { PostsInputDto } from '../api/models/input/posts.input.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async create(inputDto: PostsInputDto, blogName: string) {
    return this.PostModel.createPost(inputDto, blogName, this.PostModel);
  }

  async save(postDocument: PostDocument): Promise<PostDocument> {
    return postDocument.save()
  }

  async deleteAll() {
    await this.PostModel.deleteMany()
  }
}
