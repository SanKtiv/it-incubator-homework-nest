import {Injectable} from "@nestjs/common";

import { StatusesPostsTable} from "../domain/statuses.entity";
import {StatusesPostsRepositoryTypeOrm} from "./postgresql/statuses.posts.repository-typeorm";

@Injectable()
export class StatusesPostsRepository {
    constructor(private repository: StatusesPostsRepositoryTypeOrm) {
    }

    async createStatusPost(commentStatusEntity: StatusesPostsTable) {
        await this.repository.insert(commentStatusEntity)
    }
}