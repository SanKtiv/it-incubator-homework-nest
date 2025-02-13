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
import { PostsService } from '../application/posts.service';
import {
  PostLikeStatusDto,
  PostQuery,
  PostsInputDto,
} from './models/input/posts.input.dto';
import { PostsOutputDto, PostsPaging } from './models/output/posts.output.dto';
import { BlogsQueryRepositoryMongo } from '../../blogs/infrastructure/mongodb/blogs.query.repository-mongo';
import { PostsQueryRepositoryMongo } from '../infrastructure/mongodb/posts.query.repository-mongo';
import { paramIdIsUUIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { CommentInputDto } from '../../comments/api/models/input/comment.input.dto';
import { CommentsService } from '../../comments/application/comments.service';
import { CommentOutputDto } from '../../comments/api/models/output/comment.output.dto';
import { CommentsQueryRepositoryMongo } from '../../comments/infrastructure/mongodb/comments.query.repository-mongo';
import { QueryDto } from '../../../infrastructure/models/query.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { JWTAccessAuthGuard } from '../../../infrastructure/guards/jwt-access-auth.guard';
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { CommentServiceDto } from '../../comments/api/models/input/comment-service.dto';
import { Request } from 'express';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import { PostsQueryRepositorySql } from '../infrastructure/postgresql/posts.query.repository-sql';
import { CommentsQueryRepositorySql } from '../../comments/infrastructure/postgresql/comments.query.repository-sql';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postsService: PostsService,
    //private readonly blogsQueryRepository: BlogsQueryRepositoryMongo,
    //private readonly postsQueryRepository: PostsQueryRepositoryMongo,
    private readonly postsQueryRepositorySql: PostsQueryRepositorySql,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    //private readonly commentsQueryRepository: CommentsQueryRepositoryMongo,
    private readonly commentsSqlQueryRepository: CommentsQueryRepositorySql,
    private readonly accessJwtToken: AccessJwtToken,
  ) {}

  @Get('test')
  async get() {
    const query = new PostQuery();
    return this.postsQueryRepository.getPostsPaging(query, null);
  }

  @Get(':postId')
  async getPostById(
    @Param('postId', paramIdIsUUIdPipe) id: string,
    @Req() req: Request,
  ): Promise<PostsOutputDto> {
    const userId = await this.accessJwtToken.getUserIdFromHeaders(
      req.headers.authorization,
    );

    const post = await this.postsQueryRepositorySql.findById_RAW(id, userId);

    if (!post) throw new NotFoundException();

    return post;
  }

  @Put(':postId/like-status')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async createStatus(
    @Param('postId', paramIdIsUUIdPipe) id: string,
    @Body() dto: PostLikeStatusDto,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.postsService.createStatusForPost(id, dto, userId);
  }

  @Post(':postId/comments')
  @UseGuards(JWTAccessAuthGuard)
  async createCommentForPost(
    @Param('postId', paramIdIsUUIdPipe) id: string,
    @Body() inputDto: CommentInputDto,
    @CurrentUserId() userId: string,
  ): Promise<CommentOutputDto> {
    const dto = new CommentServiceDto();

    dto.content = inputDto.content;
    dto.userId = userId;
    dto.postId = id;

    return this.commentsService.createComment(dto);
  }

  @Get()
  async getPostsPaging(
    @Query() query: PostQuery,
    @Req() req: Request,
  ): Promise<PostsPaging> {
    const userId = await this.accessJwtToken.getUserIdFromHeaders(
      req.headers.authorization,
    );

    const blogId = null;

    return this.postsQueryRepositorySql.findPaging_RAW(query, blogId, userId);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId', paramIdIsUUIdPipe) postId: string,
    @Query() query: QueryDto,
    @Req() req: Request,
  ) {
    const post = await this.postsQueryRepositorySql.findById_RAW(postId);

    if (!post) throw new NotFoundException();

    const userId = await this.accessJwtToken.getUserIdFromHeaders(
      req.headers.authorization,
    );

    return this.commentsSqlQueryRepository.findPaging_RAW(
      query,
      postId,
      userId,
    );
  }

  @Put(':postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updatePostById(
    @Param('postId', paramIdIsUUIdPipe) id: string,
    @Body() postUpdateDto: PostsInputDto,
  ): Promise<void> {
    await this.postsService.updatePost(id, postUpdateDto);
  }

  @Delete(':postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deletePostById(
    @Param('postId', paramIdIsUUIdPipe) id: string,
  ): Promise<void> {
    await this.postsService.deletePostById(id);
  }
}
