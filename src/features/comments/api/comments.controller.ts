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
import { CommentsQueryRepository } from '../infrastructure/mongodb/comments.query.repository';
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { CommentsService } from '../application/comments.service';
import { JWTAccessAuthGuard } from '../../../infrastructure/guards/jwt-access-auth.guard';
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { CommentInputDto } from './models/input/comment.input.dto';
import { PostLikeStatusDto } from '../../posts/api/models/input/posts.input.dto';
import { Request } from 'express';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import {CommentsSqlQueryRepository} from "../infrastructure/postgresql/sql.comments.query.repository";

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsSqlQueryRepository: CommentsSqlQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly accessJwtToken: AccessJwtToken,
  ) {}

  @Get(':commentId')
  async getCommentById(
    @Param('commentId', paramIdIsMongoIdPipe) id: string,
    @Req() req: Request,
  ) {
    const headerToken = req.headers.authorization;

    if (!headerToken) return this.commentsSqlQueryRepository.findById(id);

    const accessJwtToken = headerToken.split(' ')[1];
    const payload = await this.accessJwtToken.verify(accessJwtToken);

    if (!payload) return this.commentsQueryRepository.findById(id);

    return this.commentsQueryRepository.findById(id, payload.sub);
  }

  @Put(':commentId/like-status')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async createLikeStatusForComment(
    @Param('commentId', paramIdIsMongoIdPipe) id: string,
    @CurrentUserId() userId: string,
    @Body() dto: PostLikeStatusDto,
  ) {
    await this.commentsService.createStatusOfComment(id, userId, dto);
  }

  @Put(':commentId')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async updateCommentById(
    @Param('commentId', paramIdIsMongoIdPipe) id: string,
    @CurrentUserId() userId: string,
    @Body() dto: CommentInputDto,
  ) {
    await this.commentsService.updateCommentById(id, userId, dto);
  }

  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(JWTAccessAuthGuard)
  async removeCommentById(
    @Param('commentId', paramIdIsMongoIdPipe) id: string,
    @CurrentUserId() userId: string,
  ) {
    await this.commentsService.removeCommentById(id, userId);
  }
}
