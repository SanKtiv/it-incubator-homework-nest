import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CommentServiceDto } from '../api/models/input/comment-service.dto';

@Schema()
class UsersStatuses {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userStatus: string;
}

const UsersStatusesSchema = SchemaFactory.createForClass(UsersStatuses);

@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true })
  postId: string;
  @Prop({ required: true, default: 0 })
  likesCount: number;
  @Prop({ required: true, default: 0 })
  dislikesCount: number;
  @Prop({ type: UsersStatusesSchema })
  usersStatuses: UsersStatuses;
  static createComment(
    dto: CommentServiceDto,
    CommentModel: CommentModelType,
  ): CommentDocument {
    const commentDocument = new CommentModel(dto);
    commentDocument.createdAt = new Date().toISOString();
    return commentDocument;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> &
  CommentStaticMethodsType;

type CommentStaticMethodsType = {
  createComment: (dto: {}, CommentModel: CommentModelType) => CommentDocument;
};

CommentSchema.statics = {
  createComment: Comment.createComment,
};
