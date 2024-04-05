import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class BlogsController {
  @Get()
  getUser() {
    return { key: 'Hello' };
  }
}
