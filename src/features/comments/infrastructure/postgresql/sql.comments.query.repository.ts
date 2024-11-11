import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
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
  commentsPagingDto, commentsSqlPaging,
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

  async findPaging(
    query: QueryDto,
    dto: { id?: string | null, userId?: string | null}
  ): Promise<CommentsPagingDto> {
    const userId = dto.userId ? dto.userId : null;
    const postId = dto.id ? dto.id : null;
    const pageSize = query.pageSize;
    const pageOffSet = (query.pageNumber - 1) * query.pageSize;

    const rawQuery = `
    SELECT c."id", c."content", c."createdAt", c."userId",
      (SELECT u."login" FROM "users" AS u WHERE c."userId" = u."id") AS "userLogin",
      (SELECT COUNT(*) FROM "statuses" AS s
        WHERE c."id" = s."commentId" AND s."userStatus" = 'Like') AS "likesCount",
      (SELECT COUNT(*) FROM "statuses" AS s
        WHERE c."id" = s."commentId" AND s."userStatus" = 'Dislike') AS "dislikesCount",
      (SELECT s."userStatus" FROM "statuses" AS s
        WHERE c."id" = s."commentId" AND s."userId" = $1) AS "myStatus"  
    FROM "comments" AS c
    WHERE c."postId" = $4
    ORDER BY c."${query.sortBy}" ${query.sortDirection}
    LIMIT $2
    OFFSET $3`;

    const parameters = [userId, pageSize, pageOffSet, postId];

    try {
      const totalCommentsArr = await this.dataSource
          .query(`SELECT COUNT(*) FROM "comments" WHERE "postId" = $1`, [postId])

      const totalPosts = totalCommentsArr[0].count

      const commentsArray = await this.dataSource.query(rawQuery, parameters)

      return commentsSqlPaging(query, totalPosts, commentsArray)
    }
    catch (e) {
      throw new InternalServerErrorException()
    }
  }
}
