import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {StatusesTable} from "../domain/statuses.entity";

@Injectable()
export class StatusesSqlRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {
    }

    async createStatus() {

    }

    async updateStatus(status: string, userId: string, postId: string) {
        const querySql = `
        UPDATE "userStatus" AS status
        SET status."userStatus" = $1
        WHERE status."userId" = $2 AND status."postId" = $3
        `
        const queryParams = [status, userId, postId]

        try {
            await this.dataSource.query(querySql, queryParams)
        }
        catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async getStatusOfPost(userId: string, postId: string): Promise<string> {
        const querySql = `
        SELECT status."userStatus"
        FROM "statuses" AS status
        WHERE status."userId" = $1 AND status."postId" = $2
        `
        const queryParams = [userId, postId]
        try {
            const statusArray = await this.dataSource.query(querySql, queryParams)

            return statusArray[0].userStatus
        }
        catch (e) {
            throw new InternalServerErrorException()
        }
    }
}