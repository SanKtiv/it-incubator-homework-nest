import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostQuery } from '../../api/models/input/posts.input.dto';
import {
  postViewModel_SQL,
  PostsOutputDto,
  PostsPaging,
  postsPagingViewModel_SQL,
} from '../../api/models/output/posts.output.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { PostsTable } from '../../domain/posts.table';
import { StatusesPostsTable } from '../../../statuses/domain/statuses.entity';

@Injectable()
export class PostsQueryRepositoryTypeOrm {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostsTable) protected repository: Repository<PostsTable>,
  ) {}

  // private get repository() {
  //     return this.dataSource.getRepository(PostsTable);
  // }

  private get builder() {
    return this.repository.createQueryBuilder('p');
  }

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

  async getMany(
    query: PostQuery,
    blogId: string,
    userId?: string,
  ): Promise<PostsTable[]> {
    //const filter = dto.blogId ? { blogId: dto.blogId } : {};

    const posts = this.repository.createQueryBuilder('p');

    const subQueryCountLikesPost = (
      subQuery: SelectQueryBuilder<StatusesPostsTable>,
    ) =>
      subQuery
        .select('CAST (COUNT(*) AS INT)', 'likesCount')
        .from(StatusesPostsTable, 'sp')
        .where('p.id = sp."postId"')
        .andWhere('sp."userStatus" = :like', { like: 'Like' });

    const subQueryCountDislikesPost = (
      subQuery: SelectQueryBuilder<StatusesPostsTable>,
    ) =>
      subQuery
        .select('CAST (COUNT(*) AS INT)')
        .from(StatusesPostsTable, 'sp')
        .where('p.id = sp."postId"')
        .andWhere('sp."userStatus" = :dislike', { dislike: 'Dislike' });

    const subQueryNewestLikes = (
        subQuery: SelectQueryBuilder<StatusesPostsTable>,
    ) =>
        subQuery
            .select('nwl.id')
            .from(StatusesPostsTable, 'nwl')
            .where('p.id = nwl."postId"')
            .andWhere('nwl."userStatus" = :like1', { like1: 'Like' })
    //console.log('subQuery =', subQueryCountLikesPost)
    // if (blogId) {
    //   posts.where('p.blogId = :blogId', { blogId: blogId });
    // }

    // const totalPosts = await posts.getCount();
    //
    const postsPaging = await posts
      .select(['p.*', 'b.name AS "blogName"'])
      .addSelect(subQueryCountLikesPost, 'likesCount')
      .addSelect(subQueryCountDislikesPost, 'dislikesCount')
      //   .addSelect(subQueryNewestLikes, 'newestLikes')
      .leftJoin('p.blogId', 'b')
      .orderBy(`p.${query.sortBy}`, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();
    console.log('postsPaging =', postsPaging);
    return postsPaging;

    //return postsPaging(query, totalPosts, postsPaging, dto.userId);
  }
}
