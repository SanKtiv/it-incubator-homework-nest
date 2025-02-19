import { Injectable } from '@nestjs/common';
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

  async findById(
    id: string,
    userId?: string | null,
  ): Promise<PostsOutputDto | null> {
    userId = userId ?? null

    const posts = await this.repository
        .createQueryBuilder('p')
        .select('p.*')
        .where('p.id = :id', {id})
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
        .leftJoin(
            this.getSubQueryNewestLikes(),
            'nl',
            'nl."postId" = p."id" AND nl."rowNumber" <= 3')
        .addSelect('nl."login"', 'login')
        .addSelect('nl."userId"', 'userId')
        .addSelect('nl."addedAt"', 'addedAt')
        .getRawMany();

    const [postModelOutput] = postsModelOutput(posts)

    return postModelOutput
  }

  async getPostsPaging(
    query: PostQuery,
    blogId: string,
    userId?: string,
  ): Promise<PostsPaging> {
    const uId = userId ?? null;
    const bId = blogId ?? null;

    const postsSelected = this.repository
        .createQueryBuilder('p')
        .select(['p.*'])
        .where('p."blogId" = :bId OR :blogId IS NULL', { bId })

    const postsSelectedAndPaging = postsSelected
        .addSelect(this.getSubQueryCountLikesPost, 'likesCount')
        .addSelect(this.getSubQueryCountDislikesPost, 'dislikesCount')
        .leftJoin(BlogsTable, 'b', 'p."blogId" = b."id"')
        .addSelect('b.name', 'blogName')
        .leftJoin(
            StatusesPostsTable,
            's',
            's."postId" = p."id" AND s."userId" = :uId',
            {uId},
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
}
