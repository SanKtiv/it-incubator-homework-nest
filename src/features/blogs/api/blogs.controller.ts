import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger';
import { BlogQuery, BlogsInputDto } from './models/input/blogs.input.dto';
import { BlogsService } from '../application/blogs.service';
import {
  BlogsViewDto,
  BlogsViewPagingDto,
} from './models/output/blogs.view.dto';
import { paramIdIsUUIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import {
  PostQuery,
  PostsInputDto,
} from '../../posts/api/models/input/posts.input.dto';
import { PostsPaging } from '../../posts/api/models/output/posts.output.dto';
import { PostsService } from '../../posts/application/posts.service';
import { InputDto } from '../../../infrastructure/models/input.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { Request } from 'express';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';

@Controller('blogs')
@ApiTags('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
    private readonly accessJwtToken: AccessJwtToken,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  @ApiOperation({ summary: 'New blog' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createBlog(@Body() dto: BlogsInputDto): Promise<BlogsViewDto> {
    return this.blogsService.createBlog(dto);
  }

  @Post(':blogId/posts')
  @UseGuards(BasicAuthGuard)
  async createPostForBlog(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
    @Body() dto: InputDto,
  ) {
    const postsInputDto: PostsInputDto = {
      ...dto,
      blogId: id,
    };

    return this.postsService.createPost(postsInputDto);
  }

  @Get()
  @ApiQuery({ type: BlogQuery })
  async getBlogsPaging(@Query() query: BlogQuery): Promise<BlogsViewPagingDto> {
    return this.blogsQueryRepository.findBlogs(query);
  }

  @Get(':blogId')
  async getBlogById(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
  ): Promise<BlogsViewDto> {
    const blog = await this.blogsQueryRepository.findById(id);

    if (!blog) throw new NotFoundException();

    return blog;
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', paramIdIsUUIdPipe) blogId: string,
    @Query() query: PostQuery,
    @Req() req: Request,
  ): Promise<PostsPaging> {
    const blog = await this.blogsQueryRepository.findById(blogId);

    if (!blog) throw new NotFoundException();

    const userId = await this.accessJwtToken.getUserIdFromHeaders(
      req.headers.authorization,
    );

    return this.postsQueryRepository.getPostsPaging(query, { blogId, userId });
  }

  @Put(':blogId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updateBlogById(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
    @Body() inputUpdate: BlogsInputDto,
  ): Promise<void> {
    await this.blogsService.updateBlog(id, inputUpdate);
  }

  @Delete(':blogId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteBlogById(
    @Param('blogId', paramIdIsUUIdPipe) id: string,
  ): Promise<void> {
    await this.blogsService.deleteBlogById(id);
  }
}
