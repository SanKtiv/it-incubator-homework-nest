import {Injectable} from "@nestjs/common";
import {CommentsQueryRepositoryTypeOrm} from "./comments.query.repository-typeorm";
import {QueryDto} from "../../../../infrastructure/models/query.dto";

@Injectable()
export class CommentsQueryRepository {
    constructor( protected repository: CommentsQueryRepositoryTypeOrm) {
    }

    async getCommentByd() {

    }

    async getCommentsPaging(query: QueryDto, postId: string, userId: string,) {
        return this.repository.paging(query, postId, userId,)
    }
}