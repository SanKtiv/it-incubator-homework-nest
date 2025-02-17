import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostQuery } from '../../api/models/input/posts.input.dto';
import {
  postViewModel_SQL,
  PostsOutputDto,
  PostsPaging,
  postsPagingViewModel_SQL, postsModelOutput, postsPagingModelOutput,
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
        .orderBy(`p."${query.sortBy}"`, query.sortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .take(query.pageSize);


    const postsWithWhere = this.repository
        .createQueryBuilder('p')
        .select(['p.*'])
        // .addSelect('b.name', 'blogName')
        // .addSelect('s."userStatus"', 'myStatus')
        // .addSelect(subQueryCountLikesPost, 'likesCount')
        // .addSelect(subQueryCountDislikesPost, 'dislikesCount')
        .where('p."blogId" = :blogId OR :blogId IS NULL', { blogId })
        // .leftJoin(
        //     StatusesPostsTable,
        //     's',
        //     's."postId" = p."id" AND s."userId" = :userId',
        //     { userId },
        // )
        // .leftJoin('p.blogId', 'b')

    const postsModel = this.dataSource
        .createQueryBuilder()
        .addCommonTableExpression(postsWithWhere, 'pww')
        .from('pww', 'p')
        .select(['p.*'])
        // .addSelect('b.name', 'blogName')
        // .addSelect('s."userStatus"', 'myStatus')
        // .addSelect(subQueryCountLikesPost, 'likesCount')
        // .addSelect(subQueryCountDislikesPost, 'dislikesCount')
        //
        // .where('p."blogId" = :blogId OR :blogId IS NULL', {blogId})
        // .leftJoin(
        //     StatusesPostsTable,
        //     's',
        //     's."postId" = p."id" AND s."userId" = :userId',
        //     {userId},
        // )
        // .leftJoin('p.blogId', 'b')


    try {
      const postsModelPaging = await this.dataSource
          .createQueryBuilder()
          .addCommonTableExpression(postsModel, 'postsModel')
          .from('postsModel', 'pm')
          .select(['pm.*'])
          // .orderBy(`pmp."${query.sortBy}"`, query.sortDirection)
          // .skip((query.pageNumber - 1) * query.pageSize)
          // .take(query.pageSize)
          .getRawMany()

      console.log('s =', postsModelPaging.length)
    }
    catch (e) {
      console.log()
    }

      // const postsPagingCTE = await this.dataSource
      //     .createQueryBuilder()
      //     .addCommonTableExpression(posts, 'pg')
      //     .select(['pg.*'])
      //     .addSelect('nl."login"', 'login')
      //     .addSelect('nl."userId"', 'userId')
      //     .addSelect('nl."addedAt"', 'addedAt')
      //     .from(subQueryPostsPaging, 'pg')
      //     .leftJoin(
      //         subQueryNewestLikes,
      //         'nl',
      //         'nl."postId" = pg."id" AND nl."rowNumber" <= 3')
      //     .orderBy(`pg."${query.sortBy}"`, query.sortDirection)
      //     .getRawMany();


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
            'nl."postId" = pg."id" AND nl."rowNumber" <= 3')
        .orderBy(`pg."${query.sortBy}"`, query.sortDirection)
        .getRawMany();

    const totalPosts = await this.repository
        .createQueryBuilder('p')
        .where('p.blogId = :blogId OR :blogId IS NULL', {blogId})
        .getCount();

    // const s = await this.dataSource
    //     .createQueryBuilder()
    //     .select(['pg.*'])
    //     .from(subQueryPostsPaging, 'pg')
    //     .getRawMany();


    return postsPagingModelOutput(query, totalPosts, postsPaging);
  }
}
