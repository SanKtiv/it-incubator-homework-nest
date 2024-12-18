import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BlogsTable } from '../../domain/blog.entity';
import { PostsTable } from '../../../posts/domain/posts.table';

@Injectable()
export class BlogsRepositorySql {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
    @InjectRepository(BlogsTable)
    protected blogsRepository: Repository<BlogsTable>,
  ) {}

  private get repository() {
    return this.dataSource.getRepository(BlogsTable);
  }

  async create_ORM(dto) {
    const blog: BlogsTable = {
      ...dto,
      createdAt: new Date(),
      isMembership: false,
    };
    return this.save(blog);
  }

  async save(blog: BlogsTable) {
    return this.blogsRepository.save(blog);
  }

  async findById_ORM(id: string): Promise<BlogsTable | null> {
    try {
      return this.blogsRepository.findOneBy({ id: id });
    } catch (e) {
      throw new Error('Error finding blog by blogId');
    }
  }

  async deleteOne_ORM(blog: BlogsTable): Promise<BlogsTable> {
    try {
      return this.blogsRepository.remove(blog);
    } catch (e) {
      throw new Error('Error DB');
    }
  }

  async deleteAll_ORM(): Promise<void> {
    await this.blogsRepository.clear();
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

  async create_RAW(dto, isMembership?: boolean): Promise<BlogsTable> {
    const createBlogQuery = `
    INSERT INTO public."blogs" ("name", "description", "websiteUrl", "createdAt", "isMembership")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`;

    const parameters = [
      dto.name,
      dto.description,
      dto.websiteUrl,
      new Date(),
      isMembership,
    ];

    const [createdRowsArray] = await this.dataSource.query(
      createBlogQuery,
      parameters,
    );

    return createdRowsArray;
  }

  async findById_RAW(id: string): Promise<BlogsTable | null> {
    const getBlogQuery = `
    SELECT b."id", b."name", b."description", b."websiteUrl", b."createdAt", b."isMembership"
    FROM "blogs" AS b
    WHERE b."id" = $1;`;

    try {
      const [blog] = await this.dataSource.query(getBlogQuery, [id]);

      return blog;
    } catch (e) {
      console.log(e);
    }
  }

  async countById_RAW(id: string) {
    const rawQuery = `SELECT COUNT (*) FROM "blogs" WHERE "id" = $1`;

    try {
      const countBlogs = await this.dataSource.query(rawQuery, [id]);

      return countBlogs[0].count;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async deleteOne_RAW(blog: BlogsTable): Promise<BlogsTable> {
    const deleteBlogQuery = `
    DELETE FROM "blogs" AS b
    WHERE b."id" = $1
    RETURNING *`;

    try {
      const [deletedBlogArray] = await this.dataSource.query(deleteBlogQuery, [
        blog.id,
      ]);

      return deletedBlogArray;
    } catch (e) {
      throw new Error('Error DB');
    }
  }

  async deleteAll_RAW() {
    await this.dataSource.query(`TRUNCATE "blogs" CASCADE`);
  }
}
