import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogQuery, BlogsInputDto } from './models/input/blogs.input.dto';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepositoryMongo } from '../infrastructure/mongodb/blogs.query.repository-mongo';
import {
  BlogsViewDto,
  BlogsViewPagingDto,
} from './models/output/blogs.view.dto';
import { paramIdIsUUIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import {
  PostQuery,
  PostsInputDto,
} from '../../posts/api/models/input/posts.input.dto';
import { PostsQueryRepositoryMongo } from '../../posts/infrastructure/mongodb/posts.query.repository-mongo';
import { PostsPaging } from '../../posts/api/models/output/posts.output.dto';
import { PostsService } from '../../posts/application/posts.service';
import { InputDto } from '../../../infrastructure/models/input.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { Request } from 'express';
import { BlogsQueryRepositorySql } from '../infrastructure/postgresdb/blogs.query.repository-sql';
import { PostsQueryRepositorySql } from '../../posts/infrastructure/postgresql/posts.query.repository-sql';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class SaBlogsController {
  constructor(
    private readonly blogsQueryRepositorySql: BlogsQueryRepositorySql,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepositorySql: PostsQueryRepositorySql,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    return this.blogsService.createBlog(dto);
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
    @Body() dto: InputDto,
  ) {
    const postsInputDto: PostsInputDto = {
      ...dto,
      blogId: id,
    };

    return this.postsService.createPost(postsInputDto);
  }

  @Get()
  async getBlogsPaging(@Query() query: BlogQuery): Promise<BlogsViewPagingDto> {
    return this.blogsQueryRepositorySql.getBlogsPaging_RAW(query);
  }

  @Get(':blogId')
  async getBlogById(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
  ): Promise<BlogsViewDto> {
    const blog = await this.blogsQueryRepositorySql.findById_RAW(id);

    if (!blog) throw new NotFoundException();

    return blog;
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', paramIdIsUUIdPipe) blogId: string,
    @Query() query: PostQuery,
    @Req() req: Request,
  ): Promise<PostsPaging> {
    const blog = await this.blogsQueryRepositorySql.findById_RAW(blogId);

    if (!blog) throw new NotFoundException();

    return this.postsQueryRepositorySql.findPaging_RAW(query, blogId, null);
  }

  @Put(':blogId')
  @HttpCode(204)
  async updateBlogById(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
    @Body() inputUpdate: BlogsInputDto,
  ): Promise<void> {
    await this.blogsService.updateBlog(id, inputUpdate);
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePostIdForBlog(
    @Param('blogId', paramIdIsUUIdPipe) blogId: string,
    @Param('postId', paramIdIsUUIdPipe) postId: string,
    @Body() inputUpdate: InputDto,
  ): Promise<void> {
    await this.postsService.updatePostForBlog(postId, blogId, inputUpdate);
  }

  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlogById(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
  ): Promise<void> {
    await this.blogsService.deleteBlogById(id);
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePostByIdForBlog(
    @Param('blogId', paramIdIsUUIdPipe) blogId: string,
    @Param('postId', paramIdIsUUIdPipe) postId: string,
  ): Promise<void> {
    await this.postsService.deletePostByIdForBlog(postId, blogId);
  }
}
