import { UserDocument } from '../../../domain/users.schema';
import { UsersQuery } from '../input/users.query.dto';
import { UsersTable } from '../../../domain/users.table';

export class UsersOutputDto {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
  ) {}
}

// export const usersOutputDto = (userDocument: UserDocument): UsersOutputDto =>
//   new UsersOutputDto(
//     userDocument._id.toString(),
//     userDocument.accountData.login,
//     userDocument.accountData.email,
//     userDocument.accountData.createdAt,
//   ); for mongo

export const usersOutputDto = (userDocument: UsersTable): UsersOutputDto =>
  new UsersOutputDto(
    userDocument.id,
    userDocument.login,
    userDocument.email,
    userDocument.createdAt,
  );

export class UsersPagingDto {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: UsersOutputDto[],
  ) {}
}

// export const usersPagingDto = (
//   totalUsers: number,
//   query: UsersQuery,
//   usersPaging: UserDocument[],
// ): UsersPagingDto =>
//   new UsersPagingDto(
//     Math.ceil(totalUsers / +query.pageSize),
//     +query.pageNumber,
//     +query.pageSize,
//     totalUsers,
//     usersPaging.map((user) => usersOutputDto(user)),
//   ); for mongo

export const usersPagingDto = (
  totalUsers: number,
  query: UsersQuery,
  usersPaging: UsersTable[],
): UsersPagingDto =>
  new UsersPagingDto(
    Math.ceil(totalUsers / +query.pageSize),
    +query.pageNumber,
    +query.pageSize,
    totalUsers,
    usersPaging.map((user) => usersOutputDto(user)),
  );
