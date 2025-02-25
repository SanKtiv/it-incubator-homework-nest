import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StatusesCommentsTable, StatusesPostsTable} from "../../domain/statuses.entity";
import {Repository} from "typeorm";

@Injectable()
export class StatusesRepositoryTypeOrm {
    constructor(@InjectRepository(StatusesPostsTable) protected statusesPostsRepo: Repository<StatusesPostsTable>,
                @InjectRepository(StatusesCommentsTable) protected statusesCommentsRepo: Repository<StatusesCommentsTable>) {
    }

    async insert(commentStatusEntity: StatusesCommentsTable) {
        await this.statusesCommentsRepo.save(commentStatusEntity)
    }
}