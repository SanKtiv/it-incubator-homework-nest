import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  StatusesCommentsTable,
  StatusesPostsTable,
  StatusesTable,
} from '../domain/statuses.entity';
import { NewestLikes } from '../../posts/api/models/output/posts.output.dto';

@Injectable()
export class StatusesRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async insertStatusForPost_RAW(
    userId: string,
    postId: string,
    status: string,
  ): Promise<void> {
    const insertStatusForPostQuery = `
        INSERT INTO "statuses_posts" ("userId", "postId", "userStatus", "addedAt")
        VALUES ($1, $2, $3, $4)`;

    const parameters = [userId, postId, status, new Date()];

    try {
      await this.dataSource.query(insertStatusForPostQuery, parameters);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async insertStatusOfComment_RAW(
    userId: string,
    commentId: string,
    status: string,
  ): Promise<void> {
    const insertStatusOfCommentQuery = `
        INSERT INTO "statuses_comments" ("userId", "commentId", "userStatus", "addedAt")
        VALUES ($1, $2, $3, $4)
        `;
    const parameters = [userId, commentId, status, new Date()];

    try {
      await this.dataSource.query(insertStatusOfCommentQuery, parameters);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateStatusForPost_RAW(
    userId: string,
    postId: string,
    status: string,
  ): Promise<void> {
    const updateStatusForPostQuery = `
        UPDATE "statuses_posts"
        SET ("userStatus", "addedAt") = ($1, $2)
        WHERE "userId" = $3 AND "postId" = $4`;

    const parameters = [status, new Date(), userId, postId];

    try {
      await this.dataSource.query(updateStatusForPostQuery, parameters);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateStatusForComment(
    userId: string,
    commentId: string,
    status: string,
  ): Promise<void> {
    const updateQuery = `
        UPDATE "statuses_comments"
        SET ("userStatus", "addedAt") = ($1, $2)
        WHERE "userId" = $3 AND "commentId" = $4`;

    const parameters = [status, new Date(), userId, commentId];

    try {
      await this.dataSource.query(updateQuery, parameters);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async statusOfPost_RAW(
    userId: string,
    postId: string,
  ): Promise<StatusesPostsTable | null> {
    const getPostStatusQuery = `
        SELECT *
        FROM "statuses_posts"
        WHERE "userId" = $1 AND "postId" = $2`;

    const parameters = [userId, postId];

    try {
      const [postStatus] = await this.dataSource.query(
        getPostStatusQuery,
        parameters,
      );

      if (!postStatus) return null;

      return postStatus;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async statusOfComment_RAW(
    userId: string,
    commentId: string,
  ): Promise<StatusesCommentsTable | null> {
    const statusOfCommentQuery = `
        SELECT "userStatus"
        FROM "statuses_comments"
        WHERE "userId" = $1 AND "commentId" = $2`;

    const parameters = [userId, commentId];
    try {
      const [statusesComment] = await this.dataSource.query(
        statusOfCommentQuery,
        parameters,
      );

      if (!statusesComment) return null;

      return statusesComment;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getNewestLikesByPostId(id: string): Promise<NewestLikes[]> {
    const queryParams = [id];

    const querySqlStatus = `
    SELECT s."addedAt", s."userId",
      (SELECT u."login" FROM "users" AS u WHERE s."userId" = u."id") AS "login"
    FROM "statuses" AS s
    WHERE s."userStatus" = 'Like' AND s."postId" = $1
    ORDER BY s."addedAt" desc
    LIMIT 3
    `;
    try {
      return await this.dataSource.query(querySqlStatus, queryParams);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async deleteAll_RAW() {
    await this.dataSource.query(
      `TRUNCATE "statuses_posts", "statuses_comments"`,
    );
  }
}
