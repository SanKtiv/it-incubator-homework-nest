import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogQuery } from '../../api/models/input/blogs.input.dto';
import {
    BlogsViewDto,
    BlogsViewPagingDto, sqlBlogPagingViewModel, sqlBlogsViewDto,
} from '../../api/models/output/blogs.view.dto';
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {BlogsTable} from "../../domain/blog.entity";

@Injectable()
export class BlogsSqlQueryRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async findById(id: string): Promise<BlogsViewDto> {
        const blogDocument = await this.dataSource
            .getRepository(BlogsTable)
            .findOneBy({id: id});

        if (!blogDocument) throw new NotFoundException();
console.log(typeof blogDocument.createdAt)
        return sqlBlogsViewDto(blogDocument);
    }

    async getBlogsPaging(query: BlogQuery): Promise<BlogsViewPagingDto> {

        const searchName = query.searchNameTerm

        const blogs = this.dataSource
            .getRepository(BlogsTable)
            .createQueryBuilder('blog')

        if (searchName)
            blogs.where('blog.name ~* nameTerm', {nameTerm: searchName});

        const totalBlogs = await blogs.getCount();

        const pagingBlogs = await blogs
            .orderBy(`blog.${query.sortBy}`, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .take(query.pageSize)
            .getMany();

        return sqlBlogPagingViewModel(query, totalBlogs, pagingBlogs);
    }
}
