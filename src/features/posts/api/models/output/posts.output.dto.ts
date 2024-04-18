import { LikesUsers, PostDocument } from '../../../domain/posts.schema';
import { PostQuery } from '../input/posts.input.dto';

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
    public newestLikes?: NewestLikes[],
  ) {}
}

export class NewestLikes {
  constructor(
    public addedAt?: string,
    public userId?: string,
    public login?: string,
  ) {}
}

export const postsOutputDto = (
  postDocument: PostDocument,
  likesUsers?: LikesUsers,
) =>
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
      likesUsers?.userStatus,
      [
        new NewestLikes(
          likesUsers?.addedAt,
          likesUsers?.userId,
          likesUsers?.login,
        ),
      ],
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
) =>
  new PostsPaging(
    Math.ceil(totalPosts / +query.pageSize),
    +query.pageNumber,
    +query.pageSize,
    totalPosts,
    postDocuments.map((document) => postsOutputDto(document)),
  );
