import {
  Body,
  Controller,
  Delete,
  Get, HttpException, HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { Blog } from './blogs.schema';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  @Get()
  async getAllBlogs() {
    return this.blogsRepository.findAll();
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    // try {
    //   return this.blogsRepository.findById(id);
    // } catch (e) {
    //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // }
    const result = await this.blogsRepository.findById(id);
    if (typeof result === "Error") throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return result
  }

  @Post()
  async createBlog(@Body() inputBody): Promise<Blog> {
    return this.blogsRepository.create(inputBody);
  }

  @Put(':id')
  async updateBlogById(@Param('id') id: string, @Body() inputUpdate: any) {
    await this.blogsRepository.updateById(id, inputUpdate);
  }

  @Delete(':id')
  async deleteBlogById(@Param('id') id: string): Promise<void> {
    await this.blogsRepository.deleteById(id);
  }
}
