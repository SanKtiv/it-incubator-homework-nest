import {Injectable} from "@nestjs/common";
import {BlogsRepositoryTypeOrm} from "./postgresdb/blogs.repository-typeorm";
import {BlogsServicesDto} from "../api/models/input/blogs.services.dto";
import {BlogsTable} from "../domain/blog.entity";

@Injectable()
export class BlogsRepository {
    constructor(private readonly blogsRepository: BlogsRepositoryTypeOrm) {}

    async create(dto: BlogsTable) {
        return this.blogsRepository.createBlog(dto)
    }

    async find(id: string) {
        return this.blogsRepository.findById(id)
    }

    async update() {

    }

    async delete() {

    }

    async clear() {

    }
}