import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/posts.schema';
import { PostsInputDto } from '../../api/models/input/posts.input.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async create(
    inputDto: PostsInputDto,
    blogName: string,
  ): Promise<PostDocument> {
    const postDocument = await this.PostModel.createPost(
      inputDto,
      blogName,
      this.PostModel,
    );
    return postDocument.save();
  }

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findById(id);
  }

  async save(postDocument: PostDocument): Promise<PostDocument> {
    return postDocument.save();
  }

  async remove(id: string): Promise<PostDocument | null> {
    return this.PostModel.findByIdAndDelete(id);
  }

  async deleteAll(): Promise<void> {
    await this.PostModel.deleteMany();
  }
}
