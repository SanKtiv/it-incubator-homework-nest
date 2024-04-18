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
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import {
  blogPagingViewModel,
  blogsViewDto,
  BlogsViewDto,
} from './models/output/blogs.view.dto';
import { paramIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import {PostQuery} from "../../posts/api/models/input/posts.input.dto";
import {PostsQueryRepository} from "../../posts/infrastructure/posts.query.repository";
import {postsPaging} from "../../posts/api/models/output/posts.output.dto";

@Controller('blogs')
@UsePipes(new ValidationPipe({ transform: true, disableErrorMessages: true }))
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepository
  ) {}

  @Get()
  async getBlogsPaging(@Query() query: BlogQuery) {
    const totalBlogs = await this.blogsQueryRepository.getTotalBlogsByName(
      query.searchNameTerm,
    );

    const blogsPaging =
      await this.blogsQueryRepository.getBlogsWithPaging(query);

    return blogPagingViewModel(query, totalBlogs as number, blogsPaging);
  }

  @Get(':blogId')
  @UsePipes(paramIdPipe)
  async getBlogById(@Param('blogId') id: string) {
    const blog = await this.blogsQueryRepository.findById(id);

    return blogsViewDto(blog!);
  }

  @Post()
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    const blogModel = await this.blogsService.createBlog(dto);

    return blogsViewDto(blogModel);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(@Param('blogId', paramIdPipe) blogId: string, @Query() query: PostQuery) {
    const totalPosts = await this.postsQueryRepository.countDocuments(blogId)
    const postDocuments = await this.postsQueryRepository.findPaging(query, blogId)
    return postsPaging(query, totalPosts, postDocuments)
  }

  @Put(':blogId')
  async updateBlogById(
    @Param('blogId', paramIdPipe) id: string,
    @Body() inputUpdate: BlogsInputDto,
  ) {
    const blog = await this.blogsQueryRepository.findById(id);

    await this.blogsService.updateBlog(blog!, inputUpdate);
  }

  @Delete(':blogId')
  @UsePipes(paramIdPipe)
  async deleteBlogById(@Param('blogId') id: string): Promise<void> {
    await this.blogsService.deleteBlog(id);
  }
}
