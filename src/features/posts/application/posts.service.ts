import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  PostLikeStatusDto,
  PostsInputDto,
} from '../api/models/input/posts.input.dto';
import {
  PostsOutputDto,
  postCreatedViewModel,
} from '../api/models/output/posts.output.dto';
import { BlogsService } from '../../blogs/application/blogs.service';
import { PostsRepositorySql } from '../infrastructure/postgresql/posts.repository-sql';
import { PostsTable } from '../domain/posts.table';
import { InputDto } from '../../../infrastructure/models/input.dto';
import { UsersRepositoryRawsql } from '../../users/infrastructure/postgresqldb/users.repository-rawsql';
import { StatusesRepositorySql } from '../../statuses/infrastructure/statuses.repository-sql';
import { CommentsRepositorySql } from '../../comments/infrastructure/postgresql/comments.repository-sql';
import { PostsRepository } from '../infrastructure/posts.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepositorySql: PostsRepositorySql,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepositorySql: UsersRepositoryRawsql,
    private readonly blogsService: BlogsService,
    private readonly statusesRepositorySql: StatusesRepositorySql,
    private readonly commentsRepositorySql: CommentsRepositorySql,
  ) {}

  async createPost(dto: PostsInputDto): Promise<PostsOutputDto> {
    const blog = await this.blogsService.existBlog(dto.blogId);

    const postEntity = new PostsTable();

    postEntity.blogId = blog.id;
    postEntity.title = dto.title;
    postEntity.content = dto.content;
    postEntity.shortDescription = dto.shortDescription;
    postEntity.createdAt = new Date();

    const post = await this.postsRepository.create(postEntity);

    const blogName = blog.name;

    return postCreatedViewModel({ ...post!, blogName });
  }

  async existPostById(id: string): Promise<PostsTable> {
    const post = await this.postsRepositorySql.findById_RAW(id);

    if (!post) throw new NotFoundException();

    return post;
  }

  async existPostByIdForBlogId(postId: string, blogId: string) {
    const post = await this.postsRepositorySql.findPostByIdWithBlogId(
      postId,
      blogId,
    );

    if (!post) throw new NotFoundException();

    return;
  }

  async updatePost(id: string, postUpdateDto: PostsInputDto) {
    await this.postsRepositorySql.updatePost_RAW(id, postUpdateDto);
  }

  async updatePostForBlog(postId: string, blogId: string, UpdateDto: InputDto) {
    // const postDocument = await this.postsRepository.findById(id);
    //
    // if (!postDocument) throw new NotFoundException();
    const post = await this.existPostById(postId);

    if (post!.blogId !== blogId) throw new NotFoundException();

    //Object.assign(post, UpdateDto);

    await this.postsRepositorySql.updatePost_RAW(postId, UpdateDto, blogId);
  }

  async createStatusForPost(
    id: string,
    dto: PostLikeStatusDto,
    userId: string,
  ): Promise<void> {
    await this.existPostById(id);

    const newStatus = dto.likeStatus;

    const statusesPost = await this.statusesRepositorySql.statusOfPost_RAW(
      userId,
      id,
    );

    if (!statusesPost) {
      await this.statusesRepositorySql.insertStatusForPost_RAW(
        userId,
        id,
        newStatus,
      );

      return;
    }

    if (statusesPost.userStatus === newStatus) return;

    await this.statusesRepositorySql.updateStatusForPost_RAW(
      userId,
      id,
      newStatus,
    );
  }

  async deletePostById(id: string): Promise<void> {
    const result = await this.postsRepositorySql.deleteById_RAW(id);

    if (result === 0) throw new NotFoundException();
  }

  async deletePostByIdForBlog(
    postId: string,
    blogId: string,
  ): Promise<void | HttpException> {
    await this.existPostByIdForBlogId(postId, blogId);

    await this.commentsRepositorySql.deleteByPostId_RAW(postId);

    await this.postsRepositorySql.deleteByIdAndBlogId_RAW(postId, blogId);
  }
}
