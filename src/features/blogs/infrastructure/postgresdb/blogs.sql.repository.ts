import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BlogsTable, ForBlogsTable } from '../../domain/blog.entity';
import { BlogDocument } from '../../domain/blogs.schema';
import { PostsTable } from '../../../posts/domain/posts.table';

@Injectable()
export class BlogsSqlRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  private get repository() {
    return this.dataSource.getRepository(BlogsTable);
  }

  // async create(dto) {
  //   const blog: BlogsTable = {
  //     ...dto,
  //     createdAt: new Date(),
  //     isMembership: false,
  //   };
  //   return this.save(blog);
  // }

  async save(blog: BlogsTable) {
    return this.repository.save(blog);
  }

  // async findById(id: string): Promise<BlogsTable | null> {
  //   try {
  //     return this.repository.findOneBy({ id: id });
  //   } catch (e) {
  //     throw new Error('Error finding blog by blogId');
  //   }
  // }

  // async deleteOne(blog: BlogsTable): Promise<BlogsTable> {
  //   try {
  //     return this.repository.remove(blog);
  //   } catch (e) {
  //     throw new Error('Error DB');
  //   }
  // }

  async deleteAll(): Promise<void> {
    await this.repository.clear();
  }

  async createForBlog(name: string, blogId: string) {
    // const blog = await this.findById(blogId)
    //
    // await this.dataSource.getRepository(ForBlogsTable)
    //     .save({name: name, forBlog: blog!})

    return (
      this.dataSource
        .getRepository(BlogsTable)
        .createQueryBuilder('b')
        //.select(['b', 'f.id AS forid'])
        .leftJoinAndSelect(PostsTable, 'f', 'b.name = f.blogId')
        //.addSelect(['f.id AS forid', 'f.name AS forname'])
        .select(['b.*', 'f.title'])
        .getRawMany()
    );

    // return this.dataSource.query(`
    //   SELECT b.*, f."title"
    //   FROM "blogs" as b
    //   LEFT JOIN "posts" as f
    //   ON b."id" = f."blogId";`
    // )
  }

  async create(dto): Promise<BlogsTable> {
    console.log('Create Blog');
    const query = `
    INSERT INTO public."blogs" ("name", "description", "websiteUrl", "createdAt")
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;

    const queryParams = [dto.name, dto.description, dto.websiteUrl, new Date()];

    const createdRowsArray = await this.dataSource.query(query, queryParams);

    return createdRowsArray[0];
  }

  async findById(id: string): Promise<BlogsTable | null> {
    const query = `
    SELECT b."id", b."name", b."description", b."websiteUrl", b."createdAt", b."isMembership"
    FROM "blogs" AS b
    WHERE b."id" = $1;`;

    try {
      const foundBlogArray = await this.dataSource.query(query, [id]);

      return foundBlogArray[0];
    } catch (e) {
      throw new Error('Error finding blog by blogId');
    }
  }

  async countById(id: string) {
    const queryRaw = `SELECT COUNT (*) FROM "blogs" WHERE "id" = $1`;

    try {
      const countBlogs = await this.dataSource.query(queryRaw, [id]);

      return countBlogs[0].count;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async deleteOne(blog: BlogsTable): Promise<BlogsTable> {
    const query = `
    DELETE FROM "blogs" AS b
    WHERE b."id" = $1
    RETURNING *`;

    try {
      const deletedBlogArray = await this.dataSource.query(query, [blog.id]);

      return deletedBlogArray[0];
    } catch (e) {
      throw new Error('Error DB');
    }
  }
}
