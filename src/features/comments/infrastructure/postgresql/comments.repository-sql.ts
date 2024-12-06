import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommentServiceDto } from '../../api/models/input/comment-service.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsTable } from '../../domain/comments.entity';
import {
  commentOutputDto,
  CommentOutputDto,
} from '../../api/models/output/comment.output.dto';

@Injectable()
export class CommentsRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create_RAW(dto: CommentServiceDto): Promise<CommentsTable> {
    const createCommentQuery = `
    WITH "findUser" AS (
        SELECT "accountDataId"
        FROM "users" 
        WHERE "id" = $2
    ),
    "userLogin" AS (
        SELECT "login" 
        FROM "accountData" 
        WHERE "id" = (SELECT "accountDataId" FROM "findUser")
    )
    INSERT INTO "comments" ("content", "userId", "createdAt", "postId")
    VALUES ($1, $2, $3, $4)
    RETURNING comments.*, (SELECT "login" FROM "userLogin") AS "userLogin"`;

    const parameters = [
      dto.content,
      dto.userId,
      new Date(),
      dto.postId,
    ];

    try {
      const [comment] = await this.dataSource.query(createCommentQuery, parameters);

      return comment;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findById_RAW(id: string, userId?: string | null) {
    userId = userId ? userId : null;

    const findCommentsByIdQuery = `
    SELECT c."id", c."content", c."createdAt", c."userId", a."login" AS "userLogin",
          (
            SELECT COUNT(*) 
            FROM "statuses" AS s
            WHERE "id" = s."commentId" AND s."userStatus" = 'Like'
          ) AS "likesCount",
          (
            SELECT COUNT(*) 
            FROM "statuses" AS s
            WHERE "id" = s."commentId" AND s."userStatus" = 'Dislike'
          ) AS "dislikesCount",
          (
           SELECT s."userStatus" 
           FROM "statuses" AS s
           WHERE "id" = s."commentId" AND s."userId" = $2
          ) AS "myStatus"
    FROM "comments" AS c
    LEFT JOIN "users" AS u ON u."id" = c."userId"
    LEFT JOIN "accountData" AS a ON a."id" = u."accountDataId"
    WHERE c."id" = $1`;

    const parameters = [id, userId];

    try {
      const [arrayOfFoundComments] = await this.dataSource.query(
          findCommentsByIdQuery,
          parameters
      );

      return arrayOfFoundComments;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateById_RAW(commentId: string, content: string) {
    const commentUpdateQuery = `
    UPDATE "comments"
    SET "content" = $2
    WHERE "id" = $1`;

    const parameters = [commentId, content];

    try {
      await this.dataSource.query(commentUpdateQuery, parameters);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async deleteById_RAW(id: string) {
    const deleteCommentByIdQuery = `
    DELETE FROM "comments" AS c
    WHERE c."id" = $1`;

    const parameters = [id];

    try {
      await this.dataSource.query(deleteCommentByIdQuery, parameters);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async deleteAll() {
    const rawQuery = `TRUNCATE "comments"`;

    try {
      await this.dataSource.query(rawQuery);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async deleteAll_RAW() {
    await this.dataSource
        .query(`TRUNCATE "comments" CASCADE`)
  }
}
