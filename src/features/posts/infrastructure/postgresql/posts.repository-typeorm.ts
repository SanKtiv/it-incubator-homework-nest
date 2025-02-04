import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {PostsInputDto} from '../../api/models/input/posts.input.dto';
import {InjectDataSource, InjectRepository} from '@nestjs/typeorm';
import {DataSource, InsertResult, Repository} from 'typeorm';
import {PostsTable} from '../../domain/posts.table';
import {InputDto} from '../../../../infrastructure/models/input.dto';
import defineProperty = Reflect.defineProperty;

@Injectable()
export class PostsRepositoryTypeOrm {
    constructor(@InjectDataSource() protected dataSource: DataSource,
                @InjectRepository(PostsTable) protected repository: Repository<PostsTable>) {
    }

    private get queryBuilder() {
        return this.dataSource
            .createQueryBuilder();
    }

    async create(
        dto: PostsTable,
    ): Promise<PostsTable | InsertResult | undefined> {
        try {
            const insertResult = await this.queryBuilder
                .insert()
                .into(PostsTable)
                .values({
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    createdAt: dto.createdAt,
                    blogId: dto.blogId
                })
                //.select(["*", `(SELECT "name" FROM "blogs" WHERE "id" = posts."id") AS "blogName"`])
                .returning([
                    "title",
                    "shortDescription",
                    "content",
                    "createdAt",
                    "blogId",
                    `(SELECT "name" FROM "blogs" WHERE "id" = posts."id") AS "blogName"`])
                .execute();
            return undefined
        }
        catch (e) {
            console.log(e)
        }

    }

    // async findById_ORM(id: string): Promise<PostsTable | null> {
    //     return this.repository_ORM.findOneBy({id: id});
    // }
    //
    // async savePost_ORM(postDocument: PostsTable): Promise<PostsTable> {
    //     return this.repository_ORM.save(postDocument);
    // }
    //
    // async deletePost_ORM(post: PostsTable): Promise<void> {
    //     await this.repository_ORM.remove(post);
    // }
    //
    // async deleteAll_ORM(): Promise<void> {
    //     await this.repository_ORM.clear();
    // }
    //
    // async create_RAW(dto: PostsInputDto) {
    //     const insertPostQuery = `
    // INSERT INTO "posts" AS p ("title", "shortDescription", "content", "blogId", "createdAt")
    // VALUES ($1, $2, $3, $4, $5)
    // RETURNING p."id", p."title", p."shortDescription", p."content", p."blogId", p."createdAt",
    //   (SELECT "name" FROM "blogs" WHERE "id" = $4) AS "blogName"`;
    //
    //     const parameters = [
    //         dto.title,
    //         dto.shortDescription,
    //         dto.content,
    //         dto.blogId,
    //         new Date(),
    //     ];
    //
    //     try {
    //         return await this.dataSource.query(insertPostQuery, parameters);
    //     } catch (e) {
    //         console.log(e);
    //         throw new InternalServerErrorException();
    //     }
    // }
    //
    // async deleteAll_RAW() {
    //     await this.dataSource.query(`TRUNCATE "posts" CASCADE`);
    // }
    //
    // async findById_RAW(id: string): Promise<PostsTable | null> {
    //     const findPostByIdQuery = `
    // SELECT *
    // FROM "posts"
    // WHERE "id" = $1`;
    //
    //     const parameters = [id];
    //
    //     const [post] = await this.dataSource.query(findPostByIdQuery, parameters);
    //
    //     return post;
    // }
    //
    // async findPostByIdWithBlogId(postId: string, blogId: string) {
    //     try {
    //         const [post] = await this.dataSource.query(
    //             `SELECT * FROM "posts" WHERE "id" = $1 AND "blogId" = $2`,
    //             [postId, blogId],
    //         );
    //
    //         return post;
    //     } catch (e) {
    //         console.log(e);
    //         throw new InternalServerErrorException();
    //     }
    // }
    //
    // async deleteByIdAndBlogId_RAW(id: string, blogId: string) {
    //     const deletePstByIdQuery = `
    // DELETE FROM "posts"
    // WHERE "id" = $1 AND "blogId" = $2`;
    //
    //     const parameters = [id, blogId];
    //
    //     try {
    //         return await this.dataSource.query(deletePstByIdQuery, parameters);
    //     } catch (e) {
    //         console.log(e);
    //         throw new InternalServerErrorException();
    //     }
    // }
    //
    // async deleteById_RAW(id: string) {
    //     const deletePstByIdQuery = `
    // DELETE FROM "posts"
    // WHERE "id" = $1`;
    //
    //     const parameters = [id];
    //
    //     try {
    //         const [[], result] = await this.dataSource.query(
    //             deletePstByIdQuery,
    //             parameters,
    //         );
    //
    //         return result;
    //     } catch (e) {
    //         console.log(e);
    //         throw new InternalServerErrorException();
    //     }
    // }
    //
    // async updatePost_RAW(
    //     postId: string,
    //     UpdateDto: InputDto,
    //     blogId?: string,
    // ): Promise<void> {
    //     let whereQuery = 'WHERE "id" = $4';
    //
    //     const parameters = [
    //         UpdateDto.title,
    //         UpdateDto.shortDescription,
    //         UpdateDto.content,
    //         postId,
    //     ];
    //
    //     if (blogId) {
    //         whereQuery = 'WHERE "id" = $4 AND "blogId" = $5';
    //
    //         parameters.push(blogId);
    //     }
    //
    //     const updatePostQuery = `
    // UPDATE "posts"
    // SET ("title", "shortDescription", "content") = ($1, $2, $3)
    // ${whereQuery}`;
    //
    //     await this.dataSource.query(updatePostQuery, parameters);
    // }
}
