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
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';
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
import { CommentsSqlQueryRepository } from '../../comments/infrastructure/postgresql/comments.query.repository-sql';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepositoryMongo,
    private readonly postsQueryRepository: PostsQueryRepositoryMongo,
    private readonly postsSqlQueryRepository: PostsQueryRepositorySql,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepositoryMongo,
    private readonly commentsSqlQueryRepository: CommentsSqlQueryRepository,
    private readonly accessJwtToken: AccessJwtToken,
  ) {}

  // @Post()
  // @UseGuards(BasicAuthGuard)
  // async createPost(@Body() inputDto: PostsInputDto): Promise<PostsOutputDto> {
  //   return this.postsService.createPost(inputDto);
  // }

  @Get(':postId')
  async getPostById(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
    @Req() req: Request,
  ): Promise<PostsOutputDto> {
    const userId = await this.accessJwtToken.getUserIdFromHeaders(
      req.headers.authorization,
    );

    const post = await this.postsSqlQueryRepository.findById_RAW(id, userId);

    if (!post) throw new NotFoundException();

    return post;
  }

  @Put(':postId/like-status')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async createStatus(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
    @Body() dto: PostLikeStatusDto,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.postsService.createStatusForPost(id, dto, userId);
  }

  @Post(':postId/comments')
  @UseGuards(JWTAccessAuthGuard)
  async createCommentForPost(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
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

    return this.postsSqlQueryRepository.findPaging_RAW(query, null, userId);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId', paramIdIsMongoIdPipe) postId: string,
    @Query() query: QueryDto,
    @Req() req: Request,
  ) {
    const count = await this.postsSqlQueryRepository.countById(postId);

    if (count === 0) throw new NotFoundException();

    const userId = await this.accessJwtToken.getUserIdFromHeaders(
      req.headers.authorization,
    );

    return this.commentsSqlQueryRepository.findPaging(query, postId, userId);
  }

  @Put(':postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updatePostById(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
    @Body() postUpdateDto: PostsInputDto,
  ): Promise<void> {
    await this.postsService.updatePost(id, postUpdateDto);
  }

  @Delete(':postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deletePostById(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
  ): Promise<void> {
    await this.postsService.deletePostById(id);
  }
}
