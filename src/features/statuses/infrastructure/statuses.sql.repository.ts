import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {StatusesTable} from "../domain/statuses.entity";
import {NewestLikes} from "../../posts/api/models/output/posts.output.dto";

@Injectable()
export class StatusesSqlRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {
    }

    async createStatusForPost(userId: string, postId: string, status: string): Promise<void> {
        const querySql = `
        INSERT INTO "statuses" ("userId", "postId", "userStatus", "addedAt")
        VALUES ($1, $2, $3, $4)
        `
        const queryParams = [userId, postId, status, new Date()]

        try {
            await this.dataSource.query(querySql, queryParams)
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async updateStatus(userId: string, postId: string, status: string): Promise<void> {
        const querySql = `
        UPDATE "statuses" AS status
        SET status."userStatus" = $1,
        SET status."addedAt" = $2,
        WHERE status."userId" = $3 AND status."postId" = $4
        `
        const queryParams = [status, new Date(), userId, postId]

        try {
            await this.dataSource.query(querySql, queryParams)
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async getStatusOfPost(userId: string, postId: string): Promise<string | null> {
        const querySql = `
        SELECT status."userStatus"
        FROM "statuses" AS status
        WHERE status."userId" = $1 AND status."postId" = $2
        `
        const queryParams = [userId, postId]
        try {
            const statusesArray = await this.dataSource.query(querySql, queryParams)

            if (!statusesArray.length) return null

            return statusesArray[0].userStatus
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async getNewestLikesByPostId(id: string): Promise<NewestLikes[]> {
        const queryParams = [id]

        const querySqlStatus = `
    SELECT s."addedAt", s."userId",
      (SELECT u."login" FROM "users" AS u WHERE s."userId" = u."id") AS "login"
    FROM "statuses" AS s
    WHERE s."userStatus" = 'Like' AND s."postId" = $1
    ORDER BY d."addedAt" desc
    LIMIT 3
    `
        try {
            return this.dataSource.query(querySqlStatus, queryParams)
        }
        catch (e) {
            throw new InternalServerErrorException()
        }
    }
}