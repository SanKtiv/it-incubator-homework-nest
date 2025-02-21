import { Injectable } from '@nestjs/common';
import { UsersQueryRepositoryTypeOrm } from './postgresqldb/users.query.repository-typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(protected usersQueryRepository: UsersQueryRepositoryTypeOrm) {}
  async getInfoCurrentUser(id: string) {
    return this.usersQueryRepository.infoCurrentUser(id);
  }
}
