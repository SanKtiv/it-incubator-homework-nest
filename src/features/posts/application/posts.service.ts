import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/mongodb/posts.repository';
import {
  PostLikeStatusDto,
  PostsInputDto,
} from '../api/models/input/posts.input.dto';
import { BlogsRepository } from '../../blogs/infrastructure/mongodb/blogs.repository';
import {
    postOutputModelFromSql,
    PostsOutputDto,
    postsOutputDto,
    postsSqlOutputDto,
} from '../api/models/output/posts.output.dto';
import { UsersRepository } from '../../users/infrastructure/mongodb/users.repository';
import { BlogsService } from '../../blogs/application/blogs.service';
import { PostsSqlRepository } from '../infrastructure/postgresql/posts.sql.repository';
import { BlogsSqlRepository } from '../../blogs/infrastructure/postgresdb/blogs.sql.repository';
import { PostsTable } from '../domain/posts.table';
import { InputDto } from '../../../infrastructure/models/input.dto';
import {UsersSqlRepository} from "../../users/infrastructure/postgresqldb/users.sql.repository";
import {StatusesSqlRepository} from "../../statuses/infrastructure/statuses.sql.repository";

@Injectable()
export class PostsService {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly postsSqlRepository: PostsSqlRepository,
        private readonly blogsRepository: BlogsRepository,
        //private readonly blogsSqlRepository: BlogsSqlRepository,
        private readonly usersRepository: UsersRepository,
        private readonly usersSqlRepository: UsersSqlRepository,
        private readonly blogsService: BlogsService,
        private readonly statusesSqlRepository: StatusesSqlRepository,
    ) {
    }

    async createPost(dto: PostsInputDto): Promise<PostsOutputDto> {
        await this.blogsService.existBlog(dto.blogId);

        const postDocument = await this.postsSqlRepository.createRaw(dto);

        return postOutputModelFromSql(postDocument)[0];
    }

    async existPost(id: string): Promise<PostsTable> {
        const postDocument = await this.postsSqlRepository.findById(id);

        if (!postDocument) throw new NotFoundException();

        return postDocument;
    }

    async updatePost(id: string, postUpdateDto: PostsInputDto) {
        // const postDocument = await this.postsRepository.findById(id);
        //
        // if (!postDocument) throw new NotFoundException();
        const postDocument = await this.existPost(id);

        Object.assign(postDocument, postUpdateDto);

        await this.postsSqlRepository.savePost(postDocument);
    }

    async updatePostForBlog(postId: string, blogId: string, UpdateDto: InputDto) {
        // const postDocument = await this.postsRepository.findById(id);
        //
        // if (!postDocument) throw new NotFoundException();
        const post = await this.existPost(postId);

        if (post.blogId !== blogId) throw new NotFoundException();

        Object.assign(post, UpdateDto);

        await this.postsSqlRepository.savePost(post);
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

    async createStatusForPost(id: string, dto: PostLikeStatusDto, userId: string,): Promise<void> {
        await this.existPost(id);

        const newStatus = dto.likeStatus;

        const currentStatus = await this.statusesSqlRepository
            .getCurrentStatusOfPost(userId, id)

        if (!currentStatus) {
            if (newStatus === 'None') return;

            await this.statusesSqlRepository
                .insertStatusForPost(userId, id, newStatus)
        }

        await this.statusesSqlRepository
            .updateStatusForPost(userId, id, newStatus)
    }

    async deletePostById(id: string): Promise<void> {
        const result = await this.postsRepository.remove(id);

        if (!result) throw new NotFoundException();
    }

    async deletePostByIdForBlog(postId: string, blogId: string,): Promise<void | HttpException> {
        const post = await this.existPost(postId);

        if (post.blogId !== blogId) throw new NotFoundException();

        await this.postsSqlRepository.deletePost(post);
    }
}
