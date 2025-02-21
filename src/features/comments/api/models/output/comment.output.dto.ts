import { CommentDocument } from '../../../domain/comment.schema';
import { QueryDto } from '../../../../../infrastructure/models/query.dto';
import { PostDocument } from '../../../../posts/domain/posts.schema';
import { CommentsTable } from '../../../domain/comments.entity';
import { PostQuery } from '../../../../posts/api/models/input/posts.input.dto';
import {
  postViewModel_SQL,
  PostsOutputDto,
  PostsPaging,
} from '../../../../posts/api/models/output/posts.output.dto';

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

export const commentModelOutput = (comment: CommentsTable | any, userId?: string) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt.toISOString(),
  commentatorInfo: {
    userId: comment.userId,
    userLogin: comment.userLogin,
  },
  likesInfo: {
    likesCount: comment.likesCount ?? 0,
    dislikesCount: comment.dislikesCount ?? 0,
    myStatus: comment.myStatus ?? 'None',
  },
});

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

export class CommentOutputSqlModel {
  public id: string;
  public content: string;
  public createdAt: Date;
  public userId: string;
  public userLogin: string;
  public likesCount: number;
  public dislikesCount: number;
  public myStatus: string;
}

export const commentOutputModelRawSql = (comment: any): CommentOutputDto => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt.toISOString(),
  commentatorInfo: {
    userId: comment.userId,
    userLogin: comment.userLogin,
  },
  likesInfo: {
    likesCount: comment.likesCount ? Number(comment.likesCount) : 0,
    dislikesCount: comment.dislikesCount ? Number(comment.dislikesCount) : 0,
    myStatus: comment.myStatus || 'None',
  },
});

export const commentsSqlPaging = (
  query: QueryDto,
  totalComments: number,
  commentsArray: any[],
) =>
  new CommentsPagingDto(
    Math.ceil(totalComments / +query.pageSize),
    +query.pageNumber,
    +query.pageSize,
    +totalComments,
    commentOutputModelFromSql(commentsArray),
  );

export function commentOutputModelFromSql(commentsArray): CommentOutputDto[] {
  const resultArray: CommentOutputDto[] = [];

  commentsArray.forEach((row) =>
    resultArray.push({
      id: row.id,
      content: row.content,
      commentatorInfo: {
        userId: row.userId,
        userLogin: row.userLogin,
      },
      createdAt: row.createdAt.toISOString(),
      likesInfo: {
        likesCount: row.likesCount ? Number(row.likesCount) : 0,
        dislikesCount: row.dislikesCount ? Number(row.dislikesCount) : 0,
        myStatus: row.myStatus ? row.myStatus : 'None',
      },
    }),
  );

  return resultArray;
}
