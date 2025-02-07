import {Injectable} from "@nestjs/common";
import {PostsQueryRepositoryTypeOrm} from "./postgresql/posts.query.repository-typeorm";

@Injectable()
export class PostsQueryRepository {
    constructor( protected postsQueryRepository: PostsQueryRepositoryTypeOrm) {
    }

    async getPostById(id: string) {
        await this.postsQueryRepository.findById_RAW(id)
    }

    async getPostsPaging() {
        await this.postsQueryRepository.getMany()
    }
}