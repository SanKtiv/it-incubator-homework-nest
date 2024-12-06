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
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { CommentsService } from '../application/comments.service';
import { JWTAccessAuthGuard } from '../../../infrastructure/guards/jwt-access-auth.guard';
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { CommentInputDto } from './models/input/comment.input.dto';
import { PostLikeStatusDto } from '../../posts/api/models/input/posts.input.dto';
import { Request } from 'express';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import { CommentsSqlQueryRepository } from '../infrastructure/postgresql/comments.query.repository-sql';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepositoryMongo,
    private readonly commentsSqlQueryRepository: CommentsSqlQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly accessJwtToken: AccessJwtToken,
  ) {}

  @Get(':commentId')
  async getCommentById(
    @Param('commentId', paramIdIsMongoIdPipe) id: string,
    @Req() req: Request,
  ) {
    const userId = await this.accessJwtToken.getUserIdFromHeaders(
      req.headers.authorization,
    );

    return this.commentsSqlQueryRepository.findById_RAW(id, userId);
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
  //@UseGuards(JWTAccessAuthGuard)
  async removeCommentById(
    @Param('commentId', paramIdIsMongoIdPipe) id: string,
    //@CurrentUserId() userId: string,
  ) {
    await this.commentsService.removeCommentById(id, '3e2c667f-f19d-4c84-92b9-e1635b8ceb72');
  }
}
