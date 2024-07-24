import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BlogsTable } from '../domain/blog.entity';

@Injectable()
export class BlogsSqlRepository {
  constructor(
    //protected dataSource: DataSource,
    @InjectRepository(BlogsTable)
    protected blogsRepository: Repository<BlogsTable>,
  ) {}

  async create(dto) {
    const blog: BlogsTable = {
      ...dto,
      createdAt: 'Date',
      isMembership: true,
    };
    return this.blogsRepository.save(blog);

    // return this.dataSource.transaction(async manager => {
    //     await manager.save(blog)
    // });
    // return this.dataSource.manager.save(BlogsTable, {
    //     ...dto,
    //     createdAt: 'Date',
    //     isMembership: true
    // })
  }

  // async create() {
  //     return this.dataSource.query(`
  //     CREATE TABLE IF NOT EXISTS blogs(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  //     `)
  // }
}
