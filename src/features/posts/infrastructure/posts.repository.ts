import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/posts.schema';
import { PostsInputDto } from '../api/models/input/posts.input.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async create(
    inputDto: PostsInputDto,
    blogName: string,
  ): Promise<PostDocument> {
    return this.PostModel.createPost(inputDto, blogName, this.PostModel);
  }

  async save(postDocument: PostDocument): Promise<PostDocument> {
    return postDocument.save();
  }

  async remove(id: string): Promise<void> {
    await this.PostModel.findByIdAndDelete(id);
  }

  async deleteAll(): Promise<void> {
    await this.PostModel.deleteMany();
  }
}
