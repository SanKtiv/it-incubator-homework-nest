import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsRepositoryMongo } from '../features/blogs/infrastructure/mongodb/blogs.repository-mongo';
import { UsersRepositoryMongo } from '../features/users/infrastructure/mongodb/users.repository-mongo';
import { PostsRepositoryMongo } from '../features/posts/infrastructure/mongodb/posts.repository-mongo';
import { CommentsRepositoryMongo } from '../features/comments/infrastructure/mongodb/comments.repository-mongo';
import { RequestApiRepository } from '../features/requests/infrastructure/mongodb/request.repository-mongo';
import { DevicesRepositoryMongo } from '../features/security/infrastructure/mongodb/devices.repository-mongo';
import { UsersRepositorySql } from '../features/users/infrastructure/postgresqldb/users.repository-sql';
import { RequestApiSqlRepository } from '../features/requests/infrastructure/postgresqldb/request.repository-sql';
import { DevicesRepositorySql } from '../features/security/infrastructure/postgresqldb/devices.repository-sql';
import { BlogsRepositorySql } from '../features/blogs/infrastructure/postgresdb/blogs.repository-sql';
import { PostsRepositorySql } from '../features/posts/infrastructure/postgresql/posts.repository-sql';
import { CommentsRepositorySql } from '../features/comments/infrastructure/postgresql/comments.repository-sql';
import { StatusesRepositorySql } from '../features/statuses/infrastructure/statuses.repository-sql';

@Controller('testing/all-data')
export class TestingController {
  constructor(
    private readonly blogsRepository: BlogsRepositoryMongo,
    private readonly blogsSqlRepository: BlogsRepositorySql,
    private readonly usersRepository: UsersRepositoryMongo,
    private readonly usersRepositorySql: UsersRepositorySql,
    private readonly postsRepository: PostsRepositoryMongo,
    private readonly postsSqlRepository: PostsRepositorySql,
    private readonly commentsRepository: CommentsRepositoryMongo,
    private readonly commentsSqlRepository: CommentsRepositorySql,
    private readonly requestApiRepository: RequestApiRepository,
    private readonly requestApiSqlRepository: RequestApiSqlRepository,
    private readonly devicesRepository: DevicesRepositoryMongo,
    private readonly devicesSqlRepository: DevicesRepositorySql,
    private readonly statusesSqlRepository: StatusesRepositorySql,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.blogsSqlRepository.deleteAll_RAW();
    await this.usersRepositorySql.deleteAll_RAW();
    await this.postsSqlRepository.deleteAll_RAW();
    await this.commentsSqlRepository.deleteAll_RAW();
    await this.requestApiSqlRepository.deleteAll_RAW();
    await this.devicesSqlRepository.deleteAll_RAW();
    await this.statusesSqlRepository.deleteAll_RAW();
  }
}
