import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.schema';
import { PostQuery } from '../../api/models/input/posts.input.dto';
import {
  postOutputModelFromSql,
  PostsOutputDto,
  postsOutputDto,
  PostsPaging,
  postsPaging,
  postsSqlOutputDto,
  postsSqlPaging,
} from '../../api/models/output/posts.output.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsTable } from '../../domain/posts.table';

@Injectable()
export class PostsQueryRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PostsTable);
  }

  async countById(postId: string) {
    const rawQuery = `SELECT COUNT (*) FROM "posts" WHERE "id" = $1`;

    try {
      const countPostsArray = await this.dataSource.query(rawQuery, [postId]);

      return countPostsArray[0].count;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string, userId?: string | null): Promise<PostsOutputDto> {
    // const postDocument = await this.repository.findOneBy({ id: id });

    if (!userId) userId = null;
    const parameters = [id, userId];

    const rawQuery = `
    SELECT newPost.*, newestLikes."addedAt", newestLikes."userId", newestLikes."login"
    FROM (SELECT p."id", p."content", p."title", p."shortDescription", p."blogId", p."createdAt",
        
        (SELECT b."name" FROM "blogs" AS b WHERE p."blogId" = b."id"::text) AS "blogName",
        
        (SELECT COUNT(*) FROM "statuses" AS s
        WHERE p."id" = s."postId" AND s."userStatus" = 'Like') AS "likesCount",
        
        (SELECT COUNT(*) FROM "statuses" AS s
        WHERE p."id" = s."postId" AND s."userStatus" = 'Dislike') AS "dislikesCount",
        
        (SELECT s."userStatus" FROM "statuses" AS s
        WHERE p."id" = s."postId" AND s."userId" = $2) AS "myStatus"
        
    FROM "posts" AS p
    WHERE p."id" = $1) AS newPost
    LEFT JOIN
    (SELECT s."addedAt", s."userId", s."postId",
      (SELECT u."login" FROM "users" AS u WHERE s."userId" = u."id") AS "login"
    FROM "statuses" AS s
    WHERE s."userStatus" = 'Like' AND s."postId" = $1
    ORDER BY s."addedAt" desc
    LIMIT 3) AS newestLikes ON newPost."id" = newestLikes."postId"`;

    try {
      const postDocument = await this.dataSource.query(rawQuery, parameters);

      if (postDocument.length === 0) throw new NotFoundException();

      return postOutputModelFromSql(postDocument)[0];
    } catch (e) {
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
    const stringSelectByBlogId: string = blogId ? 'WHERE p."blogId" = $4' : ''

    const postPagingQuery = `
    WITH
    "postsPaging" AS
    (SELECT p."id", p."content", p."title", p."shortDescription", p."blogId", p."createdAt",
      b."name" AS "blogName", s."userStatus" AS "myStatus",
      (SELECT COUNT(*) FROM "statuses" WHERE p."id" = "postId" AND "userStatus" = 'Like') AS "likesCount",
      (SELECT COUNT(*) FROM "statuses" WHERE p."id" = "postId" AND "userStatus" = 'Dislike') AS "dislikesCount"
    FROM "posts" AS p
    LEFT JOIN "blogs" AS b ON p."blogId" = b."id"
    LEFT JOIN "statuses" AS s ON p."id" = s."postId" AND s."userId" = $1
    ${stringSelectByBlogId}
    ORDER BY p."${query.sortBy}" ${query.sortDirection}
    LIMIT $2 OFFSET $3),
    
    "newestLikes" AS
    (SELECT "addedAt", "login", "userId", "postId",
    ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "addedAt" DESC) AS "rowNumber"
    FROM "statuses"
    LEFT JOIN "users" ON users."id" = "userId"
    LEFT JOIN "accountData" AS a ON a."id" = users."accountDataId"
    WHERE "userStatus" = 'Like' AND "postId" is distinct from null),
    
    "newestLikesSorted" AS
    (SELECT "addedAt", "login", "userId", "postId" FROM "newestLikes" WHERE "rowNumber" <= 3)
    
    SELECT p.*, n.* FROM "postsPaging" AS p
    LEFT JOIN "newestLikesSorted" AS n ON p."id" = n."postId"`;

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

      return postsSqlPaging(query, totalPosts.count, postsPaging);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  // async findPaging(
  //   query: PostQuery,
  //   dto: { userId?: string; blogId?: string },
  // ): Promise<PostsPaging> {
  //   const filter = dto.blogId ? { blogId: dto.blogId } : {};
  //
  //   //const totalPosts = await this.repository.countBy(filter); for mongo
  //
  //   const posts = this.repository.createQueryBuilder('post');
  //
  //   if (dto.blogId) {
  //     posts.where('post.blogId = :blogId', { blogId: dto.blogId });
  //   }
  //
  //   const totalPosts = await posts.getCount();
  //
  //   const postsPaging = await posts
  //     .orderBy(`post.${query.sortBy}`, query.sortDirection)
  //     .skip((query.pageNumber - 1) * query.pageSize)
  //     .take(query.pageSize)
  //     .getMany();
  //
  //   return postsSqlPaging(query, totalPosts, postsPaging, dto.userId);
  // }
}
