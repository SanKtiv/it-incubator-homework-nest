import {Body, Controller, Get, Post} from '@nestjs/common';

@Controller('users')
export class BlogsController {
  @Get()
  getUser() {
    return { key: 'Hello' };
  }
  @Post()
  createPost(@Body() inputBody: InBodyModel) {
    return { key: inputBody.title }
  }
}
type InBodyModel = {
  title: string
}