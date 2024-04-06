import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller()
export class BlogsController {

  constructor(private readonly blogsService: BlogsService) {}

  @Get('blogs')
  getAllBlogs() {
    return this.blogsService.findAll();
  }

  @Post('blogs')
  createBlog(@Body() inputBody) {
    return this.blogsService.create(inputBody);
  }
}
