import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CommentsTable } from '../../domain/comments.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { QueryDto } from '../../../../infrastructure/models/query.dto';
import { UsersTable } from '../../../users/domain/users.table';
import { AccountDataTable } from '../../../users/domain/account-data.table';
import {
  StatusesCommentsTable,
  StatusesPostsTable,
} from '../../../statuses/domain/statuses.entity';

@Injectable()
export class CommentsQueryRepositoryTypeOrm {
  constructor(
    @InjectRepository(CommentsTable)
    protected repository: Repository<CommentsTable>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async findById() {}

  async paging(query: QueryDto, postId: string, userId: string) {
    const commentsSelected = this.repository
      .createQueryBuilder('c')
      .select(['c.*'])
      .where('c."postId" = :postId OR :postId IS NULL', { postId });

    const commentsSelectedAndPaging = commentsSelected
      .addSelect(this.getSubQueryCountLikesComment, 'likesCount')
      .addSelect(this.getSubQueryCountDislikesComment, 'dislikesCount')
      .leftJoin(UsersTable, 'u', 'u."id" = c."userId"')
      .leftJoin(AccountDataTable, 'adt', 'adt."id" = u."accountDataId"')
      .addSelect('adt."login"', 'userLogin')
      .leftJoin(
        StatusesCommentsTable,
        's',
        's."commentId" = c."id" AND s."userId" = :userId',
        { userId },
      )
      .addSelect('s."userStatus"', 'myStatus')
      .orderBy(`"${query.sortBy}"`, query.sortDirection)
      .offset((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);

    const commentsPaging = await this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(commentsSelectedAndPaging, 'cs')
      .from('cs', 'c')
      .select(['c.*'])
      .leftJoin(
        this.getSubQueryNewestLikes(),
        'nl',
        'nl."postId" = c."id" AND nl."rowNumber" <= 3',
      )
      .addSelect('nl."login"', 'login')
      .addSelect('nl."userId"', 'userId')
      .addSelect('nl."addedAt"', 'addedAt')
      .orderBy(`c."${query.sortBy}"`, query.sortDirection)
      .getRawMany();

    const totalComments = await commentsSelected.getCount();
  }

  private getSubQueryCountLikesComment = (
    subQuery: SelectQueryBuilder<StatusesCommentsTable>,
  ) =>
    subQuery
      .select('CAST (COUNT(*) AS INT)', 'likesCount')
      .from(StatusesCommentsTable, 'sc')
      .where('p.id = sc."commentId"')
      .andWhere('sc."userStatus" = :like', { like: 'Like' });

  private getSubQueryCountDislikesComment = (
    subQuery: SelectQueryBuilder<StatusesCommentsTable>,
  ) =>
    subQuery
      .select('CAST (COUNT(*) AS INT)')
      .from(StatusesCommentsTable, 'sc')
      .where('p.id = sc."commentId"')
      .andWhere('sc."userStatus" = :dislike', { dislike: 'Dislike' });

  private getSubQueryNewestLikes() {
    const usersWithLoginEntity = (subQuery: SelectQueryBuilder<UsersTable>) =>
      subQuery
        .select(['u."id"'])
        .addSelect('acd."login" AS "login"')
        .from(UsersTable, 'u')
        .leftJoin('u.accountData', 'acd');

    return (subQuery: SelectQueryBuilder<StatusesPostsTable>) =>
      subQuery
        .select(['st."postId"', 'st."userId"', 'st."addedAt"'])
        .from(StatusesCommentsTable, 'st')
        .addSelect(
          'ROW_NUMBER() OVER (PARTITION BY "commentId" ORDER BY "addedAt" DESC) AS "rowNumber"',
        )
        .addSelect('"user"."login"')
        .leftJoin(usersWithLoginEntity, 'user', 'st."userId" = "user"."id"')
        .where('st."userStatus" = :like', { like: 'Like' });
  }
}
