import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('posts')
//@UsePipes(new ValidationPipe({ transform: true }))
export class PostController {
  constructor(
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  async createPost(@Body() inputDto: PostsInputDto): Promise<PostsOutputDto> {
    const blog = await this.blogsQueryRepository.findById(inputDto.blogId);
    if (!blog) throw new NotFoundException();
    const blogName = blog.name;
    const createdPost = await this.postsService.createPost(inputDto, blogName);
    const post = await this.postsService.savePost(createdPost);
    return postsOutputDto(post);
  }

  @Get(':postId')
  @UsePipes(paramIdPipe)
  async getPostById(@Param('postId') id: string): Promise<PostsOutputDto> {
    const postDocument = await this.postsQueryRepository.findById(id);
    return postsOutputDto(postDocument!);
  }

  @Get()
  async getPostsPaging(@Query() query: PostQuery): Promise<PostsPaging> {
    const totalPosts = await this.postsQueryRepository.countDocuments();
    const posts = await this.postsQueryRepository.findPaging(query);
    return postsPaging(query, totalPosts, posts);
  }

  @Put(':postId')
  async updatePostById(
    @Param('postId', paramIdPipe) id: string,
    @Body() postUpdateDto: PostsInputDto,
  ) {
    const postDocument = await this.postsQueryRepository.findById(id);
    await this.postsService.updatePost(postDocument!, postUpdateDto);
  }

  @Delete(':postId')
  @UsePipes(paramIdPipe)
  async deletePostById(@Param('postId') id: string): Promise<void> {
    await this.postsService.deletePost(id);
  }
}
