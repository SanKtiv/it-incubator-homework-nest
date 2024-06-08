import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../domain/comment.schema';
import { QueryDto } from '../../../infrastructure/models/query.dto';
import {
  CommentOutputDto,
  commentOutputDto,
} from '../api/models/output/comment.output.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async findById(id: string): Promise<CommentOutputDto> {
    const commentDocument = await this.CommentModel.findById(id);
    if (!commentDocument) throw new NotFoundException();
    return commentOutputDto(commentDocument);
  }

  async countDocuments(id: string): Promise<number> {
    return this.CommentModel.countDocuments({ postId: id });
  }

  async findPaging(id: string, query: QueryDto): Promise<CommentDocument[]> {
    return this.CommentModel.find({ postId: id })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize);
  }
}
