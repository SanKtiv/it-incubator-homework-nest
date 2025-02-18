import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostQuery } from '../../api/models/input/posts.input.dto';
import {
  PostsOutputDto,
  PostsPaging,
    postsModelOutput, postsPagingModelOutput,
} from '../../api/models/output/posts.output.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { PostsTable } from '../../domain/posts.table';
import { StatusesPostsTable } from '../../../statuses/domain/statuses.entity';
import { UsersTable } from '../../../users/domain/users.table';
import {BlogsTable} from "../../../blogs/domain/blog.entity";

@Injectable()
export class PostsQueryRepositoryTypeOrm {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostsTable) protected repository: Repository<PostsTable>,
  ) {}

  private get builder() {
    return this.repository.createQueryBuilder('p');
  }

  private getSubQueryCountLikesPost = (
      subQuery: SelectQueryBuilder<StatusesPostsTable>,
  ) =>
      subQuery
          .select('CAST (COUNT(*) AS INT)', 'likesCount')
          .from(StatusesPostsTable, 'sp')
          .where('p.id = sp."postId"')
          .andWhere('sp."userStatus" = :like', { like: 'Like' });

  private getSubQueryCountDislikesPost = (
      subQuery: SelectQueryBuilder<StatusesPostsTable>,
  ) =>
      subQuery
          .select('CAST (COUNT(*) AS INT)')
          .from(StatusesPostsTable, 'sp')
          .where('p.id = sp."postId"')
          .andWhere('sp."userStatus" = :dislike', { dislike: 'Dislike' });

  private getSubQueryNewestLikes() {
      const usersWithLoginEntity = (
          subQuery: SelectQueryBuilder<StatusesPostsTable>,
      ) =>
          subQuery
              .select(['u."id"'])
              .addSelect('acd."login" AS "login"')
              .from(UsersTable, 'u')
              .leftJoin('u.accountData', 'acd');

    return (
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
  }

  async findById(
    id: string,
    userId?: string | null,
  ): Promise<PostsOutputDto | null> {
    userId = userId ?? null

    const subQueryCountLikesPost = (
        subQuery: SelectQueryBuilder<StatusesPostsTable>,
    ) =>
        subQuery
            .select('CAST (COUNT(*) AS INT)')
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

    const posts = await this.dataSource
        .createQueryBuilder()
        .select(['p.*'])
        .addSelect('b.name', 'blogName')
        .addSelect('s."userStatus"', 'myStatus')
        .addSelect(subQueryCountLikesPost, 'likesCount')
        .addSelect(subQueryCountDislikesPost, 'dislikesCount')
        .addSelect('nl."login"', 'login')
        .addSelect('nl."userId"', 'userId')
        .addSelect('nl."addedAt"', 'addedAt')
        .from(PostsTable, 'p')
        .where('p.id = :id', {id})
        .leftJoin('p.blogId', 'b')
        .leftJoin(
            subQueryNewestLikes,
            'nl',
            'nl."postId" = p."id" AND nl."rowNumber" <= 3',
        )
        .leftJoin(
            StatusesPostsTable,
            's',
            's."postId" = p."id" AND s."userId" = :userId',
            { userId },
        )
        .getRawMany();

    const [postModelOutput] = postsModelOutput(posts)

    return postModelOutput
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
  }

  async getPostsPaging(
    query: PostQuery,
    blogId: string | null,
    userId?: string | null,
  ): Promise<PostsPaging> {
    userId = userId ?? null;
    blogId = blogId ?? null;

    // const subQueryNewestLikes = (
    //   subQuery: SelectQueryBuilder<StatusesPostsTable>,
    // ) =>
    //   subQuery
    //     .select(['st."postId"', 'st."userId"', 'st."addedAt"'])
    //     .from(StatusesPostsTable, 'st')
    //     .addSelect(
    //       'ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "addedAt" DESC) AS "rowNumber"',
    //     )
    //     .addSelect('"user"."login"')
    //     .leftJoin(usersWithLoginEntity, 'user', 'st."userId" = "user"."id"')
    //     .where('st."userStatus" = :like', { like: 'Like' });
    //
    // const usersWithLoginEntity = (
    //   subQuery: SelectQueryBuilder<StatusesPostsTable>,
    // ) =>
    //   subQuery
    //     .select(['u."id"'])
    //     .addSelect('acd."login" AS "login"')
    //     .from(UsersTable, 'u')
    //     .leftJoin('u.accountData', 'acd');

    const postsSelected = this.repository
        .createQueryBuilder('p')
        .select(['p.*'])
        .where('p."blogId" = :blogId OR :blogId IS NULL', { blogId })

    const postsSelectedAndPaging = postsSelected
        .addSelect(this.getSubQueryCountLikesPost, 'likesCount')
        .addSelect(this.getSubQueryCountDislikesPost, 'dislikesCount')
        .leftJoin(BlogsTable, 'b', 'p."blogId" = b."id"')
        .addSelect('b.name', 'blogName')
        .leftJoin(
            StatusesPostsTable,
            's',
            's."postId" = p."id" AND s."userId" = :userId',
            {userId},
        )
        .addSelect('s."userStatus"', 'myStatus')
        .orderBy(`"${query.sortBy}"`, query.sortDirection)
        .offset((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)

  const postsPaging = await this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(postsSelectedAndPaging, 'psp')
      .from('psp', 'p')
      .select(['p.*'])
      .leftJoin(
          this.getSubQueryNewestLikes(),
          'nl',
          'nl."postId" = p."id" AND nl."rowNumber" <= 3')
      .addSelect('nl."login"', 'login')
      .addSelect('nl."userId"', 'userId')
      .addSelect('nl."addedAt"', 'addedAt')
      .orderBy(`p."${query.sortBy}"`, query.sortDirection)
      .getRawMany();

    const totalPosts = await postsSelected.getCount();

    return postsPagingModelOutput(query, totalPosts, postsPaging);
  }
}
