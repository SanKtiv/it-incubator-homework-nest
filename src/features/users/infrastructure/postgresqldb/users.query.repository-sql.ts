import { Injectable } from '@nestjs/common';
import { UsersQuery } from '../../api/models/input/users.query.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { usersPagingDto } from '../../api/models/output/users.output.dto';

@Injectable()
export class UsersQueryRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findPaging(query: UsersQuery) {
    const searchLoginTerm = query.searchLoginTerm ? query.searchLoginTerm : '';
    const searchEmailTerm = query.searchEmailTerm ? query.searchEmailTerm : '';
    const pageOffSet = (query.pageNumber - 1) * query.pageSize;

    const findPagingUsersQuery = `
    SELECT u."id", "login", "email", "createdAt" 
    FROM "users" AS u
    LEFT JOIN "accountData" AS a ON a."id" = u."accountDataId"
    WHERE "login" ~* $1 OR "email" ~* $2
    ORDER BY "${query.sortBy}" ${query.sortDirection}
    LIMIT $3
    OFFSET $4`;

    const pagingParameters = [
      searchLoginTerm,
      searchEmailTerm,
      query.pageSize,
      pageOffSet,
    ];

    const usersCountQuery = `
    SELECT COUNT(*) FROM "accountData" WHERE "login" ~* $1 OR "email" ~* $2`;

    const usersCountParameters = [searchLoginTerm, searchEmailTerm];

    const usersPaging = await this.dataSource.query(
      findPagingUsersQuery,
      pagingParameters,
    );

    const [usersCount] = await this.dataSource.query(
      usersCountQuery,
      usersCountParameters,
    );

    return usersPagingDto(usersCount.count, query, usersPaging);
  }
}
