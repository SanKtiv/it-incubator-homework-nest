import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogQuery, BlogsInputDto } from './models/input/blogs.input.dto';
import { BlogsService } from '../application/blogs.service';
import { BlogsHandler } from './blogs.hendler';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import {
  BlogsViewDto,
} from './models/output/blogs.view.dto';
import { paramBlogIdPipe } from '../../../infrastructure/pipes/validation.pipe';

@Controller('blogs')
@UsePipes(new ValidationPipe({ transform: true, disableErrorMessages: true }))
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsService: BlogsService,
    private readonly blogsHandler: BlogsHandler,
  ) {}

  @Get()
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
  }

  @Get(':id')
  @UsePipes(paramBlogIdPipe)
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.findById(id);
    return this.blogsHandler.blogViewDto(blog!);
  }

  @Post()
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    const blogModel = await this.blogsService.createBlog(dto);
    return this.blogsHandler.blogViewDto(blogModel);
  }

  @Put(':id')
  async updateBlogById(
    @Param('id', paramBlogIdPipe) id: string,
    @Body() inputUpdate: BlogsInputDto,
  ) {
    const blog = await this.blogsQueryRepository.findById(id);
    await this.blogsService.updateBlog(blog!, inputUpdate);
  }

  @Delete(':id')
  @UsePipes(paramBlogIdPipe)
  async deleteBlogById(@Param('id') id: string): Promise<void> {
    await this.blogsService.deleteBlog(id);
  }
}
