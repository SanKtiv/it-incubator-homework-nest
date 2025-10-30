import { Injectable } from '@nestjs/common';
import { UsersQueryRepositoryTypeOrm } from './postgresqldb/users.query.repository-typeorm';
import { UsersQuery } from '../api/models/input/users.query.dto';
import { UsersPagingDto } from '../api/models/output/users.output.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(protected usersQueryRepository: UsersQueryRepositoryTypeOrm) {}

  async getInfoCurrentUser(id: string) {
    return this.usersQueryRepository.infoCurrentUser(id);
  }

  async getUsersPaging(query: UsersQuery): Promise<UsersPagingDto> {
    return this.usersQueryRepository.usersPaging(query);
  }

  async getCountUsersWithPlayers() {
    return this.usersQueryRepository.usersWithPlayers()
  }
}
