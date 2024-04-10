import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put, Query,
} from '@nestjs/common';
import { BlogsRepository } from './blogs.repositories/blogs.repository';
import { Blog, BlogDocument, BlogSchema } from './blogs.schema';
import { BlogsInputDto } from './blogs.dto/blogs.input.dto';
import { BlogsService } from './blogs.service';
import { BlogsHandler } from './blogs.hendler';
import { BlogsQueryRepository } from './blogs.repositories/blogs.query.repository';
import { Model } from 'mongoose';
import { BlogsViewDto } from './blogs.dto/blogs.view.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsService: BlogsService,
    private readonly blogsHandler: BlogsHandler,
  ) {}

  @Get()
  async getBlogsPaging(@Query()) {
    return this.blogsQueryRepository.findAll();
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.findById(id);
    if (blog) return this.blogsHandler.blogViewDto(blog);
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  @Post()
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    const blogModel = await this.blogsService.createBlog(dto);
    return this.blogsHandler.blogViewDto(blogModel);
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
