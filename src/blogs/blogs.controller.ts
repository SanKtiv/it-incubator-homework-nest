import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogsRepository } from './blogs.repositories/blogs.repository';
import {Blog, BlogDocument} from './blogs.schema';
import { BlogsInputDto } from './blogs.dto/blogs.input.dto';
import { BlogsService } from './blogs.service';
import { BlogsHandler } from './blogs.hendler';
import { BlogsQueryRepository } from './blogs.repositories/blogs.query.repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsService: BlogsService,
    private readonly blogsHandler: BlogsHandler,
  ) {}

  @Get()
  async getAllBlogs() {
    return this.blogsQueryRepository.findAll();
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.findById(id);
    if (blog) return this.blogsHandler.blogViewDto(blog)
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  @Post()
  async createBlog(@Body() dto: BlogsInputDto): Promise<Blog> {
    const blog = await this.blogsService.createBlog(dto);
    return this.blogsHandler.blogViewDto(blog);
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
