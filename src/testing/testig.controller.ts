import { Controller, Delete } from '@nestjs/common';
import { BlogsRepository } from '../blogs/blogs.repository';

@Controller('testing/all-data')
export class TestingController {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  @Delete()
  async deleteAllData(): Promise<void> {
    await this.blogsRepository.deleteAll();
  }
}
