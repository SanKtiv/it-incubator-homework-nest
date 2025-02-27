import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StatusesCommentsTable} from "../../domain/statuses.entity";
import {Repository} from "typeorm";

@Injectable()
export class StatusesCommentsRepositoryTypeOrm {
    constructor(@InjectRepository(StatusesCommentsTable) protected repository: Repository<StatusesCommentsTable>) {
    }

    async insert(postStatusEntity: StatusesCommentsTable) {
        await this.repository.save(postStatusEntity)
    }

    async clear() {
        await this.repository.query('TRUNCATE statuses_comments CASCADE')
    }
}