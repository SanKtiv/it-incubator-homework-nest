import { LikesUsers, PostDocument } from '../../../domain/posts.schema';
import { PostQuery } from '../input/posts.input.dto';
import {PostsTable} from "../../../domain/posts.table";

export class PostsOutputDto {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public extendedLikesInfo: ExtendedLikesInfo,
  ) {}
}

export class ExtendedLikesInfo {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: 'None' | 'Like' | 'Dislike' = 'None',
    public newestLikes: NewestLikes[],
  ) {}
}

export class NewestLikes {
  constructor(
    public addedAt?: string,
    public userId?: string,
    public login?: string,
  ) {}
}

const myStatus = (postDocument: PostDocument, userId?: string) => {
  const likesUser = postDocument.likesUsers.find((e) => e.userId === userId);
  return likesUser ? likesUser.userStatus : 'None';
};

const newestLikes = (postDocument: PostDocument): NewestLikes[] => {
  return postDocument.likesUsers
    .filter((e) => e.userStatus === 'Like')
    .sort(
      (a: LikesUsers, b: LikesUsers) =>
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
    )
    .slice(0, 3)
    .map((e) => ({ userId: e.userId, login: e.login, addedAt: e.addedAt }));
};

export const postsOutputDto = (postDocument: PostDocument, userId?: string) =>
  new PostsOutputDto(
    postDocument._id.toString(),
    postDocument.title,
    postDocument.shortDescription,
    postDocument.content,
    postDocument.blogId,
    postDocument.blogName,
    postDocument.createdAt,
    new ExtendedLikesInfo(
      postDocument.likesCount,
      postDocument.dislikesCount,
      myStatus(postDocument, userId),
      newestLikes(postDocument),
    ),
  );

export const postsSqlOutputDto = (postDocument: PostsTable, userId?: string) =>
    new PostsOutputDto(
        postDocument.id,
        postDocument.title,
        postDocument.shortDescription,
        postDocument.content,
        postDocument.blogId,
        postDocument.blogName,
        postDocument.createdAt.toISOString(),
        new ExtendedLikesInfo(
            0,
            0,
            'Like',
            [],
        ),
    );

export class PostsPaging {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: PostsOutputDto[],
  ) {}
}
export const postsPaging = (
  query: PostQuery,
  totalPosts: number,
  postDocuments: PostDocument[],
  userId?: string,
) =>
  new PostsPaging(
    Math.ceil(totalPosts / +query.pageSize),
    +query.pageNumber,
    +query.pageSize,
    totalPosts,
    postDocuments.map((document) => postsOutputDto(document, userId)),
  );
