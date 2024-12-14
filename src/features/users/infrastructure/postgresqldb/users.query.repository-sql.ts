import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UsersModelType } from '../../domain/users.schema';
import { Types } from 'mongoose';
import { UsersQuery } from '../../api/models/input/users.query.dto';
import {
  filterByLoginAndEmail,
  loginAndEmailToRegExp,
} from '../utils.repositories';
import {
  infoCurrentUserDto,
  InfoCurrentUserDto,
} from '../../../auth/api/models/output/info-current-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { Brackets, DataSource } from 'typeorm';
import { UsersTable } from '../../domain/users.table';
import {
  UsersPagingDto,
  usersPagingDto,
} from '../../api/models/output/users.output.dto';

@Injectable()
export class UsersQueryRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  // async findById(id: string): Promise<UserDocument | null> {
  //     return this.UserModel.findById(id);
  // }
  //
  async infoCurrentUser(id: string): Promise<InfoCurrentUserDto> {
    const userDocument = await this.dataSource
      .getRepository(UsersTable)
      .findOneBy({ id: id });
    return infoCurrentUserDto(userDocument!);
  }
  //
  // async loginIsExist(login: string): Promise<number> {
  //     return this.UserModel.countDocuments({ 'accountData.login': login });
  // }
  //
  // async emailIsExist(email: string): Promise<number> {
  //     return this.UserModel.countDocuments({ 'accountData.email': email });
  // }
  //
  // async findUserByLoginOrEmail(
  //     loginOrEmail: string,
  // ): Promise<UserDocument | null> {
  //     const filter = filterByLoginAndEmail(loginOrEmail, loginOrEmail);
  //     return this.UserModel.findOne(filter);
  // }
  //
  async countDocument(query: UsersQuery): Promise<number> {
    const term = loginAndEmailToRegExp(
      query.searchLoginTerm,
      query.searchEmailTerm,
    );

    const filter = filterByLoginAndEmail(term.login, term.email);

    return this.dataSource.getRepository(UsersTable).count(filter);
  }

  async findPaging(query: UsersQuery): Promise<UsersPagingDto> {
    const loginTerm = query.searchLoginTerm;
    const emailTerm = query.searchEmailTerm;

    const users = this.dataSource
      .getRepository(UsersTable)
      .createQueryBuilder('user');

    if (loginTerm || emailTerm) {
      const filter = 'user.login ~* :login OR user.email ~* :email';
      const paramFilter = { login: loginTerm, email: emailTerm };

      users.where(filter, paramFilter);
    }

    const totalUsers = await users.getCount();

    const usersPaging = await users
      .orderBy(`user.${query.sortBy}`, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    return usersPagingDto(totalUsers, query, usersPaging);
  }

  async findPaging_RAW(query: UsersQuery) {
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
    OFFSET $4`

    const pagingParameters = [searchLoginTerm, searchEmailTerm, query.pageSize, pageOffSet]

    const usersCountQuery = `
    SELECT COUNT(*) FROM "accountData" WHERE "login" ~* $1 OR "email" ~* $2`

    const usersCountParameters = [searchLoginTerm, searchEmailTerm]

    const usersPaging = await this.dataSource
        .query(findPagingUsersQuery, pagingParameters)

    const [usersCount] = await this.dataSource
        .query(usersCountQuery, usersCountParameters)

    return usersPagingDto(usersCount.count, query, usersPaging)
  }
}
