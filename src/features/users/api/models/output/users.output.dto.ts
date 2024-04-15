import { UserDocument } from '../../../domain/users.schema';
import { UsersQuery } from '../input/users.query.dto';

export class UsersOutputDto {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
  ) {}
}

export const usersOutputDto = (userDocument: UserDocument): UsersOutputDto =>
  new UsersOutputDto(
    userDocument._id.toString(),
    userDocument.accountData.login,
    userDocument.accountData.email,
    userDocument.accountData.createdAt,
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

export const usersPagingDto = (
  totalUsers: number,
  query: UsersQuery,
  usersPaging: UserDocument[],
): UsersPagingDto =>
  new UsersPagingDto(
    Math.ceil(totalUsers / +query.pageSize),
    +query.pageNumber,
    +query.pageSize,
    totalUsers,
    usersPaging.map((user) => usersOutputDto(user)),
  );
