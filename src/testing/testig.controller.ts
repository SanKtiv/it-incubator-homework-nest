import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsRepository } from '../features/blogs/infrastructure/blogs.repository';
import { UsersRepository } from '../features/users/infrastructure/users.repository';
import { PostsRepository } from '../features/posts/infrastructure/posts.repository';
import { CommentsRepository } from '../features/comments/infrastructure/comments.repository';
import {RequestApiRepository} from "../features/requests/infrastructure/request.repository";
import {DevicesRepository} from "../features/security/infrastructure/devices.repository";

@Controller('testing/all-data')
export class TestingController {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly requestApiRepository: RequestApiRepository,
    private readonly devicesRepository: DevicesRepository
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.blogsRepository.deleteAll();
    await this.usersRepository.removeAll();
    await this.postsRepository.deleteAll();
    await this.commentsRepository.deleteAll();
    await this.requestApiRepository.removeAll();
    await this.devicesRepository.removeAll()
  }
}
