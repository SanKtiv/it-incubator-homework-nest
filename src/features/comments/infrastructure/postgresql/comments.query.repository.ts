import {Injectable} from "@nestjs/common";
import {CommentsQueryRepositoryTypeOrm} from "./comments.query.repository-typeorm";

@Injectable()
export class CommentsQueryRepository {
    constructor( protected repository: CommentsQueryRepositoryTypeOrm) {
    }

    async getCommentByd() {

    }

    async getCommentsPaging() {

    }
}