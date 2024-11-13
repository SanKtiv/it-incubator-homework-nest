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
import { CommentsSqlRepository } from '../features/comments/infrastructure/postgresql/comments.repository-sql';
import { StatusesRepositorySql } from '../features/statuses/infrastructure/statuses.repository-sql';

@Controller('testing/all-data')
export class TestingController {
  constructor(
    private readonly blogsRepository: BlogsRepositoryMongo,
    private readonly blogsSqlRepository: BlogsRepositorySql,
    private readonly usersRepository: UsersRepositoryMongo,
    private readonly usersSqlRepository: UsersRepositorySql,
    private readonly postsRepository: PostsRepositoryMongo,
    private readonly postsSqlRepository: PostsRepositorySql,
    private readonly commentsRepository: CommentsRepositoryMongo,
    private readonly commentsSqlRepository: CommentsSqlRepository,
    private readonly requestApiRepository: RequestApiRepository,
    private readonly requestApiSqlRepository: RequestApiSqlRepository,
    private readonly devicesRepository: DevicesRepositoryMongo,
    private readonly devicesSqlRepository: DevicesRepositorySql,
    private readonly statusesSqlRepository: StatusesRepositorySql,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.blogsSqlRepository.deleteAll_ORM();
    await this.usersSqlRepository.removeAll();
    await this.postsSqlRepository.deleteAll();
    await this.commentsSqlRepository.deleteAll();
    await this.requestApiSqlRepository.removeAll();
    await this.devicesSqlRepository.removeAll();
    await this.statusesSqlRepository.deleteAll();
  }
}
