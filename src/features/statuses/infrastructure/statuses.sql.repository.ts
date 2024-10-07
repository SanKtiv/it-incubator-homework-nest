import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {StatusesTable} from "../domain/statuses.entity";

@Injectable()
export class StatusesSqlRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {
    }

    async createStatus() {
        const querySql = `
        INSERT INTO "statuses" ("userId", "commentId", "")
        `
        const queryParams = []
    }

    async updateStatus(status: string, userId: string, postId: string) {
        const querySql = `
        UPDATE "statuses" AS status
        SET status."userStatus" = $1,
        SET status."addedAt" = $2,
        WHERE status."userId" = $3 AND status."postId" = $4
        `
        const queryParams = [status, new Date(), userId, postId]

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