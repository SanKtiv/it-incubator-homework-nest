import {Injectable} from "@nestjs/common";
import {BlogsQueryRepositoryTypeOrm} from "./postgresdb/blogs.query.repository-typeorm";
import {blogsViewModel} from "../api/models/output/blogs.view.dto";

@Injectable()
export class BlogsQueryRepository {
    constructor(private readonly repository: BlogsQueryRepositoryTypeOrm) {
    }

    async findById(id: string) {
        const blog = await this.repository.findById(id)

        if (blog) return blogsViewModel(blog);

        return null;
    }

    async findBlogsPag() {

    }
}