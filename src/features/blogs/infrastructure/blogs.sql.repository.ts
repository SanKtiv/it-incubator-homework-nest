import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {InjectDataSource} from "@nestjs/typeorm";

@Injectable()
export class BlogsSqlRepository {
    constructor(@InjectDataSource protected dataSource: DataSource) {
    }

    async createBlog() {
        return this.dataSource.query(`
        `)
    }
}