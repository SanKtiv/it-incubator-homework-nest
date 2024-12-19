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
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import { BlogsRepositorySql } from '../infrastructure/postgresdb/blogs.repository-sql';
import { UsersRepositorySql } from '../../users/infrastructure/postgresqldb/users.repository-sql';
import { DevicesRepositorySql } from '../../security/infrastructure/postgresqldb/devices.repository-sql';
import { RequestApiSqlRepository } from '../../requests/infrastructure/postgresqldb/request.repository-sql';
import { BlogsQueryRepositorySql } from '../infrastructure/postgresdb/blogs.query.repository-sql';
import { PostsQueryRepositorySql } from '../../posts/infrastructure/postgresql/posts.query.repository-sql';
import { StatusesRepositorySql } from '../../statuses/infrastructure/statuses.repository-sql';
import { CommentsRepositorySql } from '../../comments/infrastructure/postgresql/comments.repository-sql';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepositoryMongo,
    private readonly blogsQueryRepositorySql: BlogsQueryRepositorySql,
    private readonly blogsRepositorySql: BlogsRepositorySql,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepositoryMongo,
    private readonly postsQueryRepositorySql: PostsQueryRepositorySql,
    private readonly postsService: PostsService,
    private readonly accessJwtToken: AccessJwtToken,
    private readonly usersSqlRepository: UsersRepositorySql,
    private readonly statusesSqlRepository: StatusesRepositorySql,
    private readonly commentsSqlRepository: CommentsRepositorySql,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    return this.blogsService.createBlog(dto);
  }

  @Post(':blogId/posts')
  @UseGuards(BasicAuthGuard)
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
    return this.blogsQueryRepositorySql.findById_RAW(id);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', paramIdIsUUIdPipe) blogId: string,
    @Query() query: PostQuery,
    @Req() req: Request,
  ): Promise<PostsPaging> {
    await this.blogsQueryRepositorySql.findById_RAW(blogId);

    const userId = await this.accessJwtToken.getUserIdFromHeaders(
      req.headers.authorization,
    );

    return this.postsQueryRepositorySql.findPaging_RAW(query, blogId, userId);
  }

  @Put(':blogId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updateBlogById(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
    @Body() inputUpdate: BlogsInputDto,
  ): Promise<void> {
    await this.blogsService.updateBlog(id, inputUpdate);
  }

  @Delete(':blogId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteBlogById(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
  ): Promise<void> {
    await this.blogsService.deleteBlogById(id);
  }
}
