import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepositoryMongo } from '../infrastructure/mongodb/comments.repository-mongo';
import { PostsRepositoryMongo } from '../../posts/infrastructure/mongodb/posts.repository-mongo';
import { UsersRepositoryMongo } from '../../users/infrastructure/mongodb/users.repository-mongo';
import {
  CommentOutputDto,
  commentModelOutput,
} from '../api/models/output/comment.output.dto';
import { CommentServiceDto } from '../api/models/input/comment-service.dto';
import { CommentInputDto } from '../api/models/input/comment.input.dto';
import { PostLikeStatusDto } from '../../posts/api/models/input/posts.input.dto';
import { CommentDocument } from '../domain/comment.schema';
import { PostsService } from '../../posts/application/posts.service';
import { UsersRepositoryRawsql } from '../../users/infrastructure/postgresqldb/users.repository-rawsql';
import { CommentsRepositorySql } from '../infrastructure/postgresql/comments.repository-sql';
import { StatusesRepositorySql } from '../../statuses/infrastructure/postgresql/statuses.repository-sql';
import { CommentsTable } from '../domain/comments.entity';
import { CommentsRepository } from '../infrastructure/comments.repository';
import {StatusesRepository} from "../../statuses/infrastructure/statuses.repository";
import {StatusesCommentsTable} from "../../statuses/domain/statuses.entity";

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepositorySql: CommentsRepositorySql,
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepositorySql: UsersRepositoryRawsql,
    private readonly statusesRepositorySql: StatusesRepositorySql,
    private readonly statusesRepository: StatusesRepository,
    private readonly postsService: PostsService,
  ) {}

  async createComment(dto: CommentServiceDto): Promise<CommentOutputDto> {
    await this.postsService.existPostById(dto.postId);

    const commentEntity = new CommentsTable();

    commentEntity.content = dto.content;
    commentEntity.postId = dto.postId;
    commentEntity.userId = dto.userId;
    commentEntity.createdAt = new Date();

    const comment = await this.commentsRepository.createComment(commentEntity);

    return commentModelOutput(comment);
  }

  async updateCommentById(id: string, userId: string, dto: CommentInputDto) {
    const comment = await this.existComment(id);

    if (comment.userId !== userId) throw new ForbiddenException();

    await this.commentsRepositorySql.updateById_RAW(id, dto.content);
  }

  async deleteCommentById(id: string, userId: string) {
    const comment = await this.existComment(id);

    if (comment.userId !== userId) throw new ForbiddenException();

    await this.commentsRepositorySql.deleteById_RAW(id);
  }

  async createCommentStatus(
    id: string,
    userId: string,
    dto: PostLikeStatusDto,
  ) {
    await this.existComment(id);

    const commentStatus = new StatusesCommentsTable()

    commentStatus.userStatus = dto.likeStatus;
    commentStatus.userId = userId;
    commentStatus.addedAt = new Date();

    await this.statusesRepository.createStatus(commentStatus)
    // const newStatus = dto.likeStatus;
    //
    // const statusOfComment =
    //   await this.statusesRepositorySql.statusOfComment_RAW(userId, id);
    //
    // if (!statusOfComment) {
    //   await this.statusesRepositorySql.insertStatusOfComment_RAW(
    //     userId,
    //     id,
    //     newStatus,
    //   );
    //
    //   return;
    // }
    //
    // if (statusOfComment.userStatus === newStatus) return;
    //
    // await this.statusesRepositorySql.updateStatusForComment(
    //   userId,
    //   id,
    //   newStatus,
    // );
  }

  async existComment(id: string): Promise<CommentsTable> {
    const comment = await this.commentsRepository.getCommentById(id);

    if (!comment) throw new NotFoundException();

    return comment;
  }

  // async createLikeStatus(id: string, userId: string, dto: PostLikeStatusDto) {
  //   const commentDocument = await this.commentsRepository.findById(id);
  //
  //   if (!commentDocument) throw new NotFoundException();
  //
  //   const newStatus = dto.likeStatus;
  //
  //   const currentUser = commentDocument.usersStatuses.find(
  //       (e) => e.userId === userId,
  //   );
  //
  //   if (newStatus === 'None' && !currentUser) return;
  //
  //   if (newStatus === 'None' && currentUser) {
  //     if (currentUser.userStatus === 'Like') commentDocument.likesCount--;
  //
  //     if (currentUser.userStatus === 'Dislike') commentDocument.dislikesCount--;
  //
  //     commentDocument.usersStatuses = commentDocument.usersStatuses.filter(
  //         (e) => e.userId !== userId,
  //     );
  //
  //     await this.commentsRepository.save(commentDocument);
  //
  //     return;
  //   }
  //
  //   const userStatus = {
  //     userId: userId,
  //     userStatus: dto.likeStatus,
  //   };
  //
  //   const newStatusIsLike = newStatus === 'Like';
  //
  //   const newStatusIsDislike = newStatus === 'Dislike';
  //
  //   if (!currentUser) {
  //     if (newStatusIsLike) commentDocument.likesCount++;
  //
  //     if (newStatusIsDislike) commentDocument.dislikesCount++;
  //
  //     commentDocument.usersStatuses.push(userStatus);
  //
  //     await this.commentsRepository.save(commentDocument);
  //
  //     return;
  //   }
  //
  //   if (newStatusIsLike && currentUser.userStatus === 'Dislike') {
  //     commentDocument.likesCount++;
  //     commentDocument.dislikesCount--;
  //   }
  //
  //   if (newStatusIsDislike && currentUser.userStatus === 'Like') {
  //     commentDocument.likesCount--;
  //     commentDocument.dislikesCount++;
  //   }
  //
  //   commentDocument.usersStatuses = commentDocument.usersStatuses.map((e) =>
  //       e.userId === userId ? userStatus : e,
  //   );
  //
  //   await this.commentsRepository.save(commentDocument);
  //
  //   return;
  // }
}
