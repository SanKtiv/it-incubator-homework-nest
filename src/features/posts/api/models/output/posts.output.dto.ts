import { LikesUsers, PostDocument } from '../../../domain/posts.schema';
import { PostQuery } from '../input/posts.input.dto';
import { PostsTable } from '../../../domain/posts.table';

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

export const postCreatedViewModel = (
  post: PostsTable & { blogName: string },
): PostsOutputDto => ({
  id: post.id,
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  createdAt: post.createdAt.toISOString(),
  blogId: post.blogId,
  blogName: post.blogName,
  extendedLikesInfo: {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: 'None',
    newestLikes: [],
  },
});

export function postsModelOutput(posts: any[]): PostsOutputDto[] {
  const outputModel: any = [];

  posts.map((post) =>
    outputModel.find((e) => e.id && e.id === post.id)
      ? outputModel
      : outputModel.push({
          id: post.id,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt.toISOString(),
          extendedLikesInfo: {
            likesCount: post.likesCount ?? 0,
            dislikesCount: post.dislikesCount ?? 0,
            myStatus: post.myStatus ?? 'None',
            newestLikes: [],
          },
        }),
  );

  posts.map((post) =>
    outputModel.map((model) =>
      model.id === post.id && post.userId
        ? model.extendedLikesInfo.newestLikes.push({
            userId: post.userId,
            login: post.login,
            addedAt: post.addedAt,
          })
        : model,
    ),
  );

  outputModel.map((model) =>
    model.extendedLikesInfo.newestLikes
      .sort((a: any, b: any) => b.addedAt - a.addedAt)
      .map((e) => e.addedAt.toISOString() ?? e),
  );

  return outputModel;
}

export const postsPagingModelOutput = (
  query: PostQuery,
  totalPosts: number,
  postsPaging: any[],
): PostsPaging => ({
  pagesCount: Math.ceil(totalPosts / +query.pageSize),
  page: +query.pageNumber,
  pageSize: +query.pageSize,
  totalCount: +totalPosts,
  items: postsModelOutput(postsPaging),
});

export function postViewModel_SQL(postFromSQL): PostsOutputDto[] {
  const resultArray: PostsOutputDto[] = [];

  postFromSQL.forEach((row) =>
    resultArray.find((i) => i.id && i.id === row.id)
      ? resultArray
      : resultArray.push({
          id: row.id,
          title: row.title,
          shortDescription: row.shortDescription,
          content: row.content,
          blogId: row.blogId,
          blogName: row.blogName,
          createdAt: row.createdAt.toISOString(),
          extendedLikesInfo: {
            likesCount: row.likesCount ? +row.likesCount : 0,
            dislikesCount: row.dislikesCount ? +row.dislikesCount : 0,
            myStatus: row.myStatus ? row.myStatus : 'None',
            newestLikes: [],
          },
        }),
  );

  resultArray.forEach((post) =>
    postFromSQL.forEach((row) =>
      post.id === row.id
        ? post.extendedLikesInfo.newestLikes.push({
            userId: row.userId,
            login: row.login,
            addedAt: row.addedAt.toISOString(),
          })
        : post,
    ),
  );

  return resultArray;
}

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

export const postsPagingViewModel_SQL = (
  query: PostQuery,
  totalPosts: number,
  postDocuments: any[],
) =>
  new PostsPaging(
    Math.ceil(totalPosts / +query.pageSize),
    +query.pageNumber,
    +query.pageSize,
    +totalPosts,
    postViewModel_SQL(postDocuments),
  );
