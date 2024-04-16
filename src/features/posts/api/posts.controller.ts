import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsInputDto } from './models/input/posts.input.dto';
import { postsOutputDto } from './models/output/posts.output.dto';

@Controller('posts')
@UsePipes(new ValidationPipe({ transform: true }))
export class PostController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Body() inputDto: PostsInputDto) {
    const blogName = '';
    const post = await this.postsService.createPost(inputDto, blogName);
    return postsOutputDto(post);
  }
}
