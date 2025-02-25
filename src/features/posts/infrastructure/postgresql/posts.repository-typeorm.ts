import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostsInputDto } from '../../api/models/input/posts.input.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { PostsTable } from '../../domain/posts.table';
import { InputDto } from '../../../../infrastructure/models/input.dto';
import defineProperty = Reflect.defineProperty;

@Injectable()
export class PostsRepositoryTypeOrm {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostsTable) protected repository: Repository<PostsTable>,
  ) {}

  private get builder() {
    return this.repository.createQueryBuilder('p');
  }

  async create(dto: PostsTable): Promise<PostsTable> {
    return this.repository.save(dto);
  }

  async clear(): Promise<void> {
    await this.dataSource.query('TRUNCATE TABLE "posts" CASCADE');
  }

  async findById(id: string): Promise<PostsTable | null> {
    return this.repository.findOneBy({ id });
  }
}
