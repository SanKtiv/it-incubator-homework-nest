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
  commentOutputDto, commentOutputModelRawSql,
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

  async findById(id: string, userId?: string | null): Promise<CommentOutputDto> {
    const rawQuery = `
    SELECT c."id", c."content", c."createdAt", c."userId",
      (SELECT u."login" FROM "users" AS u WHERE c."userId" = u."id") AS "userLogin",
      (SELECT COUNT(*) FROM "statuses" AS s
        WHERE c."id" = s."commentId" AND s."userStatus" = 'Like') AS "likesCount",
      (SELECT COUNT(*) FROM "statuses" AS s
        WHERE c."id" = s."commentId" AND s."userStatus" = 'Dislike') AS "dislikesCount",
      (SELECT s."userStatus" FROM "statuses" AS s
        WHERE c."id" = s."commentId" AND s."userId" = $2) AS "myStatus"  
    FROM "comments" AS c
    WHERE c."id" = $1`

    const parameters = [id, userId]

    const commentDocument = await this.dataSource.query(rawQuery, parameters);

    if (commentDocument.length === 0) throw new NotFoundException();

    return commentOutputModelRawSql(commentDocument);
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
