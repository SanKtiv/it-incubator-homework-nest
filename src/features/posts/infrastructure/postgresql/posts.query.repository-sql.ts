import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostQuery } from '../../api/models/input/posts.input.dto';
import {
  postViewModel_SQL,
  PostsOutputDto,
  PostsPaging,
  postsPagingViewModel_SQL,
} from '../../api/models/output/posts.output.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById_RAW(
    id: string,
    userId?: string | null,
  ): Promise<PostsOutputDto | null> {
    const findByIdQuery = `
    WITH "post" AS (
      SELECT p."id", p."content", p."title", p."shortDescription", p."blogId", p."createdAt",
            b."name" AS "blogName", s."userStatus" AS "myStatus",
            (SELECT COUNT(*) FROM "statuses_posts" WHERE p."id" = "postId" AND "userStatus" = 'Like') AS "likesCount",
            (SELECT COUNT(*) FROM "statuses_posts" WHERE p."id" = "postId" AND "userStatus" = 'Dislike') AS "dislikesCount"
      FROM "posts" AS p
      LEFT JOIN "blogs" AS b ON p."blogId" = b."id"
      LEFT JOIN "statuses_posts" AS s ON p."id" = s."postId" AND s."userId" = $2
      WHERE p."id" = $1
      ),
    "newestLikes" AS (
      SELECT "addedAt", "login", "userId", "postId",
          ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "addedAt" DESC) AS "rowNumber"
      FROM "statuses_posts"
      LEFT JOIN "users" ON users."id" = "userId"
      LEFT JOIN "accountData" AS a ON a."id" = users."accountDataId"
      WHERE "userStatus" = 'Like' AND "postId" = $1
      ORDER BY "addedAt" DESC
      ),
    "newestLikesSorted" AS (
      SELECT "addedAt", "login", "userId", "postId" FROM "newestLikes" WHERE "rowNumber" <= 3
      )
    SELECT * FROM "post" AS p
    LEFT JOIN "newestLikesSorted" AS n ON p."id" = n."postId"
    ORDER BY n."addedAt" DESC`;

    const parameters = [id, userId];

    try {
      const post = await this.dataSource.query(findByIdQuery, parameters);

      if (!post[0]) return null;

      return postViewModel_SQL(post)[0];
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async findPaging_RAW(
    query: PostQuery,
    blogId: string | null,
    userId: string | null,
  ): Promise<PostsPaging> {
    const pageSize = query.pageSize;
    const pageOffSet = (query.pageNumber - 1) * query.pageSize;
    const stringSelectByBlogId: string = blogId ? 'WHERE p."blogId" = $4' : '';

    const postPagingQuery = `
    WITH "postsPaging" AS (
      SELECT p."id", p."content", p."title", p."shortDescription", p."blogId", p."createdAt",
            b."name" AS "blogName", s."userStatus" AS "myStatus",
            (SELECT COUNT(*) FROM "statuses_posts" WHERE p."id" = "postId" AND "userStatus" = 'Like') AS "likesCount",
            (SELECT COUNT(*) FROM "statuses_posts" WHERE p."id" = "postId" AND "userStatus" = 'Dislike') AS "dislikesCount"
      FROM "posts" AS p
      LEFT JOIN "blogs" AS b ON p."blogId" = b."id"
      LEFT JOIN "statuses_posts" AS s ON p."id" = s."postId" AND s."userId" = $1
      ${stringSelectByBlogId}
      ORDER BY "${query.sortBy}" ${query.sortDirection}
      LIMIT $2 OFFSET $3
    ),
    "newestLikes" AS (
      SELECT "addedAt", "login", "userId", "postId",
            ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "addedAt" DESC) AS "rowNumber"
      FROM "statuses_posts"
      LEFT JOIN "users" ON users."id" = "userId"
      LEFT JOIN "accountData" AS a ON a."id" = users."accountDataId"
      WHERE "userStatus" = 'Like' AND "postId" is distinct from null
    ),
    "newestLikesSorted" AS (
      SELECT "addedAt", "login", "userId", "postId" FROM "newestLikes" WHERE "rowNumber" <= 3
      )
    SELECT p.*, n.*  FROM "postsPaging" AS p
    LEFT JOIN "newestLikesSorted" AS n ON p."id" = n."postId"
    ORDER BY p."${query.sortBy}" ${query.sortDirection}, n."addedAt" DESC`;

    const countPostsQuery = blogId
      ? `SELECT COUNT(*) FROM "posts" WHERE "blogId" = $1`
      : `SELECT COUNT(*) FROM "posts"`;

    const parametersPaging = blogId
      ? [userId, pageSize, pageOffSet, blogId]
      : [userId, pageSize, pageOffSet];

    const parametersCount = blogId ? [blogId] : [];

    try {
      const [totalPosts] = await this.dataSource.query(
        countPostsQuery,
        parametersCount,
      );

      const postsPaging = await this.dataSource.query(
        postPagingQuery,
        parametersPaging,
      );

      return postsPagingViewModel_SQL(query, totalPosts.count, postsPaging);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
