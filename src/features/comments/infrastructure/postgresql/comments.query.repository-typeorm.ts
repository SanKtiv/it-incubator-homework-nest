import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CommentsTable} from "../../domain/comments.entity";
import {Repository} from "typeorm";

@Injectable()
export class CommentsQueryRepositoryTypeOrm {
    constructor(@InjectRepository(CommentsTable) protected repository: Repository<CommentsTable>) {
    }

    async findById() {

    }

    async paging() {

    }
}