import {Body, Controller, Delete, Get, Param, Put, UseGuards} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import {CommentsService} from "../application/comments.service";
import {JWTAccessAuthGuard} from "../../../infrastructure/guards/jwt-access-auth.guard";
import {CurrentUserId} from "../../auth/infrastructure/decorators/current-user-id.param.decorator";
import {CommentInputDto} from "./models/input/comment.input.dto";
import {PostLikeStatusDto} from "../../posts/api/models/input/posts.input.dto";

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService
  ) {}

  @Get(':commentId')
  async getCommentById(@Param('commentId', paramIdIsMongoIdPipe) id: string) {
    return this.commentsQueryRepository.findById(id);
  }

  @Put(':commentId')
  @UseGuards(JWTAccessAuthGuard)
  async createLikeStatusForComment(
      @Param('commentId', paramIdIsMongoIdPipe) id: string,
      @CurrentUserId() userId: string,
      @Body() dto: PostLikeStatusDto
  ) {

  }

  @Put(':commentId')
  @UseGuards(JWTAccessAuthGuard)
  async updateCommentById(
      @Param('commentId', paramIdIsMongoIdPipe) id: string,
      @CurrentUserId() userId: string,
      @Body() dto: CommentInputDto
  ) {
    await this.commentsService.updateCommentById(id, userId, dto);
  }

  @Delete(':commentId')
  @UseGuards(JWTAccessAuthGuard)
  async removeCommentById(
      @Param('commentId', paramIdIsMongoIdPipe) id: string,
      @CurrentUserId() userId: string
  ) {
    await this.commentsService.removeCommentById(id, userId);
  }
}
