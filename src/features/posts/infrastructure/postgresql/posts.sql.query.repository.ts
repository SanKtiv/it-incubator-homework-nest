import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.schema';
import { PostQuery } from '../../api/models/input/posts.input.dto';
import {
  PostsOutputDto,
  postsOutputDto,
  PostsPaging,
  postsPaging, postsSqlOutputDto, postsSqlPaging,
} from '../../api/models/output/posts.output.dto';
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {PostsTable} from "../../domain/posts.table";


@Injectable()
export class PostsSqlQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PostsTable)
  }

  async findById(id: string, userId?: string): Promise<PostsOutputDto> {
    const postDocument = await this.repository.findOneBy({id: id});

    if (!postDocument) throw new NotFoundException();

    return postsSqlOutputDto(postDocument, userId);
  }

  async findPaging(
    query: PostQuery,
    dto: { userId?: string; blogId?: string },
  ): Promise<PostsPaging> {
    const filter = dto.blogId ? { blogId: dto.blogId } : {};

    const totalPosts = await this.repository.countBy(filter);

    const posts = await this.repository
        .createQueryBuilder('post')
        .where('post.blogId = blogId', {blogId: dto.blogId})
        .orderBy(`post.${query.sortBy}`, query.sortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .take(query.pageSize)
        .getMany();

    return postsSqlPaging(query, totalPosts, posts, dto.userId);
  }
}
