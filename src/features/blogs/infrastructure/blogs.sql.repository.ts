import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {BlogsTable} from "../domain/blog.entity";

@Injectable()
export class BlogsSqlRepository {
    constructor(
        protected dataSource: DataSource,
        @InjectRepository(BlogsTable) protected blogsRepository: Repository<BlogsTable>) {
    }

    async create(dto) {
        const blog: BlogsTable = {
            ...dto,
            id: 1,
            createdAt: 'Date',
            isMembership: true
        }
        await this.blogsRepository.create(blog)
        // await this.dataSource.transaction(async manager => {
        //     console.log('Hello')
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