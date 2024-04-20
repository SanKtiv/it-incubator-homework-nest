import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import {
  blogPagingViewModel,
  blogsViewDto,
  BlogsViewDto,
  BlogsViewPagingDto,
} from './models/output/blogs.view.dto';
import { paramIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import {
  PostQuery,
} from '../../posts/api/models/input/posts.input.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import {
  postsOutputDto,
  PostsPaging,
  postsPaging,
} from '../../posts/api/models/output/posts.output.dto';
import { PostsService } from '../../posts/application/posts.service';
import { InputDto } from '../../../infrastructure/models/input.dto';

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
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    const blogModel = await this.blogsService.createBlog(dto);
    return blogsViewDto(blogModel);
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId', paramIdPipe) id: string,
    @Body() inputDto: InputDto,
  ) {
    const blogDocument = await this.blogsQueryRepository.findById(id);
    const postDocument = await this.postsService.createPost(
      { ...inputDto, blogId: id },
      blogDocument!.name,
    );
    return postsOutputDto(postDocument);
  }

  @Get()
  async getBlogsPaging(@Query() query: BlogQuery): Promise<BlogsViewPagingDto> {
    const totalBlogs = await this.blogsQueryRepository.getTotalBlogsByName(
      query.searchNameTerm,
    );

    const blogsPaging =
      await this.blogsQueryRepository.getBlogsWithPaging(query);

    return blogPagingViewModel(query, totalBlogs as number, blogsPaging);
  }

  @Get(':blogId')
  @UsePipes(paramIdPipe)
  async getBlogById(@Param('blogId') id: string): Promise<BlogsViewDto> {
    const blog = await this.blogsQueryRepository.findById(id);
    return blogsViewDto(blog!);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', paramIdPipe) blogId: string,
    @Query() query: PostQuery,
  ): Promise<PostsPaging> {
    const totalPosts = await this.postsQueryRepository.countDocuments(blogId);
    const postDocuments = await this.postsQueryRepository.findPaging(
      query,
      blogId,
    );
    return postsPaging(query, totalPosts, postDocuments);
  }

  @Put(':blogId')
  @HttpCode(204)
  async updateBlogById(
    @Param('blogId', paramIdPipe) id: string,
    @Body() inputUpdate: BlogsInputDto,
  ): Promise<void> {
    const blog = await this.blogsQueryRepository.findById(id);
    await this.blogsService.updateBlog(blog!, inputUpdate);
  }

  @Delete(':blogId')
  @HttpCode(204)
  @UsePipes(paramIdPipe)
  async deleteBlogById(@Param('blogId') id: string): Promise<void> {
    await this.blogsService.deleteBlog(id);
  }
}
