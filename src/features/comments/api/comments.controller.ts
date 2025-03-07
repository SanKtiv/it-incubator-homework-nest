import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { paramIdIsUUIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { CommentsService } from '../application/comments.service';
import { JWTAccessAuthGuard } from '../../../infrastructure/guards/jwt-access-auth.guard';
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { CommentInputDto } from './models/input/comment.input.dto';
import { PostLikeStatusDto } from '../../posts/api/models/input/posts.input.dto';
import { Request } from 'express';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import {CommentsQueryRepository} from "../infrastructure/postgresql/comments.query.repository";
import {CommentOutputDto} from "./models/output/comment.output.dto";

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly accessJwtToken: AccessJwtToken,
  ) {}

  @Get('test')
  async test() {
      const id = '7c662c52-4d1e-49b6-8156-2c5f88ccac74'
      const userId = 'f293f96b-ec4a-4302-a19a-ad3c36c8c50d'
      return this.commentsQueryRepository.getCommentByd(id, userId);
  }

  @Get(':commentId')
  async getCommentById(
    @Param('commentId', paramIdIsUUIdPipe) id: string,
    @Req() req: Request,
  ): Promise<CommentOutputDto> {
    const userId = await this.accessJwtToken.getUserIdFromHeaders(
      req.headers.authorization,
    );

    return this.commentsQueryRepository.getCommentByd(id, userId);
  }

  @Put(':commentId/like-status')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async createLikeStatusForComment(
    @Param('commentId', paramIdIsUUIdPipe) id: string,
    @CurrentUserId() userId: string,
    @Body() dto: PostLikeStatusDto,
  ): Promise<void> {
    await this.commentsService.createCommentStatus(id, userId, dto);
  }

  @Put(':commentId')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async updateCommentById(
    @Param('commentId', paramIdIsUUIdPipe) id: string,
    @CurrentUserId() userId: string,
    @Body() dto: CommentInputDto,
  ): Promise<void> {
    await this.commentsService.updateCommentById(id, userId, dto);
  }

  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async removeCommentById(
    @Param('commentId', paramIdIsUUIdPipe) id: string,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.commentsService.deleteCommentById(id, userId);
  }
}
