import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsRepositoryMongo } from '../features/blogs/infrastructure/mongodb/blogs.repository-mongo';
import { UsersRepositoryMongo } from '../features/users/infrastructure/mongodb/users.repository-mongo';
import { PostsRepositoryMongo } from '../features/posts/infrastructure/mongodb/posts.repository-mongo';
import { CommentsRepositoryMongo } from '../features/comments/infrastructure/mongodb/comments.repository-mongo';
import { RequestApiRepositoryMongo } from '../features/requests/infrastructure/mongodb/request.repository-mongo';
import { DevicesRepositoryMongo } from '../features/security/infrastructure/mongodb/devices.repository-mongo';
import { UsersRepositoryRawsql } from '../features/users/infrastructure/postgresqldb/users.repository-rawsql';
import { RequestApiRepositoryTypeOrm } from '../features/requests/infrastructure/postgresqldb/request.repository-tepeorm';
import { DevicesRepositoryRawsql } from '../features/security/infrastructure/postgresqldb/devices.repository-rawsql';
import { BlogsRepositorySql } from '../features/blogs/infrastructure/postgresdb/blogs.repository-sql';
import { PostsRepositorySql } from '../features/posts/infrastructure/postgresql/posts.repository-sql';
import { CommentsRepositorySql } from '../features/comments/infrastructure/postgresql/comments.repository-sql';
import { StatusesRepositorySql } from '../features/statuses/infrastructure/statuses.repository-sql';
import {DevicesRepositoryTypeOrm} from "../features/security/infrastructure/postgresqldb/devices-repository-type-orm.service";

@Controller('testing/all-data')
export class TestingController {
  constructor(
    private readonly blogsRepository: BlogsRepositorySql,
    private readonly usersRepository: UsersRepositoryRawsql,
    private readonly postsRepository: PostsRepositorySql,
    private readonly commentsRepository: CommentsRepositorySql,
    private readonly requestApiRepository: RequestApiRepositoryTypeOrm,
    private readonly devicesRepository: DevicesRepositoryTypeOrm,
    private readonly statusesRepository: StatusesRepositorySql,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.blogsRepository.deleteAll_RAW();
    await this.usersRepository.deleteAll_RAW();
    await this.postsRepository.deleteAll_RAW();
    await this.commentsRepository.deleteAll_RAW();
    await this.requestApiRepository.deleteAll_RAW();
    await this.devicesRepository.deleteAll();
    await this.statusesRepository.deleteAll_RAW();
  }
}
