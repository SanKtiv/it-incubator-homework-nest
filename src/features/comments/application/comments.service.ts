import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CommentOutputDto,
  commentModelOutput,
} from '../api/models/output/comment.output.dto';
import { CommentInputDto } from '../api/models/input/comment.input.dto';
import { PostLikeStatusDto } from '../../posts/api/models/input/posts.input.dto';
import { PostsService } from '../../posts/application/posts.service';
import { CommentsTable } from '../domain/comments.entity';
import { CommentsRepository } from '../infrastructure/comments.repository';
import {StatusesCommentsRepository} from "../../statuses/infrastructure/statuses.comments.repository";
import {StatusesCommentsTable} from "../../statuses/domain/statuses.entity";

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly statusesRepository: StatusesCommentsRepository,
    private readonly postsService: PostsService,
  ) {}

  async createComment(id: string, content: string, userId: string): Promise<CommentOutputDto> {
    await this.postsService.existPostById(id);

    const commentEntity = new CommentsTable();

    commentEntity.content = content;
    commentEntity.postId = id;
    commentEntity.userId = userId;
    commentEntity.createdAt = new Date();

    const comment = await this.commentsRepository.createComment(commentEntity);

    return commentModelOutput(comment);
  }

  async updateCommentById(id: string, userId: string, dto: CommentInputDto): Promise<void> {
    const comment = await this.existComment(id);

    if (comment.userId !== userId) throw new ForbiddenException();

    comment.content = dto.content;

    await this.commentsRepository.updateComment(comment);
  }

  async deleteCommentById(id: string, userId: string): Promise<void> {
    const comment = await this.existComment(id);

    if (comment.userId !== userId) throw new ForbiddenException();

    await this.commentsRepository.deleteOneById(comment);
  }

  async createCommentStatus(
    id: string,
    userId: string,
    dto: PostLikeStatusDto,
  ): Promise<void> {
    await this.existComment(id);

    const commentStatus = new StatusesCommentsTable()

    commentStatus.userStatus = dto.likeStatus;
    commentStatus.userId = userId;
    commentStatus.addedAt = new Date();

    await this.statusesRepository.createStatusComment(commentStatus)
  }

  async existComment(id: string): Promise<CommentsTable> {
    const comment = await this.commentsRepository.getCommentById(id);

    if (!comment) throw new NotFoundException();

    return comment;
  }
}
