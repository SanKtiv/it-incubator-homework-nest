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
import { CommentsQueryRepositoryMongo } from '../infrastructure/mongodb/comments.query.repository-mongo';
import { paramIdIsUUIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { CommentsService } from '../application/comments.service';
import { JWTAccessAuthGuard } from '../../../infrastructure/guards/jwt-access-auth.guard';
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { CommentInputDto } from './models/input/comment.input.dto';
import { PostLikeStatusDto } from '../../posts/api/models/input/posts.input.dto';
import { Request } from 'express';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import { CommentsQueryRepositorySql } from '../infrastructure/postgresql/comments.query.repository-sql';
import {CommentsQueryRepository} from "../infrastructure/postgresql/comments.query.repository";

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepositorySql: CommentsQueryRepositorySql,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly accessJwtToken: AccessJwtToken,
  ) {}

  @Get(':commentId')
  async getCommentById(
    @Param('commentId', paramIdIsUUIdPipe) id: string,
    @Req() req: Request,
  ) {
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
  ) {
    await this.commentsService.createStatusOfComment(id, userId, dto);
  }

  @Put(':commentId')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async updateCommentById(
    @Param('commentId', paramIdIsUUIdPipe) id: string,
    @CurrentUserId() userId: string,
    @Body() dto: CommentInputDto,
  ) {
    await this.commentsService.updateCommentById(id, userId, dto);
  }

  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async removeCommentById(
    @Param('commentId', paramIdIsUUIdPipe) id: string,
    @CurrentUserId() userId: string,
  ) {
    await this.commentsService.deleteCommentById(id, userId);
  }
}
