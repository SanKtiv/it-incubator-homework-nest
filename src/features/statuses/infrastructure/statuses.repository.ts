import {Injectable} from "@nestjs/common";
import {StatusesRepositoryTypeOrm} from "./postgresql/statuses.repository-typeorm";
import {StatusesCommentsTable} from "../domain/statuses.entity";

@Injectable()
export class StatusesRepository {
    constructor(private repository: StatusesRepositoryTypeOrm) {
    }

    async createStatus(commentStatusEntity: StatusesCommentsTable) {
        await this.repository.insert(commentStatusEntity)
    }
}