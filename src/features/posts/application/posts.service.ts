import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepositoryMongo } from '../infrastructure/mongodb/posts.repository-mongo';
import {
  PostLikeStatusDto,
  PostsInputDto,
} from '../api/models/input/posts.input.dto';
import { BlogsRepositoryMongo } from '../../blogs/infrastructure/mongodb/blogs.repository-mongo';
import {
  postOutputModelFromSql,
  PostsOutputDto,
  postsOutputDto,
  postsSqlOutputDto,
} from '../api/models/output/posts.output.dto';
import { UsersRepositoryMongo } from '../../users/infrastructure/mongodb/users.repository-mongo';
import { BlogsService } from '../../blogs/application/blogs.service';
import { PostsRepositorySql } from '../infrastructure/postgresql/posts.repository-sql';
import { BlogsRepositorySql } from '../../blogs/infrastructure/postgresdb/blogs.repository-sql';
import { PostsTable } from '../domain/posts.table';
import { InputDto } from '../../../infrastructure/models/input.dto';
import { UsersRepositorySql } from '../../users/infrastructure/postgresqldb/users.repository-sql';
import { StatusesRepositorySql } from '../../statuses/infrastructure/statuses.repository-sql';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepositoryMongo,
    private readonly postsRepositorySql: PostsRepositorySql,
    private readonly blogsRepository: BlogsRepositoryMongo,
    //private readonly blogsSqlRepository: BlogsRepositorySql,
    private readonly usersRepository: UsersRepositoryMongo,
    private readonly usersSqlRepository: UsersRepositorySql,
    private readonly blogsService: BlogsService,
    private readonly statusesRepositorySql: StatusesRepositorySql,
  ) {}

  async createPost(dto: PostsInputDto): Promise<PostsOutputDto> {
    await this.blogsService.existBlog(dto.blogId);

    const postDocument = await this.postsRepositorySql.create_RAW(dto);

    return postOutputModelFromSql(postDocument)[0];
  }

  async existPost(id: string): Promise<PostsTable> {
    const postDocument = await this.postsRepositorySql.findById_RAW(id);

    if (!postDocument) throw new NotFoundException();

    return postDocument;
  }

  async updatePost(id: string, postUpdateDto: PostsInputDto) {
    // const postDocument = await this.postsRepository.findById(id);
    //
    // if (!postDocument) throw new NotFoundException();
    const postDocument = await this.existPost(id);

    Object.assign(postDocument, postUpdateDto);

    await this.postsRepositorySql.updatePost_RAW(id, postUpdateDto);
  }

  async updatePostForBlog(postId: string, blogId: string, UpdateDto: InputDto) {
    // const postDocument = await this.postsRepository.findById(id);
    //
    // if (!postDocument) throw new NotFoundException();
    const post = await this.existPost(postId);

    if (post!.blogId !== blogId) throw new NotFoundException();

    //Object.assign(post, UpdateDto);

    await this.postsRepositorySql.updatePost_RAW(postId, UpdateDto, blogId);
  }

  // async createStatusForPost(
  //   id: string,
  //   dto: PostLikeStatusDto,
  //   userId: string,
  // ): Promise<void> {
  //   const postDocument = await this.existPost(id);
  //
  //   const userDocument = await this.usersRepository.findById(userId);
  //
  //   const userLogin = userDocument!.accountData.login;
  //
  //   const newStatus = dto.likeStatus;
  //
  //   const newStatusIsLike = newStatus === 'Like';
  //
  //   const newStatusIsDislike = newStatus === 'Dislike';
  //
  //   const currentUser = postDocument.likesUsers.find(
  //     (e) => e.userId === userId,
  //   );
  //
  //   if (newStatus === 'None' && !currentUser) return;
  //
  //   if (newStatus === 'None' && currentUser) {
  //     if (currentUser.userStatus === 'Like') postDocument.likesCount--;
  //
  //     if (currentUser.userStatus === 'Dislike') postDocument.dislikesCount--;
  //
  //     postDocument.likesUsers = postDocument.likesUsers.filter(
  //       (e) => e.userId !== userId,
  //     );
  //
  //     await this.postsRepository.save(postDocument);
  //
  //     return;
  //   }
  //
  //   const likeUser = {
  //     userStatus: newStatus,
  //     addedAt: new Date().toISOString(),
  //     userId: userId,
  //     login: userLogin,
  //   };
  //
  //   if (!currentUser) {
  //     if (newStatusIsLike) postDocument.likesCount++;
  //
  //     if (newStatusIsDislike) postDocument.dislikesCount++;
  //
  //     postDocument.likesUsers.push(likeUser);
  //
  //     await this.postsRepository.save(postDocument);
  //
  //     return;
  //   }
  //
  //   if (newStatusIsLike && currentUser.userStatus === 'Dislike') {
  //     postDocument.likesCount++;
  //     postDocument.dislikesCount--;
  //   }
  //
  //   if (newStatusIsDislike && currentUser.userStatus === 'Like') {
  //     postDocument.likesCount--;
  //     postDocument.dislikesCount++;
  //   }
  //
  //   postDocument.likesUsers = postDocument.likesUsers.map((e) =>
  //     e.userId === userId ? likeUser : e,
  //   );
  //
  //   await this.postsRepository.save(postDocument);
  //
  //   return;
  // }

  async createStatusForPost(
    id: string,
    dto: PostLikeStatusDto,
    userId: string,
  ): Promise<void> {
    await this.existPost(id);

    const newStatus = dto.likeStatus;

    const statusesPost =
      await this.statusesRepositorySql.statusOfPost(userId, id);

    if (!statusesPost) {
      await this.statusesRepositorySql.insertStatusForPost(
        userId,
        id,
        newStatus,
      );

      return;
    }

    if (statusesPost.userStatus === newStatus) return;

    await this.statusesRepositorySql.updateStatusForPost(userId, id, newStatus);
  }

  async deletePostById(id: string): Promise<void> {
    const result = await this.postsRepository.remove(id);

    if (!result) throw new NotFoundException();
  }

  async deletePostByIdForBlog(
    postId: string,
    blogId: string,
  ): Promise<void | HttpException> {
    const post = await this.existPost(postId);

    if (post.blogId !== blogId) throw new NotFoundException();

    await this.postsRepositorySql.deletePost(post);
  }
}
