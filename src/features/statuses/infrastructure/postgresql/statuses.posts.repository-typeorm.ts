import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StatusesPostsTable} from "../../domain/statuses.entity";
import {Repository} from "typeorm";

@Injectable()
export class StatusesPostsRepositoryTypeOrm {
    constructor(@InjectRepository(StatusesPostsTable) protected repository: Repository<StatusesPostsTable>) {
    }

    async create(status: StatusesPostsTable) {
        await this.repository.insert(status)
    }

    async save(status: StatusesPostsTable) {
        await this.repository.save(status)
    }

    async findOne(postId: string, userId: string): Promise<StatusesPostsTable | null> {
        return this.repository.findOne({
            where:
                {
                    postId: postId,
                    userId: userId
                }
        })
    }

    async clear() {
        await this.repository.query('TRUNCATE TABLE "statuses_posts" CASCADE')
    }
}