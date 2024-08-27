import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UsersTable } from '../../domain/users.table';
import { UsersInputDto } from '../../api/models/input/users.input.dto';

@Injectable()
export class UsersSqlRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(
    dto: UsersInputDto,
    passwordHash: string,
    confirmationCode: string,
    expirationDate: Date,
  ): Promise<UsersTable> {
    return this.dataSource.getRepository(UsersTable).save({
      ...dto,
      createdAt: new Date().toISOString(),
      passwordHash: passwordHash,
      confirmationCode: confirmationCode,
      expirationDate: expirationDate,
    });
  }

  async save(user: UsersTable): Promise<UsersTable> {
    return this.dataSource.getRepository(UsersTable).save(user);
  }

  async findById(id: string): Promise<UsersTable | null> {
    try {
      return this.dataSource.getRepository(UsersTable).findOneBy({ id: id });
    } catch (e) {
      return null;
    }
  }

  async findByConfirmationCode(code: string): Promise<UsersTable | null> {
    return this.dataSource.getRepository(UsersTable).findOneBy({
      confirmationCode: code,
    });
  }

  async findByRecoveryCode(code: string): Promise<UsersTable | null> {
    return this.dataSource.getRepository(UsersTable).findOneBy({
      recoveryCode: code,
    });
  }

  async findByLogin(login: string): Promise<UsersTable | null> {
    return this.dataSource
      .getRepository(UsersTable)
      .findOneBy({ login: login });
  }

  async findByEmail(email: string): Promise<UsersTable | null> {
    return this.dataSource
      .getRepository(UsersTable)
      .findOneBy({ email: email });
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UsersTable | null> {
    return this.dataSource
      .getRepository(UsersTable)
      .findOneBy([{ email: loginOrEmail }, { login: loginOrEmail }]);
  }

  async remove(id: string): Promise<UsersTable | null> {
    try {
      const user = await this.dataSource
        .getRepository(UsersTable)
        .findOneBy({ id: id });

      if (user) await this.dataSource.getRepository(UsersTable).remove(user);

      return user;
    } catch (e) {
      throw new Error('Error DB');
    }
  }

  async removeAll() {
    await this.dataSource.getRepository(UsersTable).clear();
  }
  // return this.dataSource.getRepository(UsersTable).remove(user);

  // return this.dataSource.transaction(async manager => {
  //     await manager.save(blog)
  // });
  // return this.dataSource.manager.save(BlogsTable, {
  //     ...dto,
  //     createdAt: 'Date',
  //     isMembership: true
  // })
  // }

  // async create() {
  //     return this.dataSource.query(`
  //     CREATE TABLE IF NOT EXISTS blogs(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  //     `)
  // }
}
