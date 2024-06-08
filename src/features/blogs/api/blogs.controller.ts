import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogQuery, BlogsInputDto } from './models/input/blogs.input.dto';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import {
  blogsViewDto,
  BlogsViewDto,
  BlogsViewPagingDto,
} from './models/output/blogs.view.dto';
import {
  paramIdIsMongoIdPipe,
  paramIdPipe,
} from '../../../infrastructure/pipes/validation.pipe';
import { PostQuery } from '../../posts/api/models/input/posts.input.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import {
  postsOutputDto,
  PostsPaging,
  postsPaging,
} from '../../posts/api/models/output/posts.output.dto';
import { PostsService } from '../../posts/application/posts.service';
import { InputDto } from '../../../infrastructure/models/input.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';

@Controller('blogs')
@UsePipes(new ValidationPipe({ transform: true, disableErrorMessages: true }))
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    const blogModel = await this.blogsService.createBlog(dto);
    return blogsViewDto(blogModel);
  }

  @Post(':blogId/posts')
  @UseGuards(BasicAuthGuard)
  async createPostForBlog(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
    @Body() inputDto: InputDto,
  ) {
    await this.blogsService.existBlog(id);
    const blogDocument = await this.blogsQueryRepository.findById(id);
    const postDocument = await this.postsService.createPost(
      { ...inputDto, blogId: id },
      blogDocument!.name,
    );
    return postsOutputDto(postDocument);
  }

  @Get()
  async getBlogsPaging(@Query() query: BlogQuery): Promise<BlogsViewPagingDto> {
    return this.blogsQueryRepository.getBlogsWithPaging(query);
  }

  @Get(':blogId')
  async getBlogById(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
  ): Promise<BlogsViewDto | HttpException> {
    return this.blogsQueryRepository.findById(id);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', paramIdIsMongoIdPipe) blogId: string,
    @Query() query: PostQuery,
  ): Promise<PostsPaging> {
    await this.blogsQueryRepository.findById(blogId);
    return this.postsQueryRepository.findPaging(
      query,
      blogId,
    );
  }

  @Put(':blogId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updateBlogById(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
    @Body() inputUpdate: BlogsInputDto,
  ): Promise<void> {
    await this.blogsService.updateBlog(id, inputUpdate);
  }

  @Delete(':blogId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteBlogById(@Param('blogId', paramIdIsMongoIdPipe) id: string): Promise<void> {
    await this.blogsService.deleteBlog(id);
  }
}
