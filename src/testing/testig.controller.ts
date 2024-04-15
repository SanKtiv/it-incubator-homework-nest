import { Controller, Delete } from '@nestjs/common';
import { BlogsRepository } from '../features/blogs/infrastructure/blogs.repository';
import { UsersRepository } from '../features/users/infrastructure/users.repository';

@Controller('testing/all-data')
export class TestingController {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  @Delete()
  async deleteAllData(): Promise<void> {
    await this.blogsRepository.deleteAll();
    await this.usersRepository.removeAll();
  }
}
