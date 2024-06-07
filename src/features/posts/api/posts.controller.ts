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
import { PostQuery, PostsInputDto } from './models/input/posts.input.dto';
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
import { CommentInputDto } from '../../comments/api/models/comment.input.dto';
import { CommentsService } from '../../comments/application/comments.service';
import {
  CommentOutputDto,
  commentOutputDto,
  commentsPagingDto,
} from '../../comments/api/models/comment.output.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { QueryDto } from '../../../infrastructure/models/query.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { JWTAccessAuthGuard } from '../../../infrastructure/guards/jwt-access-auth.guard';

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
    const blog = await this.blogsQueryRepository.findById(inputDto.blogId);
    if (!blog) throw new NotFoundException();
    const blogName = blog.name;
    const postDocument = await this.postsService.createPost(inputDto, blogName);
    return postsOutputDto(postDocument);
  }

  @Get(':postId')
  async getPostById(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
  ): Promise<PostsOutputDto | HttpException> {
    return this.postsQueryRepository.findById(id);
  }

  @Post(':postId/comments')
  @UseGuards(JWTAccessAuthGuard)
  async createCommentForPost(
    @Param('postId', paramIdIsMongoIdPipe) id: string,
    @Body() inputDto: CommentInputDto,
  ): Promise<CommentOutputDto> {
    const dto = {
      content: inputDto.content,
      userId: 'userId',
      userLogin: 'userLogin',
      postId: id,
    };
    const commentDocument = await this.commentsService.createComment(dto);
    return commentOutputDto(commentDocument);
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
