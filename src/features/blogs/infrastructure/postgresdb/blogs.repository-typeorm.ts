import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BlogsTable } from '../../domain/blog.entity';
import { PostsTable } from '../../../posts/domain/posts.table';
import { BlogsInputDto } from '../../api/models/input/blogs.input.dto';
import { BlogsServicesDto } from '../../api/models/input/blogs.services.dto';

@Injectable()
export class BlogsRepositoryTypeOrm {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
    @InjectRepository(BlogsTable)
    protected repository: Repository<BlogsTable>,
  ) {}

  private get builder() {
    return this.dataSource.createQueryBuilder();
  }

  async createBlog(dto: BlogsTable): Promise<BlogsTable> {
    return this.repository.save(dto);
  }

  async save(blog: BlogsTable) {
    return this.repository.save(blog);
  }

  async findById(id: string): Promise<BlogsTable | null | undefined> {
    try {
      return this.repository.findOneBy({ id });
    } catch (e) {
      console.log(e);
    }
  }

  async updateBlogById(
    id: string,
    inputUpdate: BlogsInputDto,
  ): Promise<UpdateResult> {
    return this.repository.update({ id }, inputUpdate);
  }

  async deleteOne(id: string): Promise<UpdateResult> {
    return this.repository.softDelete({ id });
  }

  async deleteAll(): Promise<void> {
    await this.dataSource.query('TRUNCATE TABLE "blogs" CASCADE');
  }
}
