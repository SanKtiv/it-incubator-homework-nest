import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../../domain/comment.schema';
import { CommentServiceDto } from '../../api/models/input/comment-service.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async create(dto: CommentServiceDto): Promise<CommentDocument> {
    const commentDocument = await this.CommentModel.createComment(
      dto,
      this.CommentModel,
    );
    return commentDocument.save();
  }

  async findById(id: string): Promise<CommentDocument | null> {
    return this.CommentModel.findById(id);
  }

  async save(commentDocument: CommentDocument): Promise<CommentDocument> {
    return commentDocument.save();
  }

  async deleteById(id: string) {
    return this.CommentModel.findByIdAndDelete(id);
  }

  async deleteAll() {
    await this.CommentModel.deleteMany();
  }
}
