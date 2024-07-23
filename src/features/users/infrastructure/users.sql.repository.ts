import {Injectable} from "@nestjs/common";
import {Column, DataSource, Repository} from "typeorm";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {AccountData, UsersTable} from "../domain/users.table";


@Injectable()
export class UsersSqlRepository {
    constructor(
        //protected dataSource: DataSource,
        @InjectRepository(UsersTable) protected usersRepository: Repository<UsersTable>,
        @InjectRepository(AccountData) protected usersAccRepository: Repository<AccountData>,
        ) {}

    async create(dto) {
        const accountData: AccountData = {
            login: 'string',
            email: 'string',
            createdAt: 'string',
            passwordHash: 'string',
        };
        await this.usersAccRepository.save(accountData)
        const user = new UsersTable()
        user.accountData = accountData
        return this.usersRepository.save(user)

        // return this.dataSource.transaction(async manager => {
        //     await manager.save(blog)
        // });
        // return this.dataSource.manager.save(BlogsTable, {
        //     ...dto,
        //     createdAt: 'Date',
        //     isMembership: true
        // })
    }

    // async create() {
    //     return this.dataSource.query(`
    //     CREATE TABLE IF NOT EXISTS blogs(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
    //     `)
    // }
}