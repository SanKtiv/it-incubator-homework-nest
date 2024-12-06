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

  async findById(id: string, userId?: string | null) {
    userId = userId ? userId : null;

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
    WHERE c."id" = $1`;

    const parameters = [id, userId];

    try {
      const arrayOfFoundComments = await this.dataSource.query(
        rawQuery,
        parameters,
      );

      return arrayOfFoundComments[0];
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateById(commentId: string, content: string) {
    const rawQuery = `
    UPDATE "comments"
    SET "content" = $2
    WHERE "id" = $1`;

    const parameters = [commentId, content];

    try {
      await this.dataSource.query(rawQuery, parameters);
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
