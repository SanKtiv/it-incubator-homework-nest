import { Injectable } from '@nestjs/common';
import { Column, DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AccountData, UsersTable } from '../domain/users.table';

@Injectable()
export class UsersSqlRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    // @InjectRepository(UsersTable)
    // protected usersRepository: Repository<UsersTable>,
    // @InjectRepository(AccountData)
    // protected usersAccRepository: Repository<AccountData>,
  ) {}

  async create(dto) {
    const accountData: AccountData = {
      login: 'string1',
      email: 'string',
      createdAt: 'string',
      passwordHash: 'string',
    };
    const user = new UsersTable();
    try {
      await this.dataSource.getRepository(AccountData).save(accountData);
      //await this.usersAccRepository.save(accountData)

      user.accountData = accountData;
      const result = await this.dataSource.getRepository(UsersTable).save(user);
    } catch (e) {
      return this.dataSource.getRepository(UsersTable).find({
        where: { id: 'aee48b5e-4f03-430d-9611-e31679a420d3' },
        relations: { accountData: true },
      });
    }
    return this.dataSource.getRepository(UsersTable).remove(user);

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
