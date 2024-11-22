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
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';
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
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { PostsQueryRepositorySql } from '../../posts/infrastructure/postgresql/posts.query.repository-sql';
import { CommentsSqlRepository } from '../../comments/infrastructure/postgresql/comments.repository-sql';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class SaBlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepositoryMongo,
    private readonly blogsSqlQueryRepository: BlogsQueryRepositorySql,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepositoryMongo,
    private readonly postsSqlQueryRepository: PostsQueryRepositorySql,
    private readonly postsService: PostsService,
    private readonly accessJwtToken: AccessJwtToken,
    private readonly usersSqlRepository: RequestApiSqlRepository,
    private readonly commentsSqlRepository: CommentsSqlRepository,
  ) {}

  // @Get('/blogs')
  // async createBlogInSql() {
  //
  //   await this.commentsSqlRepository
  //       .updateById('0208b79e-85ba-465c-b9c7-f776abeff611', 'Hello')
  // }

  @Post()
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    return this.blogsService.createBlog(dto, false);
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
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
    return this.blogsSqlQueryRepository.getBlogsPaging(query);
  }

  @Get(':blogId')
  async getBlogById(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
  ): Promise<BlogsViewDto> {
    return this.blogsSqlQueryRepository.findById_RAW(id);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', paramIdIsMongoIdPipe) blogId: string,
    @Query() query: PostQuery,
    @Req() req: Request,
  ): Promise<PostsPaging> {
    await this.blogsSqlQueryRepository.findById_RAW(blogId);

    return this.postsSqlQueryRepository.findPaging(query, blogId, null);
  }

  @Put(':blogId')
  @HttpCode(204)
  async updateBlogById(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
    @Body() inputUpdate: BlogsInputDto,
  ): Promise<void> {
    await this.blogsService.updateBlog(id, inputUpdate);
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePostIdForBlog(
    @Param('blogId', paramIdIsMongoIdPipe) blogId: string,
    @Param('postId', paramIdIsMongoIdPipe) postId: string,
    @Body() inputUpdate: InputDto,
  ): Promise<void> {
    await this.postsService.updatePostForBlog(postId, blogId, inputUpdate);
  }

  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlogById(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
  ): Promise<void> {
    await this.blogsService.deleteBlogById(id);
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePostByIdForBlog(
    @Param('blogId', paramIdIsMongoIdPipe) blogId: string,
    @Param('postId', paramIdIsMongoIdPipe) postId: string,
  ): Promise<void> {
    await this.postsService.deletePostByIdForBlog(postId, blogId);
  }
}
