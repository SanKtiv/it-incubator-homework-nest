import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StatusesTable } from '../domain/statuses.entity';
import { NewestLikes } from '../../posts/api/models/output/posts.output.dto';

@Injectable()
export class StatusesRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async insertStatusForPost(
    userId: string,
    postId: string,
    status: string,
  ): Promise<void> {
    const querySql = `
        INSERT INTO "statuses" ("userId", "postId", "userStatus", "addedAt")
        VALUES ($1, $2, $3, $4)
        `;
    const queryParams = [userId, postId, status, new Date()];

    try {
      await this.dataSource.query(querySql, queryParams);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async insertStatusOfComment(
    userId: string,
    commentId: string,
    status: string,
  ): Promise<void> {
    const querySql = `
        INSERT INTO "statuses" ("userId", "commentId", "userStatus", "addedAt")
        VALUES ($1, $2, $3, $4)
        `;
    const queryParams = [userId, commentId, status, new Date()];

    try {
      await this.dataSource.query(querySql, queryParams);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateStatusForPost(
    userId: string,
    postId: string,
    status: string,
  ): Promise<void> {
    const querySql = `
        UPDATE "statuses"
        SET ("userStatus", "addedAt") = ($1, $2)
        WHERE "userId" = $3 AND "postId" = $4
        `;
    const queryParams = [status, new Date(), userId, postId];

    try {
      await this.dataSource.query(querySql, queryParams);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateStatusForComment(
    userId: string,
    commentId: string,
    status: string,
  ): Promise<void> {
    const querySql = `
        UPDATE "statuses"
        SET ("userStatus", "addedAt") = ($1, $2)
        WHERE "userId" = $3 AND "commentId" = $4`;

    const queryParams = [status, new Date(), userId, commentId];

    try {
      await this.dataSource.query(querySql, queryParams);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getCurrentStatusOfPost(
    userId: string,
    postId: string,
  ): Promise<string | null> {
    const querySql = `
        SELECT status."userStatus"
        FROM "statuses" AS status
        WHERE status."userId" = $1 AND status."postId" = $2
        `;
    const queryParams = [userId, postId];
    try {
      const statusesArray = await this.dataSource.query(querySql, queryParams);

      if (statusesArray.length === 0) return null;

      return statusesArray[0].userStatus;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getStatusOfComment(
    userId: string,
    commentId: string,
  ): Promise<string | null> {
    const rawQuery = `
        SELECT status."userStatus"
        FROM "statuses" AS status
        WHERE status."userId" = $1 AND status."commentId" = $2`;

    const parameters = [userId, commentId];
    try {
      const statusesArray = await this.dataSource.query(rawQuery, parameters);

      if (statusesArray.length === 0) return null;

      return statusesArray[0].userStatus;
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

  async deleteAll() {
    const rawQuery = `TRUNCATE "statuses"`;

    try {
      await this.dataSource.query(rawQuery);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
