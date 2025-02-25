import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostsTable } from '../../domain/posts.table';

@Injectable()
export class PostsRepositoryTypeOrm {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostsTable) protected repository: Repository<PostsTable>,
  ) {}

  async create(dto: PostsTable): Promise<PostsTable> {
    return this.repository.save(dto);
  }

  async clear(): Promise<void> {
    await this.repository.query('TRUNCATE TABLE "posts" CASCADE');
  }

  async findById(id: string): Promise<PostsTable | null> {
    return this.repository.findOneBy({ id });
  }
}
