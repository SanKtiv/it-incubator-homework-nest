import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import {PostLikeStatusDto, PostsInputDto} from '../api/models/input/posts.input.dto';
import {LikesUsers, PostDocument} from '../domain/posts.schema';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import {
  PostsOutputDto,
  postsOutputDto,
} from '../api/models/output/posts.output.dto';
import {UsersRepository} from "../../users/infrastructure/users.repository";

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createPost(dto: PostsInputDto): Promise<PostsOutputDto> {
    const blogDocument = await this.blogsRepository.findById(dto.blogId);

    if (!blogDocument) throw new NotFoundException();

    const postDocument = await this.postsRepository.create(
      dto,
      blogDocument.name,
    );
    console.log('postDocument =', postDocument)
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

  async updateLikeStatus(id: string, dto: PostLikeStatusDto, userId: string): Promise<void> {
    const postDocument = await this.existPost(id);

    const userDocument = await this.usersRepository.findById(userId);

    const userLogin = userDocument!.accountData.login;

    const newStatus = dto.likeStatus

    const likeUser = {
      userStatus: newStatus,
      addedAt: new Date().toISOString(),
      userId: userId,
      login: userLogin
    }

    if (!postDocument.likesUsers.length) {
      if (newStatus === 'Like') postDocument.likesCount++;

      if (newStatus === 'Dislike') postDocument.dislikesCount++;

      postDocument.likesUsers.push(likeUser);

      await this.savePost(postDocument);

      return;
    }

    postDocument.likesUsers.
  }

  async deletePost(id: string): Promise<void | HttpException> {
    const result = await this.postsRepository.remove(id);

    if (!result) throw new NotFoundException();
  }
}
