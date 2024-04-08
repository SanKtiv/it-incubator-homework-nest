import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { Blog } from './blogs.schema';

@Controller()
export class BlogsController {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  @Get('blogs')
  async getAllBlogs() {
    return this.blogsRepository.findAll();
  }

  @Get('blogs/:id')
  async getBlogById(@Param('id') id: string) {
    return this.blogsRepository.findById(id);
  }

  @Post('blogs')
  async createBlog(@Body() inputBody): Promise<Blog> {
    return this.blogsRepository.create(inputBody);
  }

  @Put('blogs/:id')
  async updateBlogById(@Param('id') id: string, @Body() inputUpdate: any) {
    await this.blogsRepository.updateById(id, inputUpdate);
  }

  @Delete('blogs/:id')
  async deleteBlogById(@Param('id') id: string): Promise<void> {
    await this.blogsRepository.deleteById(id);
  }
}
