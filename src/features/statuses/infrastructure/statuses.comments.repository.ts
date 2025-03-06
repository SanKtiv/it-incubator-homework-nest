import {Injectable} from "@nestjs/common";
import {StatusesCommentsRepositoryTypeOrm} from "./postgresql/statuses.comments.repository-typeorm";
import {StatusesCommentsTable} from "../domain/statuses.entity";

@Injectable()
export class StatusesCommentsRepository {
    constructor(private repository: StatusesCommentsRepositoryTypeOrm) {
    }

    async createStatusComment(postStatusEntity: StatusesCommentsTable) {
        await this.repository.insert(postStatusEntity)
    }

    async getStatusCommentByUserId(userId: string): Promise<StatusesCommentsTable | null> {
        return this.repository.getStatusByUserId(userId)
    }

    async clear() {
        await this.repository.clear()
    }
}