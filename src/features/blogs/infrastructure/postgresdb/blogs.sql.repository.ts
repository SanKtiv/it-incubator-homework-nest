import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BlogsTable } from '../../domain/blog.entity';
import {BlogDocument} from "../../domain/blogs.schema";

@Injectable()
export class BlogsSqlRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  private get repository() {
    return this.dataSource.getRepository(BlogsTable)
  }

  async create(dto) {
    const blog: BlogsTable = {
      ...dto,
      createdAt: new Date(),
      isMembership: false,
    };
    return this.save(blog);
  }

  async save(blog: BlogsTable) {
    return this.repository.save(blog)
  }

  async findById(id: string): Promise<BlogsTable | null> {
    try {
      return this.repository.findOneBy({id: id});
    } catch (e) {
      throw new Error('Error finding blog by blogId');
    }
  }

  async deleteOne(blog: BlogsTable): Promise<BlogsTable> {
    try {
      return this.repository.remove(blog);
    } catch (e) {
      throw new Error('Error DB');
    }
  }

  async deleteAll(): Promise<void> {
    await this.repository.clear();
  }

  // async create() {
  //     return this.dataSource.query(`
  //     CREATE TABLE IF NOT EXISTS blogs(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  //     `)
  // }
}
