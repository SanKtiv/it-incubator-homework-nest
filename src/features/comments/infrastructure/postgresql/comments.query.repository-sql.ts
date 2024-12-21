import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryDto } from '../../../../infrastructure/models/query.dto';
import {
  CommentOutputDto,
  commentOutputModelRawSql,
  CommentsPagingDto,
  commentsSqlPaging,
} from '../../api/models/output/comment.output.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsQueryRepositorySql {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById_RAW(
    id: string,
    userId?: string | null,
  ): Promise<CommentOutputDto> {
    const findCommentsByIdQuery = `
    SELECT c."id", c."content", c."createdAt", c."userId", a."login" AS "userLogin",
          (
            SELECT COUNT(*) 
            FROM "statuses_comments" AS s
            WHERE c."id" = s."commentId" AND s."userStatus" = 'Like'
          ) AS "likesCount",
          (
            SELECT COUNT(*) 
            FROM "statuses_comments" AS s
            WHERE c."id" = s."commentId" AND s."userStatus" = 'Dislike'
          ) AS "dislikesCount",
          (
           SELECT s."userStatus" 
           FROM "statuses_comments" AS s
           WHERE c."id" = s."commentId" AND s."userId" = $2
          ) AS "myStatus"
    FROM "comments" AS c
    LEFT JOIN "users" AS u ON u."id" = c."userId"
    LEFT JOIN "accountData" AS a ON a."id" = u."accountDataId"
    WHERE c."id" = $1`;

    const parameters = [id, userId];

    const [commentDocument] = await this.dataSource.query(
      findCommentsByIdQuery,
      parameters,
    );

    if (!commentDocument) throw new NotFoundException();

    return commentOutputModelRawSql(commentDocument);
  }

  async findPaging_RAW(
    query: QueryDto,
    postId: string | null,
    userId: string | null,
  ): Promise<CommentsPagingDto> {
    const pageSize = query.pageSize;
    const pageOffSet = (query.pageNumber - 1) * query.pageSize;

    const commentsPagingQuery = `
    SELECT c."id", c."content", c."createdAt", c."userId", c."postId", a."login" AS "userLogin",
          (
            SELECT COUNT(*) 
            FROM "statuses_comments" AS s
            WHERE c."id" = s."commentId" AND s."userStatus" = 'Like'
          ) AS "likesCount",
          (
            SELECT COUNT(*) 
            FROM "statuses_comments" AS s
            WHERE c."id" = s."commentId" AND s."userStatus" = 'Dislike'
          ) AS "dislikesCount",
          (
           SELECT s."userStatus" 
           FROM "statuses_comments" AS s
           WHERE c."id" = s."commentId" AND s."userId" = $1
          ) AS "myStatus"
    FROM "comments" AS c
    LEFT JOIN "users" AS u ON u."id" = c."userId"
    LEFT JOIN "accountData" AS a ON a."id" = u."accountDataId"
    WHERE c."postId" = $4
    ORDER BY c."${query.sortBy}" ${query.sortDirection}
    LIMIT $2
    OFFSET $3`;

    const parameters = [userId, pageSize, pageOffSet, postId];

    try {
      const [totalComments] = await this.dataSource.query(
        `SELECT COUNT(*) FROM "comments" WHERE "postId" = $1`,
        [postId],
      );

      const commentsArray = await this.dataSource.query(
        commentsPagingQuery,
        parameters,
      );

      return commentsSqlPaging(query, totalComments.count, commentsArray);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
