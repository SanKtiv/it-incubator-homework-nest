import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import {
  PostLikeStatusDto,
  PostsInputDto,
} from '../api/models/input/posts.input.dto';
import { PostDocument } from '../domain/posts.schema';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import {
  PostsOutputDto,
  postsOutputDto,
} from '../api/models/output/posts.output.dto';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import {BlogsService} from "../../blogs/application/blogs.service";

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly blogsService: BlogsService
  ) {}

  async createPost(dto: PostsInputDto): Promise<PostsOutputDto> {
    const blogDocument = await this.blogsService.existBlog(dto.blogId);

    const postDocument = await this.postsRepository.create(
      dto,
      blogDocument.name,
    );

    return postsOutputDto(postDocument);
  }

  async savePost(postDocument: PostDocument): Promise<PostDocument> {
    return this.postsRepository.save(postDocument);
  }

  async existPost(id: string): Promise<PostDocument> {
    const postDocument = await this.postsRepository.findById(id);

    if (!postDocument) throw new NotFoundException();

    return postDocument;
  }

  async updatePost(id: string, postUpdateDto: PostsInputDto) {
    // const postDocument = await this.postsRepository.findById(id);
    //
    // if (!postDocument) throw new NotFoundException();
    const postDocument = await this.existPost(id);

    Object.assign(postDocument, postUpdateDto);

    await this.postsRepository.save(postDocument);
  }

  async updateLikeStatus(
    id: string,
    dto: PostLikeStatusDto,
    userId: string,
  ): Promise<void> {
    const postDocument = await this.existPost(id);

    const userDocument = await this.usersRepository.findById(userId);

    const userLogin = userDocument!.accountData.login;

    const newStatus = dto.likeStatus;

    const newStatusIsLike = newStatus === 'Like';

    const newStatusIsDislike = newStatus === 'Dislike';

    const currentUser = postDocument.likesUsers.find(
      (e) => e.userId === userId,
    );

    if (newStatus === 'None' && !currentUser) return;

    if (newStatus === 'None' && currentUser) {
      if (currentUser.userStatus === 'Like') postDocument.likesCount--;

      if (currentUser.userStatus === 'Dislike') postDocument.dislikesCount--;

      postDocument.likesUsers = postDocument.likesUsers.filter(
        (e) => e.userId !== userId,
      );

      await this.postsRepository.save(postDocument);

      return;
    }

    const likeUser = {
      userStatus: newStatus,
      addedAt: new Date().toISOString(),
      userId: userId,
      login: userLogin,
    };

    if (!currentUser) {
      if (newStatusIsLike) postDocument.likesCount++;

      if (newStatusIsDislike) postDocument.dislikesCount++;

      postDocument.likesUsers.push(likeUser);

      await this.postsRepository.save(postDocument);

      return;
    }

    if (newStatusIsLike && currentUser.userStatus === 'Dislike') {
      postDocument.likesCount++;
      postDocument.dislikesCount--;
    }

    if (newStatusIsDislike && currentUser.userStatus === 'Like') {
      postDocument.likesCount--;
      postDocument.dislikesCount++;
    }

    postDocument.likesUsers = postDocument.likesUsers.map((e) =>
      e.userId === userId ? likeUser : e,
    );

    await this.postsRepository.save(postDocument);

    return;
  }

  async deletePost(id: string): Promise<void | HttpException> {
    const result = await this.postsRepository.remove(id);

    if (!result) throw new NotFoundException();
  }
}
