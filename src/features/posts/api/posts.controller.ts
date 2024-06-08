import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import {
  PostLikeStatus,
  PostQuery,
  PostsInputDto,
} from './models/input/posts.input.dto';
import {
  PostsOutputDto,
  postsOutputDto,
  PostsPaging,
  postsPaging,
} from './models/output/posts.output.dto';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import {
  paramIdIsMongoIdPipe,
  paramIdPipe,
} from '../../../infrastructure/pipes/validation.pipe';
import { CommentInputDto } from '../../comments/api/models/input/comment.input.dto';
import { CommentsService } from '../../comments/application/comments.service';
import {
  CommentOutputDto,
  commentOutputDto,
  commentsPagingDto,
} from '../../comments/api/models/output/comment.output.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { QueryDto } from '../../../infrastructure/models/query.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { JWTAccessAuthGuard } from '../../../infrastructure/guards/jwt-access-auth.guard';
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { CommentServiceDto } from '../../comments/api/models/input/comment-service.dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() inputDto: PostsInputDto): Promise<PostsOutputDto> {
    return this.postsService.createPost(inputDto);
  }

  @Get(':postId')
  async getPostById(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
  ): Promise<PostsOutputDto | HttpException> {
    return this.postsQueryRepository.findById(id);
  }

  @Put(':postId/like-status')
  @UseGuards(JWTAccessAuthGuard)
  async createStatus(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
    @Body() dto: PostLikeStatus,
  ) {await this.commentsService.}

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
  async getPostsPaging(@Query() query: PostQuery): Promise<PostsPaging> {
    return this.postsQueryRepository.findPaging(query);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId') id: string,
    @Query() query: QueryDto,
  ) {
    const totalComments = await this.commentsQueryRepository.countDocuments(id);
    const commentDocument = await this.commentsQueryRepository.findPaging(
      id,
      query,
    );
    return commentsPagingDto(query, totalComments, 'None', commentDocument);
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
