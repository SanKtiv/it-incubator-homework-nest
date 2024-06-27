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
  CommentsPagingDto,
  commentsPagingDto,
} from '../api/models/output/comment.output.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async findById(id: string, userId?: string): Promise<CommentOutputDto> {
    const commentDocument = await this.CommentModel.findById(id);
    if (!commentDocument) throw new NotFoundException();
    return commentOutputDto(commentDocument, userId);
  }

  async countDocuments(id: string): Promise<number> {
    return this.CommentModel.countDocuments({ postId: id });
  }

  async findPaging(
    postId: string,
    query: QueryDto,
    userId?: string,
  ): Promise<CommentsPagingDto> {
    const totalComments = await this.CommentModel.countDocuments({
      postId: postId,
    });
    if (totalComments === 0) throw new NotFoundException();
    const commentPaging = await this.CommentModel.find({ postId: postId })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize);
    return commentsPagingDto(query, totalComments, commentPaging, userId);
  }
}
