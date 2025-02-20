import {Injectable} from "@nestjs/common";
import {CommentsRepositoryTypeOrm} from "./postgresql/comments.repository-typeorm";
import {CommentsTable} from "../domain/comments.entity";

@Injectable()
export class CommentsRepository {
    constructor( protected repository: CommentsRepositoryTypeOrm) {
    }

    async createComment(comment: CommentsTable): Promise<CommentsTable> {
        return this.repository.create(comment)
    }

    async updateComment() {

    }

    async deleteOneById() {

    }

    async clear() {

    }
}