import { Controller, Delete, HttpCode } from '@nestjs/common';
import { RequestApiRepositoryTypeOrm } from '../features/requests/infrastructure/postgresqldb/request.repository-tepeorm';
import { CommentsRepositorySql } from '../features/comments/infrastructure/postgresql/comments.repository-sql';
import { StatusesRepositorySql } from '../features/statuses/infrastructure/postgresql/statuses.repository-sql';
import { DevicesRepository } from '../features/security/infrastructure/devices.repository';
import { BlogsRepository } from '../features/blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../features/posts/infrastructure/posts.repository';
import { UsersRepository } from '../features/users/infrastructure/users.repository';
import {CommentsRepository} from "../features/comments/infrastructure/comments.repository";

@Controller('testing/all-data')
export class TestingController {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly requestApiRepository: RequestApiRepositoryTypeOrm,
    private readonly devicesRepository: DevicesRepository,
    private readonly statusesRepository: StatusesRepositorySql,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.blogsRepository.clear();
    await this.usersRepository.deleteAll();
    await this.postsRepository.clear();
    await this.commentsRepository.clear();
    await this.requestApiRepository.deleteAll_RAW();
    await this.devicesRepository.deleteAll();
    await this.statusesRepository.deleteAll_RAW();
  }
}
