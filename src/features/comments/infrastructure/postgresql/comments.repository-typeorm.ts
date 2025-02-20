import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CommentsTable} from "../../domain/comments.entity";
import {Repository} from "typeorm";
import {CommentServiceDto} from "../../api/models/input/comment-service.dto";

@Injectable()
export class CommentsRepositoryTypeOrm {
    constructor(@InjectRepository(CommentsTable) protected repository: Repository<CommentsTable>) {
    }

    async create(comment: CommentsTable): Promise<CommentsTable> {
        return this.repository.create(comment)
    }

    async update() {

    }

    async deleteOne() {

    }

    async clear() {

    }
}