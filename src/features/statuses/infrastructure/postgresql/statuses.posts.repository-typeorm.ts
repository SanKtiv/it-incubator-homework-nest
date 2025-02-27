import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StatusesPostsTable} from "../../domain/statuses.entity";
import {Repository} from "typeorm";

@Injectable()
export class StatusesPostsRepositoryTypeOrm {
    constructor(@InjectRepository(StatusesPostsTable) protected repository: Repository<StatusesPostsTable>) {
    }

    async save(status: StatusesPostsTable) {
        await this.repository.save(status)
    }

    async findOne(postId: string, userId: string): Promise<StatusesPostsTable | null> {
        return this.repository.findOneBy({postId, userId})
    }

    async clear() {
        await this.repository.query('TRUNCATE TABLE "statuses_posts" CASCADE')
    }
}