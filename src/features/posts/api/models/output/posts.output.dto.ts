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

// export const postCreatedViewModel = (post: PostsTable):PostsOutputDto  => ({
//     id: post.id,
//
// })


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
