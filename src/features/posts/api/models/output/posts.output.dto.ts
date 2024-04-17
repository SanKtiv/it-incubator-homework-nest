import { LikesUsers, PostDocument } from '../../../domain/posts.schema';

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
      [new NewestLikes(
        likesUsers?.addedAt,
        likesUsers?.userId,
        likesUsers?.login,
      )],
    ),
  );
