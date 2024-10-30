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
import { BlogsQueryRepository } from '../infrastructure/mongodb/blogs.query.repository';
import {
  BlogsViewDto,
  BlogsViewPagingDto,
} from './models/output/blogs.view.dto';
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import {
  PostQuery,
  PostsInputDto,
} from '../../posts/api/models/input/posts.input.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/mongodb/posts.query.repository';
import { PostsPaging } from '../../posts/api/models/output/posts.output.dto';
import { PostsService } from '../../posts/application/posts.service';
import { InputDto } from '../../../infrastructure/models/input.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { Request } from 'express';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import { BlogsSqlRepository } from '../infrastructure/postgresdb/blogs.sql.repository';
import { UsersSqlRepository } from '../../users/infrastructure/postgresqldb/users.sql.repository';
import { DevicesSqlRepository } from '../../security/infrastructure/devices.sql.repository';
import { RequestApiSqlRepository } from '../../requests/infrastructure/request.sql.repository';
import { BlogsSqlQueryRepository } from '../infrastructure/postgresdb/blogs.sql.query.repository';
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { PostsSqlQueryRepository } from '../../posts/infrastructure/postgresql/posts.sql.query.repository';
import {CommentsSqlRepository} from "../../comments/infrastructure/postgresql/sql.comments.repository";

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class SaBlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsSqlQueryRepository: BlogsSqlQueryRepository,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsSqlQueryRepository: PostsSqlQueryRepository,
    private readonly postsService: PostsService,
    private readonly accessJwtToken: AccessJwtToken,
    private readonly usersSqlRepository: RequestApiSqlRepository,
    private readonly commentsSqlRepository: CommentsSqlRepository,
  ) {}

  @Get('/blogs')
  async createBlogInSql() {

    await this.commentsSqlRepository
        .updateById('0208b79e-85ba-465c-b9c7-f776abeff611', 'Hello')
  }

  @Post()
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    return this.blogsService.createBlog(dto);
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
    @Body() dto: InputDto,
  ) {
    const serviceDto: PostsInputDto = {
      ...dto,
      blogId: id,
    };

    return this.postsService.createPost(serviceDto);
  }

  @Get()
  async getBlogsPaging(@Query() query: BlogQuery): Promise<BlogsViewPagingDto> {
    return this.blogsSqlQueryRepository.getBlogsPaging(query);
  }

  @Get(':blogId')
  async getBlogById(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
  ): Promise<BlogsViewDto> {
    return this.blogsSqlQueryRepository.findById(id);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', paramIdIsMongoIdPipe) blogId: string,
    @Query() query: PostQuery,
    @Req() req: Request,
  ): Promise<PostsPaging> {
    await this.blogsSqlQueryRepository.findById(blogId);

    const dto: { userId?: string; blogId?: string } = { blogId: blogId };

    // const headerToken = req.headers.authorization;
    //
    // if (!headerToken) return this.postsQueryRepository.findPaging(query, dto);
    //
    // const accessJwtToken = headerToken.split(' ')[1];
    //
    // const payload = await this.accessJwtToken.verify(accessJwtToken);
    //
    // if (!payload) return this.postsQueryRepository.findPaging(query, dto);
    //
    // dto.userId = payload.sub;

    return this.postsSqlQueryRepository.findPaging(query, dto);
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
