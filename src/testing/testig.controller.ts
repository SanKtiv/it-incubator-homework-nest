import { Controller, Delete } from '@nestjs/common';
import { BlogsRepository } from '../features/blogs/infrastructure/blogs.repository';
import { UsersRepository } from '../features/users/infrastructure/users.repository';
import { PostsRepository } from '../features/posts/infrastructure/posts.repository';
import {CommentsRepository} from "../features/comments/infrastructure/comments.repository";

@Controller('testing/all-data')
export class TestingController {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository
  ) {}

  @Delete()
  async deleteAllData(): Promise<void> {
    await this.blogsRepository.deleteAll();
    await this.usersRepository.removeAll();
    await this.postsRepository.deleteAll();
    await this.commentsRepository.deleteAll();
  }
}
