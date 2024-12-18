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
  commentOutputDto,
  sqlCommentOutputDto,
} from '../api/models/output/comment.output.dto';
import { CommentServiceDto } from '../api/models/input/comment-service.dto';
import { CommentInputDto } from '../api/models/input/comment.input.dto';
import { PostLikeStatusDto } from '../../posts/api/models/input/posts.input.dto';
import { CommentDocument } from '../domain/comment.schema';
import { PostsService } from '../../posts/application/posts.service';
import { UsersRepositorySql } from '../../users/infrastructure/postgresqldb/users.repository-sql';
import { CommentsRepositorySql } from '../infrastructure/postgresql/comments.repository-sql';
import { StatusesRepositorySql } from '../../statuses/infrastructure/statuses.repository-sql';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepositoryMongo,
    private readonly commentsRepositorySql: CommentsRepositorySql,
    private readonly postsRepository: PostsRepositoryMongo,
    private readonly usersRepository: UsersRepositoryMongo,
    private readonly usersRepositorySql: UsersRepositorySql,
    private readonly statusesRepositorySql: StatusesRepositorySql,
    private readonly postsService: PostsService,
  ) {}

  async createComment(dto: CommentServiceDto): Promise<CommentOutputDto> {
    await this.postsService.existPostById(dto.postId);

    //const user = await this.usersRepositorySql.findById_RAW(dto.userId);

    //if (user) dto.userLogin = user.login;
    // dto.userLogin = userDocument!.accountData.login; for mongo

    const commentDocument = await this.commentsRepositorySql.create_RAW(dto);

    return sqlCommentOutputDto(commentDocument);
  }

  async updateCommentById(id: string, userId: string, dto: CommentInputDto) {
    const commentDocument = await this.existComment(id);

    if (commentDocument.userId !== userId) throw new ForbiddenException();

    await this.commentsRepositorySql.updateById_RAW(id, dto.content);
    // commentDocument.content = dto.content;
    //
    // await this.commentsRepository.save(commentDocument);
  }

  async deleteCommentById(id: string, userId: string) {
    const commentDocument = await this.existComment(id);

    if (commentDocument.userId !== userId) throw new ForbiddenException();

    await this.commentsRepositorySql.deleteById_RAW(id);
  }

  async createStatusOfComment(
    id: string,
    userId: string,
    dto: PostLikeStatusDto,
  ) {
    await this.existComment(id);

    const newStatus = dto.likeStatus;

    const statusOfComment = await this.statusesRepositorySql.statusOfComment(
      userId,
      id,
    );

    if (!statusOfComment) {
      await this.statusesRepositorySql.insertStatusOfComment(
        userId,
        id,
        newStatus,
      );

      return;
    }

    if (statusOfComment.userStatus === newStatus) return;

    await this.statusesRepositorySql.updateStatusForComment(
      userId,
      id,
      newStatus,
    );
  }

  async existComment(id: string): Promise<CommentDocument> {
    const commentDocument = await this.commentsRepositorySql.findById_RAW(id);

    if (!commentDocument) throw new NotFoundException();

    return commentDocument;
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
