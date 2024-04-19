import {
  Body,
  Controller,
  Delete,
  Get, HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
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
import { paramIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { CommentInputDto } from '../../comments/api/models/comment.input.dto';
import { CommentsService } from '../../comments/application/comments.service';
import { Prop } from '@nestjs/mongoose';
import {
  commentOutputDto,
  commentsPagingDto,
} from '../../comments/api/models/comment.output.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { QueryDto } from '../../../infrastructure/models/query.dto';

@Controller('posts')
//@UsePipes(new ValidationPipe({ transform: true }))
export class PostController {
  constructor(
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Post()
  async createPost(@Body() inputDto: PostsInputDto): Promise<PostsOutputDto> {
    const blog = await this.blogsQueryRepository.findById(inputDto.blogId);
    if (!blog) throw new NotFoundException();
    const blogName = blog.name;
    const postDocument = await this.postsService.createPost(inputDto, blogName);
    return postsOutputDto(postDocument);
  }

  @Get(':postId')
  @UsePipes(paramIdPipe)
  async getPostById(@Param('postId') id: string): Promise<PostsOutputDto> {
    const postDocument = await this.postsQueryRepository.findById(id);
    return postsOutputDto(postDocument!);
  }

  @Post(':postId/comments')
  async createCommentForPost(
    @Param('postId', paramIdPipe) id: string,
    @Body() inputDto: CommentInputDto,
  ) {
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
    const totalPosts = await this.postsQueryRepository.countDocuments();
    const posts = await this.postsQueryRepository.findPaging(query);
    return postsPaging(query, totalPosts, posts);
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
  async updatePostById(
    @Param('postId', paramIdPipe) id: string,
    @Body() postUpdateDto: PostsInputDto,
  ) {
    const postDocument = await this.postsQueryRepository.findById(id);
    await this.postsService.updatePost(postDocument!, postUpdateDto);
  }

  @Delete(':postId')
  @HttpCode(204)
  @UsePipes(paramIdPipe)
  async deletePostById(@Param('postId') id: string): Promise<void> {
    await this.postsService.deletePost(id);
  }
}
