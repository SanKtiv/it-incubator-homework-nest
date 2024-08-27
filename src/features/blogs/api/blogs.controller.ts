import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogQuery, BlogsInputDto } from './models/input/blogs.input.dto';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import {
  BlogsViewDto,
  BlogsViewPagingDto,
} from './models/output/blogs.view.dto';
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import {
  PostQuery,
  PostsInputDto,
} from '../../posts/api/models/input/posts.input.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { PostsPaging } from '../../posts/api/models/output/posts.output.dto';
import { PostsService } from '../../posts/application/posts.service';
import { InputDto } from '../../../infrastructure/models/input.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { Request } from 'express';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import { BlogsSqlRepository } from '../infrastructure/blogs.sql.repository';
import { UsersSqlRepository } from '../../users/infrastructure/postgresqldb/users.sql.repository';
import { DevicesSqlRepository } from '../../security/infrastructure/devices.sql.repository';
import { RequestApiSqlRepository } from '../../requests/infrastructure/request.sql.repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
    private readonly accessJwtToken: AccessJwtToken,
    private readonly usersSqlRepository: RequestApiSqlRepository,
  ) {}

  @Get('/blogs')
  async createBlogInSql() {
    const dto = {
      ip: '12345',
      url: 'Chrome3',
      date: '098761333',
    };
    //return this.usersSqlRepository.create(dto);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    return this.blogsService.createBlog(dto);
  }

  @Post(':blogId/posts')
  @UseGuards(BasicAuthGuard)
  async createPostForBlog(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
    @Body() dto: InputDto,
  ) {
    const serviceDto: PostsInputDto = {
      ...dto,
      blogId: id,
    };

    return this.postsService.createPost(serviceDto);
  }

  @Get()
  async getBlogsPaging(@Query() query: BlogQuery): Promise<BlogsViewPagingDto> {
    return this.blogsQueryRepository.getBlogsPaging(query);
  }

  @Get(':blogId')
  async getBlogById(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
  ): Promise<BlogsViewDto> {
    return this.blogsQueryRepository.findById(id);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', paramIdIsMongoIdPipe) blogId: string,
    @Query() query: PostQuery,
    @Req() req: Request,
  ): Promise<PostsPaging> {
    await this.blogsQueryRepository.findById(blogId);

    const dto: { userId?: string; blogId?: string } = { blogId: blogId };

    const headerToken = req.headers.authorization;

    if (!headerToken) return this.postsQueryRepository.findPaging(query, dto);

    const accessJwtToken = headerToken.split(' ')[1];

    const payload = await this.accessJwtToken.verify(accessJwtToken);

    if (!payload) return this.postsQueryRepository.findPaging(query, dto);

    dto.userId = payload.sub;

    return this.postsQueryRepository.findPaging(query, dto);
  }

  @Put(':blogId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updateBlogById(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
    @Body() inputUpdate: BlogsInputDto,
  ): Promise<void> {
    await this.blogsService.updateBlog(id, inputUpdate);
  }

  @Delete(':blogId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteBlogById(
    @Param('blogId', paramIdIsMongoIdPipe) id: string,
  ): Promise<void> {
    await this.blogsService.deleteBlog(id);
  }
}
