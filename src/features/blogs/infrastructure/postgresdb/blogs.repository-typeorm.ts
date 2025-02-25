import { Injectable} from '@nestjs/common';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BlogsTable } from '../../domain/blog.entity';
import { BlogsInputDto } from '../../api/models/input/blogs.input.dto';

@Injectable()
export class BlogsRepositoryTypeOrm {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
    @InjectRepository(BlogsTable)
    protected repository: Repository<BlogsTable>,
  ) {}

  async create(dto: BlogsTable): Promise<BlogsTable> {
    return this.repository.save(dto);
  }

  async findById(id: string): Promise<BlogsTable | null> {
    return this.repository.findOneBy({ id });
  }

  async updateById(
    id: string,
    inputUpdate: BlogsInputDto,
  ): Promise<UpdateResult> {
    return this.repository.update({ id }, inputUpdate);
  }

  async deleteOne(id: string): Promise<UpdateResult | void> {
    try {
      return this.repository.softDelete({ id });
    } catch (e) {
      console.log(e);
    }
  }

  async clear(): Promise<void> {
    await this.dataSource.query('TRUNCATE TABLE "blogs" CASCADE');
  }
}
