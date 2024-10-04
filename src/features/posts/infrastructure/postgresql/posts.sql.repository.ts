import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/posts.schema';
import { PostsInputDto } from '../../api/models/input/posts.input.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsTable } from '../../domain/posts.table';

@Injectable()
export class PostsSqlRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PostsTable);
  }

  async create(inputDto: PostsInputDto, blogName: string): Promise<PostsTable> {
    const postDocument = {
      ...inputDto,
      blogName: blogName,
      createdAt: new Date(),
    };
    return this.repository.save(postDocument);
  }

  async findById(id: string): Promise<PostsTable | null> {
    return this.repository.findOneBy({ id: id });
  }

  async savePost(postDocument: PostsTable): Promise<PostsTable> {
    return this.repository.save(postDocument);
  }

  async updateStatus(status: string, postId: string) {
    const querySql = `
        UPDATE "posts" AS p
        SET p."userStatus" = $1
        WHERE status."userId" = $2 AND status."postId" = $3
        `
    const queryParams = [status, postId]

    try {
      await this.dataSource.query(querySql, queryParams)
    }
    catch (e) {
      throw new InternalServerErrorException()
    }
  }

  async deletePost(post: PostsTable): Promise<void> {
    await this.repository.remove(post);
  }

  async deleteAll(): Promise<void> {
    await this.repository.clear();
    //await this.dataSource.getRepository(PostsTable);
  }
}
