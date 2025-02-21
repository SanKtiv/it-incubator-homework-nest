import {Injectable} from "@nestjs/common";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {CommentsTable} from "../../domain/comments.entity";
import {DataSource, Repository} from "typeorm";
import {UsersTable} from "../../../users/domain/users.table";
import {AccountDataTable} from "../../../users/domain/account-data.table";

@Injectable()
export class CommentsRepositoryTypeOrm {
    constructor(@InjectRepository(CommentsTable) protected repository: Repository<CommentsTable>,
    @InjectDataSource() protected dataSource: DataSource) {
    }

    async create(comment: CommentsTable) {
        const createdComment = this.dataSource
            .createQueryBuilder()
            .insert()
            .into(CommentsTable)
            .values(comment)
            .returning('*')

        return this.dataSource
            .createQueryBuilder()
            .addCommonTableExpression(createdComment, 'com_cte')
            .select('c.*')
            .from('com_cte', 'c')
            .leftJoin(UsersTable, 'u', 'u."id" = c."userId"')
            .leftJoin(AccountDataTable, 'adt', 'adt."id" = u."accountDataId"')
            .addSelect('adt."login"', 'userLogin')
            .getRawOne()
    }

    async update(comment: CommentsTable): Promise<CommentsTable> {
        return this.repository.save(comment)
    }

    async deleteOne() {

    }

    async clear() {

    }
}