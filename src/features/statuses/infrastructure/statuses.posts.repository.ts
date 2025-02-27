import {Injectable} from "@nestjs/common";

import { StatusesPostsTable} from "../domain/statuses.entity";
import {StatusesPostsRepositoryTypeOrm} from "./postgresql/statuses.posts.repository-typeorm";

@Injectable()
export class StatusesPostsRepository {
    constructor(private repository: StatusesPostsRepositoryTypeOrm) {
    }

    async createStatusPost(status: StatusesPostsTable) {
        await this.repository.save(status)
    }

    async getStatusPost(postId: string, userId: string) {
        return this.repository.findOne(postId, userId)
    }

    async updateStatus(status: StatusesPostsTable) {
        await this.repository.save(status)
    }

    async clear() {
        await this.repository.clear()
    }
}