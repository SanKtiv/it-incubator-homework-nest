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
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Blog, BlogDocument, BlogSchema } from '../domain/blogs.schema';
import { BlogQuery, BlogsInputDto } from './models/input/blogs.input.dto';
import { BlogsService } from '../application/blogs.service';
import { BlogsHandler } from './blogs.hendler';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { Model } from 'mongoose';
import { BlogsViewDto, BlogsViewPagingDto } from './models/output/blogs.view.dto';
import { constants } from 'http2';
import {waitForDebugger} from "inspector";

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsService: BlogsService,
    private readonly blogsHandler: BlogsHandler,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBlogsPaging(@Query() query: BlogQuery) {
    const totalBlogs = await this.blogsQueryRepository.getTotalBlogsByName(
      query.searchNameTerm,
    );

    const blogsPaging =
      await this.blogsQueryRepository.getBlogsWithPaging(query);

    return this.blogsHandler.blogPagingViewModel(
      totalBlogs as number,
      blogsPaging,
      query,
    );
    //res.status(constants.HTTP_STATUS_OK).send(blogsPagingView)
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
  async updateBlogById(@Param('id') id: string, @Body() inputUpdate: BlogsInputDto) {
    const blog = await this.blogsQueryRepository.findById(id);
    if (!blog) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    await this.blogsService.updateBlog(blog, inputUpdate);
  }

  @Delete(':id')
  async deleteBlogById(@Param('id') id: string): Promise<void> {
    const resultDeleting = await this.blogsService.deleteBlog(id)
    if (!resultDeleting) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
