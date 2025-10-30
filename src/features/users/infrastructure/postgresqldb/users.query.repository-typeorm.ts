import { Injectable } from '@nestjs/common';
import { UsersQuery } from '../../api/models/input/users.query.dto';
import {
  infoCurrentUserDto,
  InfoCurrentUserDto,
} from '../../../auth/api/models/output/info-current-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersTable } from '../../domain/users.table';
import {
  UsersPagingDto,
  usersPagingDto,
} from '../../api/models/output/users.output.dto';

@Injectable()
export class UsersQueryRepositoryTypeOrm {
  constructor(@InjectRepository(UsersTable) protected repository: Repository<UsersTable>) {}

  async infoCurrentUser(id: string): Promise<InfoCurrentUserDto> {
    const user = await this.repository.findOneBy({ id: id });

    return infoCurrentUserDto(user!);
  }

  async usersPaging(query: UsersQuery): Promise<UsersPagingDto> {
    const loginTerm = query.searchLoginTerm;
    const emailTerm = query.searchEmailTerm;

    const users = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.accountData', 'accountData');

    if (loginTerm || emailTerm) {
      const conditions: string[] = [];
      const params = {};

      if (loginTerm) {
        conditions.push('accountData.login ~* :login');
        params['login'] = loginTerm;
      }

      if (emailTerm) {
        conditions.push('accountData.email ~* :email');
        params['email'] = emailTerm;
      }

      users.where(conditions.join(' OR '), params);
    }

    const totalUsers = await users.getCount();

    const usersPaging = await users
      .orderBy(`accountData.${query.sortBy}`, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    return usersPagingDto(totalUsers, query, usersPaging);
  }

  async usersWithPlayers() {
    return this.repository
        .createQueryBuilder('user')
        .leftJoin('user.players', 'players')
        .where('players.id IS NOT NULL')
        .getCount()
  }
}