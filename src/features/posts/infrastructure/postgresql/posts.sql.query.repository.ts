import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.schema';
import { PostQuery } from '../../api/models/input/posts.input.dto';
import {
  PostsOutputDto,
  postsOutputDto,
  PostsPaging,
  postsPaging,
  postsSqlOutputDto,
  postsSqlPaging,
} from '../../api/models/output/posts.output.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsTable } from '../../domain/posts.table';

@Injectable()
export class PostsSqlQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PostsTable);
  }

  async findById(id: string, userId?: string): Promise<PostsOutputDto> {
    // const postDocument = await this.repository.findOneBy({ id: id });

    const querySql = `
    SELECT p."id", p."content", p."title", p."shortDescription", p."blogId", p."blogName", p."createdAt",
        (SELECT COUNT(*)
        FROM "statuses" AS s
        WHERE p."id" = s."postId" AND s."userStatus" = 'Like'
        ) AS "likesCount",
        (SELECT COUNT(*)
        FROM "statuses" AS s
        WHERE p."id" = s."postId" AND s."userStatus" = 'Dislike'
        ) AS "dislikesCount",
        (SELECT s."userStatus"
        FROM "statuses" AS s
        WHERE p."id" = s."postId" AND s."userId" = $2
        ) AS "myStatus"
        FROM "posts" AS p
        WHERE p."id" = $1
    `
    const queryParams = [id, userId]

    const postDocument = await this.dataSource.query(querySql, queryParams)

    if (!postDocument) throw new NotFoundException();

    return postsSqlOutputDto(postDocument, userId);
  }

  async findPaging(
    query: PostQuery,
    dto: { userId?: string; blogId?: string },
  ): Promise<PostsPaging> {
    const filter = dto.blogId ? { blogId: dto.blogId } : {};

    //const totalPosts = await this.repository.countBy(filter);

    const posts = this.repository.createQueryBuilder('post');

    if (dto.blogId) {
      posts.where('post.blogId = :blogId', { blogId: dto.blogId });
    }

    const totalPosts = await posts.getCount();

    const postsPaging = await posts
      .orderBy(`post.${query.sortBy}`, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    return postsSqlPaging(query, totalPosts, postsPaging, dto.userId);
  }
}
