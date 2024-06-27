import { CommentDocument } from '../../../domain/comment.schema';
import { QueryDto } from '../../../../../infrastructure/models/query.dto';
import { PostDocument } from '../../../../posts/domain/posts.schema';

export class CommentOutputDto {
  constructor(
    public id: string,
    public content: string,
    public createdAt: string,
    public commentatorInfo: CommentatorInfo,
    public likesInfo: LikesInfo,
  ) {}
}

class CommentatorInfo {
  constructor(
    public userId: string,
    public userLogin: string,
  ) {}
}

class LikesInfo {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
  ) {}
}

const myStatus = (commentDocument: CommentDocument, userId?: string) => {
  const userStatus = commentDocument.usersStatuses.find(
    (e) => e.userId === userId,
  );
  return userStatus ? userStatus.userStatus : 'None';
};

export const commentOutputDto = (
  commentDocument: CommentDocument,
  userId?: string,
) =>
  new CommentOutputDto(
    commentDocument._id.toString(),
    commentDocument.content,
    commentDocument.createdAt,
    new CommentatorInfo(commentDocument.userId, commentDocument.userLogin),
    new LikesInfo(
      commentDocument.likesCount,
      commentDocument.dislikesCount,
      myStatus(commentDocument, userId),
    ),
  );

export class CommentsPagingDto {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: CommentOutputDto[],
  ) {}
}

export const commentsPagingDto = (
  query: QueryDto,
  totalComments: number,
  commentsDocument: CommentDocument[],
  userId?: string,
) =>
  new CommentsPagingDto(
    Math.ceil(totalComments / query.pageSize),
    query.pageNumber,
    query.pageSize,
    totalComments,
    commentsDocument.map((document) => commentOutputDto(document, userId)),
  );
