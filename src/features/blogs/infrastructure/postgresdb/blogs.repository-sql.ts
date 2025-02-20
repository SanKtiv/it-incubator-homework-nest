import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource} from 'typeorm';
import { InjectDataSource} from '@nestjs/typeorm';
import { BlogsTable } from '../../domain/blog.entity';
import { BlogsInputDto } from '../../api/models/input/blogs.input.dto';

@Injectable()
export class BlogsRepositorySql {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

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

  async findById_RAW(id: string): Promise<BlogsTable | undefined> {
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

  async updateById_RAW(id: string, dto: BlogsInputDto): Promise<void> {
    const updateBlogByIdQuery = `
    UPDATE "blogs"
    SET ("name", "description", "websiteUrl") = ($2, $3, $4)
    WHERE "id" = $1`;

    const parameters = [id, dto.name, dto.description, dto.websiteUrl];

    try {
      await this.dataSource.query(updateBlogByIdQuery, parameters);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
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

  async deleteById_RAW(id: string): Promise<BlogsTable> {
    const deleteBlogQuery = `
    DELETE FROM "blogs" AS b
    WHERE b."id" = $1
    RETURNING *`;

    try {
      const [deletedBlogArray] = await this.dataSource.query(deleteBlogQuery, [
        id,
      ]);

      return deletedBlogArray;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async deleteAll_RAW() {
    await this.dataSource.query(`TRUNCATE "blogs" CASCADE`);
  }
}
