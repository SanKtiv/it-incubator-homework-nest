import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../../domain/comment.schema';
import { QueryDto } from '../../../../infrastructure/models/query.dto';
import {
  CommentOutputDto,
  commentOutputDto,
  CommentsPagingDto,
  commentsPagingDto,
} from '../../api/models/output/comment.output.dto';
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";

@Injectable()
export class CommentsSqlQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findById(id: string, userId?: string): Promise<CommentOutputDto> {
    const rawQuery = `
    SELECT c."id", c."content", c."createdAt"
    FROM "comments" AS c`
    const parameters = []

    const commentDocument = await this.dataSource.query(rawQuery, parameters);

    if (!commentDocument) throw new NotFoundException();

    return commentOutputDto(commentDocument, userId);
  }

  // async countDocuments(id: string): Promise<number> {
  //   return this.CommentModel.countDocuments({ postId: id });
  // }

  // async findPaging(
  //   postId: string,
  //   query: QueryDto,
  //   userId?: string,
  // ): Promise<CommentsPagingDto> {
  //   const totalComments = await this.CommentModel.countDocuments({
  //     postId: postId,
  //   });
  //   if (totalComments === 0) throw new NotFoundException();
  //   const commentPaging = await this.CommentModel.find({ postId: postId })
  //     //.sort({ [query.sortBy]: query.sortDirection }) dont work with upper case
  //     .skip((query.pageNumber - 1) * query.pageSize);
  //   return commentsPagingDto(query, totalComments, commentPaging, userId);
  // }
}
