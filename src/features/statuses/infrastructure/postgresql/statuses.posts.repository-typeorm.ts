import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StatusesPostsTable} from "../../domain/statuses.entity";
import {Repository} from "typeorm";

@Injectable()
export class StatusesPostsRepositoryTypeOrm {
    constructor(@InjectRepository(StatusesPostsTable) protected repository: Repository<StatusesPostsTable>) {
    }

    async insert(commentStatusEntity: StatusesPostsTable) {
        await this.repository.save(commentStatusEntity)
    }

    async clear() {
        await this.repository.query('TRUNCATE TABLE "statuses_posts" CASCADE')
    }
}