import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsRepository } from '../features/blogs/infrastructure/mongodb/blogs.repository';
import { UsersRepository } from '../features/users/infrastructure/mongodb/users.repository';
import { PostsRepository } from '../features/posts/infrastructure/mongodb/posts.repository';
import { CommentsRepository } from '../features/comments/infrastructure/comments.repository';
import { RequestApiRepository } from '../features/requests/infrastructure/request.repository';
import { DevicesRepository } from '../features/security/infrastructure/devices.repository';
import { UsersSqlRepository } from '../features/users/infrastructure/postgresqldb/users.sql.repository';
import { RequestApiSqlRepository } from '../features/requests/infrastructure/request.sql.repository';
import { DevicesSqlRepository } from '../features/security/infrastructure/devices.sql.repository';

@Controller('testing/all-data')
export class TestingController {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly usersSqlRepository: UsersSqlRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly requestApiRepository: RequestApiRepository,
    private readonly requestApiSqlRepository: RequestApiSqlRepository,
    private readonly devicesRepository: DevicesRepository,
    private readonly devicesSqlRepository: DevicesSqlRepository,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    //await this.blogsRepository.deleteAll();
    await this.usersSqlRepository.removeAll();
    //await this.postsRepository.deleteAll();
    //await this.commentsRepository.deleteAll();
    await this.requestApiSqlRepository.removeAll();
    await this.devicesSqlRepository.removeAll();
  }
}
