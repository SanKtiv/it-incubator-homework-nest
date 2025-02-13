import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostQuery } from '../../api/models/input/posts.input.dto';
import {
  postViewModel_SQL,
  PostsOutputDto,
  PostsPaging,
  postsPagingViewModel_SQL, postsModelOutput,
} from '../../api/models/output/posts.output.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { PostsTable } from '../../domain/posts.table';
import { StatusesPostsTable } from '../../../statuses/domain/statuses.entity';
import { UsersTable } from '../../../users/domain/users.table';

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
      blogId: string | null,
      userId?: string | null,
  ): Promise<PostsTable[]> {
    userId = userId ?? null;
    blogId = blogId ?? null;

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
            .select(['st."postId"', 'st."userId"', 'st."addedAt"'])
            .from(StatusesPostsTable, 'st')
            .addSelect(
                'ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "addedAt" DESC) AS "rowNumber"',
            )
            .addSelect('"user"."login"')
            .leftJoin(usersWithLoginEntity, 'user', 'st."userId" = "user"."id"')
            .where('st."userStatus" = :like1', { like1: 'Like' });

    const usersWithLoginEntity = (
        subQuery: SelectQueryBuilder<StatusesPostsTable>,
    ) =>
        subQuery
            .select(['u."id"'])
            .addSelect('acd."login" AS "login"')
            .from(UsersTable, 'u')
            .leftJoin('u.accountData', 'acd');

    const posts = this.dataSource
        .createQueryBuilder(PostsTable, 'p')
        .select(['p.*'])
        .where('p."blogId" = :blogId OR :blogId IS NULL', { blogId })

    const postsPaging = await posts
        .addSelect('b."name"', 'blogName')
        .addSelect('s."userStatus"', 'myStatus')
        .addSelect(subQueryCountLikesPost, 'likesCount')
        .addSelect(subQueryCountDislikesPost, 'dislikesCount')
        .leftJoin(
            StatusesPostsTable,
            's',
            's."postId" = p."id" AND s."userId" = :userID',
            { userID: userId },
        )
        .leftJoin('p.blogId', 'b')
        .orderBy(`p.${query.sortBy}`, query.sortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .take(query.pageSize)
        .getRawMany();

    const totalPosts = await posts.getCount()

    const newestLikesSorted = await this.dataSource
        .createQueryBuilder()
        .from(subQueryNewestLikes, 'nl')
        .where('nl."rowNumber" <= 3')
        .getRawMany();

    console.log('postsPaging =', newestLikesSorted);
    return postsPaging;

    //return postsPaging(query, totalPosts, postsPaging, dto.userId);
  }

  async getManyAllInOne(
    query: PostQuery,
    blogId: string | null,
    userId?: string | null,
  ): Promise<PostsTable[]> {
    userId = userId ?? null;
    blogId = blogId ?? null;

    const totalPosts = await this.repository
        .createQueryBuilder('p')
      .where('p.blogId = :blogId OR :blogId IS NULL', { blogId })
      .getCount();

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
        .select(['st."postId"', 'st."userId"', 'st."addedAt"'])
        .from(StatusesPostsTable, 'st')
        .addSelect(
          'ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "addedAt" DESC) AS "rowNumber"',
        )
        .addSelect('"user"."login"')
        .leftJoin(usersWithLoginEntity, 'user', 'st."userId" = "user"."id"')
        .where('st."userStatus" = :like', { like: 'Like' });

    const usersWithLoginEntity = (
      subQuery: SelectQueryBuilder<StatusesPostsTable>,
    ) =>
      subQuery
        .select(['u."id"'])
        .addSelect('acd."login" AS "login"')
        .from(UsersTable, 'u')
        .leftJoin('u.accountData', 'acd');

    const subQueryPostsPaging = (
      subQuery: SelectQueryBuilder<StatusesPostsTable>,
    ) =>
      subQuery
        .select(['p.*', 'b.name AS "blogName"'])
        .addSelect('s."userStatus"', 'myStatus')
        .addSelect(subQueryCountLikesPost, 'likesCount')
        .addSelect(subQueryCountDislikesPost, 'dislikesCount')
        .from(PostsTable, 'p')
        .where('p."blogId" = :blogId OR :blogId IS NULL', { blogId })
        .leftJoin(
          StatusesPostsTable,
          's',
          's."postId" = p."id" AND s."userId" = :userId',
          { userId },
        )
        .leftJoin('p.blogId', 'b')
        .orderBy(`p.${query.sortBy}`, query.sortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .take(query.pageSize);

    const postsPaging = await this.dataSource
      .createQueryBuilder()
      .select(['pg.*'])
      .addSelect('nl."login"', 'login')
      .addSelect('nl."userId"', 'userId')
      .addSelect('nl."addedAt"', 'addedAt')
      .from(subQueryPostsPaging, 'pg')
      .leftJoin(
        subQueryNewestLikes,
        'nl',
        'nl."postId" = pg."id" AND nl."rowNumber" <= 3',
      )
      .getRawMany();
    console.log('postsPaging =', postsModelOutput(postsPaging)[0].extendedLikesInfo);
    return postsPaging;

    //return postsPaging(query, totalPosts, postsPaging, dto.userId);
  }
}
