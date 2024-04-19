import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../domain/comment.schema';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async create(dto: {}): Promise<CommentDocument> {
    return this.CommentModel.createComment(dto, this.CommentModel);
  }

  async save(commentDocument: CommentDocument): Promise<CommentDocument> {
    return commentDocument.save();
  }

  async deleteAll() {
    await this.CommentModel.deleteMany()
  }
}
