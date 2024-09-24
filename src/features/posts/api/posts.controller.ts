import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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
import { BlogsQueryRepository } from '../../blogs/infrastructure/mongodb/blogs.query.repository';
import { PostsQueryRepository } from '../infrastructure/mongodb/posts.query.repository';
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { CommentInputDto } from '../../comments/api/models/input/comment.input.dto';
import { CommentsService } from '../../comments/application/comments.service';
import {
  CommentOutputDto,
  commentsPagingDto,
} from '../../comments/api/models/output/comment.output.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { QueryDto } from '../../../infrastructure/models/query.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { JWTAccessAuthGuard } from '../../../infrastructure/guards/jwt-access-auth.guard';
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { CommentServiceDto } from '../../comments/api/models/input/comment-service.dto';
import { Request } from 'express';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import { PostsSqlQueryRepository } from '../infrastructure/postgresql/posts.sql.query.repository';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsSqlQueryRepository: PostsSqlQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly accessJwtToken: AccessJwtToken,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() inputDto: PostsInputDto): Promise<PostsOutputDto> {
    return this.postsService.createPost(inputDto);
  }

  @Get(':postId')
  async getPostById(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
    @Req() req: Request,
  ): Promise<PostsOutputDto | HttpException> {
    // const headerToken = req.headers.authorization;
    // if (!headerToken) return this.postsQueryRepository.findById(id);
    // const accessJwtToken = headerToken.split(' ')[1];
    // const payload = await this.accessJwtToken.verify(accessJwtToken);
    // if (!payload) return this.postsQueryRepository.findById(id);
    // return this.postsQueryRepository.findById(id, payload.sub);

    return this.postsSqlQueryRepository.findById(id);
  }

  // @Put(':postId/like-status')
  // @HttpCode(204)
  // @UseGuards(JWTAccessAuthGuard)
  // async createStatus(
  //   @Param('postId', paramIdIsMongoIdPipe) id: string,
  //   @Body() dto: PostLikeStatusDto,
  //   @CurrentUserId() userId: string,
  // ) {
  //   await this.postsService.updateLikeStatus(id, dto, userId);
  // }

  @Post(':postId/comments')
  @UseGuards(JWTAccessAuthGuard)
  async createCommentForPost(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
    @Body() inputDto: CommentInputDto,
    @CurrentUserId() userId: string,
  ): Promise<CommentOutputDto> {
    const dto: CommentServiceDto = {
      content: inputDto.content,
      userId: userId,
      userLogin: 'userLogin',
      postId: id,
    };
    return this.commentsService.createComment(dto);
  }

  @Get()
  async getPostsPaging(
    @Query() query: PostQuery,
    @Req() req: Request,
  ): Promise<PostsPaging> {
    // const headerToken = req.headers.authorization;
    const dto: { userId?: string; blogId?: string } = {};
    // if (!headerToken) return this.postsQueryRepository.findPaging(query, dto);
    // const accessJwtToken = headerToken.split(' ')[1];
    // const payload = await this.accessJwtToken.verify(accessJwtToken);
    // if (!payload) return this.postsQueryRepository.findPaging(query, dto);
    // dto.userId = payload.sub;

    return this.postsSqlQueryRepository.findPaging(query, dto);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId', paramIdIsMongoIdPipe) postId: string,
    @Query() query: QueryDto,
    @Req() req: Request,
  ) {
    const headerToken = req.headers.authorization;
    if (!headerToken)
      return this.commentsQueryRepository.findPaging(postId, query);
    const accessJwtToken = headerToken.split(' ')[1];
    const payload = await this.accessJwtToken.verify(accessJwtToken);
    if (!payload) return this.commentsQueryRepository.findPaging(postId, query);
    return this.commentsQueryRepository.findPaging(postId, query, payload.sub);
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
    await this.postsService.deletePost(id);
  }
}
