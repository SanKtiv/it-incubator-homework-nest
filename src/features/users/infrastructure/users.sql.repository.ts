import { Injectable } from '@nestjs/common';
import { Column, DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AccountData, UsersTable } from '../domain/users.table';
import {UsersInputDto} from "../api/models/input/users.input.dto";
import {UserDocument} from "../domain/users.schema";
import {filterByLoginAndEmail} from "./utils.repositories";

@Injectable()
export class UsersSqlRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    // @InjectRepository(UsersTable)
    // protected usersRepository: Repository<UsersTable>,
    // @InjectRepository(AccountData)
    // protected usersAccRepository: Repository<AccountData>,
  ) {}

  async create(
      dto: UsersInputDto,
      passwordHash: string,
      confirmationCode: string,
      expirationDate: Date,
  ): Promise<any> {
    return this.dataSource
        .getRepository(UsersTable)
        .save(
            {
              ...dto,
              createdAt: new Date().toISOString(),
              passwordHash: passwordHash,
              confirmationCode: confirmationCode,
              expirationDate: expirationDate,
            }
    );
  }

  async save(userDocument: UserDocument): Promise<UserDocument> {
    return userDocument.save();
  }

  async findById(id: string): Promise<UsersTable | null> {
    try {
      return this.dataSource
          .getRepository(UsersTable)
          .findOneBy({id: id});
    } catch (e) {
      return null;
    }
  }

  async findByConfirmationCode(code: string): Promise<UsersTable | null> {
    return this.dataSource
        .getRepository(UsersTable)
        .findOneBy({
      confirmationCode: code,
    });
  }

  async findByRecoveryCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'passwordRecovery.recoveryCode': code,
    });
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ 'accountData.login': login });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ 'accountData.email': email });
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    const filter = filterByLoginAndEmail(loginOrEmail, loginOrEmail);
    return this.UserModel.findOne(filter);
  }

  async remove(id: string): Promise<UserDocument | null> {
    try {
      return this.UserModel.findByIdAndDelete(id);
    } catch (e) {
      throw new Error('Error DB');
    }
  }

  async removeAll() {
    await this.UserModel.deleteMany();
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
