import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, HydratedDocument, Model} from 'mongoose';
import { PostsInputDto } from '../api/models/input/posts.input.dto';

@Schema()
export class LikesUsers {
  @Prop({ required: true })
  userStatus: 'None' | 'Like' | 'Dislike';

  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;
}

const LikesUsersSchema = SchemaFactory.createForClass(LikesUsers);

@Schema()
class TotalLikeStatuses {
  @Prop({ required: true, default: 0 })
  likesCount: number;

  @Prop({ required: true, default: 0 })
  dislikesCount: number;
}

const TotalLikeStatusesSchema = SchemaFactory.createForClass(TotalLikeStatuses);

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true, default: new Date().toISOString()} )
  createdAt: string;

  @Prop({ type: TotalLikeStatusesSchema, required: true, _id: false })
  totalLikeStatuses: TotalLikeStatuses;

  @Prop({ type: LikesUsersSchema, required: true, _id: false })
  likesUsers?: LikesUsers;

  static createPost(
    inputDto: PostsInputDto,
    blogName: string,
    PostModel: PostModelType,
  ): PostDocument {
    const post = new PostModel(inputDto);
    post.blogName = blogName;
    //post.createdAt = new Date().toISOString();
    post.totalLikeStatuses = {
        likesCount: 0,
        dislikesCount: 0
    };
    return post;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & PostsStaticMethodsType;

type PostsStaticMethodsType = {
  createPost: (
    inputDto: PostsInputDto,
    blogName: string,
    PostModel: PostModelType,
  ) => PostDocument;
};

PostSchema.statics = {
  createPost: Post.createPost,
};
