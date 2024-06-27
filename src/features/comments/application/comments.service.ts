import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import {
  CommentOutputDto,
  commentOutputDto,
} from '../api/models/output/comment.output.dto';
import { CommentServiceDto } from '../api/models/input/comment-service.dto';
import { CommentInputDto } from '../api/models/input/comment.input.dto';
import { PostLikeStatusDto } from '../../posts/api/models/input/posts.input.dto';
import { CommentDocument } from '../domain/comment.schema';
import { PostsService } from '../../posts/application/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly postsService: PostsService,
  ) {}

  async createComment(dto: CommentServiceDto): Promise<CommentOutputDto> {
    await this.postsService.existPost(dto.postId);

    const userDocument = await this.usersRepository.findById(dto.userId);

    dto.userLogin = userDocument!.accountData.login;

    const commentDocument = await this.commentsRepository.create(dto);

    return commentOutputDto(commentDocument);
  }

  async updateCommentById(id: string, userId: string, dto: CommentInputDto) {
    const commentDocument = await this.existComment(id);

    if (commentDocument.userId !== userId) throw new ForbiddenException();

    commentDocument.content = dto.content;

    await this.commentsRepository.save(commentDocument);
  }

  async removeCommentById(id: string, userId: string) {
    const commentDocument = await this.existComment(id);

    if (commentDocument.userId !== userId) throw new ForbiddenException();

    await this.commentsRepository.deleteById(id);
  }

  async createLikeStatus(id: string, userId: string, dto: PostLikeStatusDto) {
    const commentDocument = await this.commentsRepository.findById(id);

    if (!commentDocument) throw new NotFoundException();

    const newStatus = dto.likeStatus;

    const currentUser = commentDocument.usersStatuses.find(
      (e) => e.userId === userId,
    );

    if (newStatus === 'None' && !currentUser) return;

    if (newStatus === 'None' && currentUser) {
      if (currentUser.userStatus === 'Like') commentDocument.likesCount--;

      if (currentUser.userStatus === 'Dislike') commentDocument.dislikesCount--;

      commentDocument.usersStatuses = commentDocument.usersStatuses.filter(
        (e) => e.userId !== userId,
      );

      await this.commentsRepository.save(commentDocument);

      return;
    }

    const userStatus = {
      userId: userId,
      userStatus: dto.likeStatus,
    };

    const newStatusIsLike = newStatus === 'Like';

    const newStatusIsDislike = newStatus === 'Dislike';

    if (!currentUser) {
      if (newStatusIsLike) commentDocument.likesCount++;

      if (newStatusIsDislike) commentDocument.dislikesCount++;

      commentDocument.usersStatuses.push(userStatus);

      await this.commentsRepository.save(commentDocument);

      return;
    }

    if (newStatusIsLike && currentUser.userStatus === 'Dislike') {
      commentDocument.likesCount++;
      commentDocument.dislikesCount--;
    }

    if (newStatusIsDislike && currentUser.userStatus === 'Like') {
      commentDocument.likesCount--;
      commentDocument.dislikesCount++;
    }

    commentDocument.usersStatuses = commentDocument.usersStatuses.map((e) =>
      e.userId === userId ? userStatus : e,
    );

    await this.commentsRepository.save(commentDocument);

    return;
  }

  async existComment(id: string): Promise<CommentDocument> {
    const commentDocument = await this.commentsRepository.findById(id);

    if (!commentDocument) throw new NotFoundException();

    return commentDocument;
  }
}
