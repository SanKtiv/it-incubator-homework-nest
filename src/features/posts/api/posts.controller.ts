import {
  Body,
  Controller, Get, NotFoundException, Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsInputDto } from './models/input/posts.input.dto';
import { postsOutputDto } from './models/output/posts.output.dto';
import {BlogsQueryRepository} from "../../blogs/infrastructure/blogs.query.repository";
import {PostsQueryRepository} from "../infrastructure/posts.query.repository";
import {paramIdPipe} from "../../../infrastructure/pipes/validation.pipe";

@Controller('posts')
@UsePipes(new ValidationPipe({ transform: true }))
export class PostController {
  constructor(private readonly postsService: PostsService,
              private readonly blogsQueryRepository: BlogsQueryRepository,
              private readonly postsQueryRepository: PostsQueryRepository) {}

  @Post()
  async createPost(@Body() inputDto: PostsInputDto) {
    const blog = await this.blogsQueryRepository.findById(inputDto.blogId)
    if (!blog) throw new NotFoundException()
    const blogName = blog.name;
    const createdPost = await this.postsService.createPost(inputDto, blogName);
    const post = await this.postsService.savePost(createdPost);
    return postsOutputDto(post);
  }

  @Get(':postId')
  @UsePipes(paramIdPipe)
  async getPostById(@Param('postId') id: string) {
    const postDocument = await this.postsQueryRepository.findById(id)
    return postsOutputDto(postDocument!);
  }
}
