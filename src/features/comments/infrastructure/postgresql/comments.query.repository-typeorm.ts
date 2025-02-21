import {Injectable} from "@nestjs/common";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {CommentsTable} from "../../domain/comments.entity";
import {DataSource, Repository} from "typeorm";
import {QueryDto} from "../../../../infrastructure/models/query.dto";
import {UsersTable} from "../../../users/domain/users.table";
import {AccountDataTable} from "../../../users/domain/account-data.table";

@Injectable()
export class CommentsQueryRepositoryTypeOrm {
    constructor(@InjectRepository(CommentsTable) protected repository: Repository<CommentsTable>,
                @InjectDataSource() protected dataSource: DataSource) {
    }

    async findById() {

    }

    async paging(query: QueryDto, postId: string, userId: string) {
        await this.dataSource
            .createQueryBuilder()
            .select(['c.*'])
            .from(CommentsTable, 'c')
            .leftJoin(UsersTable, 'u', 'u."id" = c."userId"')
            .leftJoin(AccountDataTable, 'adt', 'adt."id" = u."accountDataId"')
            .addSelect('adt."login"', 'userLogin')
            .orderBy(`"${query.sortBy}"`, query.sortDirection)
            .offset((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .getRawMany()
    }
}