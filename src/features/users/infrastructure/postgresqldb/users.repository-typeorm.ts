import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UsersTable } from '../../domain/users.table';
import { EmailConfirmationTable } from '../../domain/email-сonfirmation.table';
import { AccountDataTable } from '../../domain/account-data.table';

@Injectable()
export class UsersRepositoryTypeOrm {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(UsersTable) protected repository: Repository<UsersTable>,
  ) {}

  // private get repository() {
  //   return this.dataSource.getRepository(UsersTable);
  // }

  async deleteAll_RAW() {
    await this.dataSource.query(
      `TRUNCATE "passwordRecovery", "emailConfirmation", "accountData", "users" RESTART IDENTITY CASCADE`,
    );
  }

  async create(user: UsersTable): Promise<UsersTable> {
    return await this.repository.save(user);
  }

  async save(user: UsersTable): Promise<UsersTable> {
    return this.repository.save(user);
  }

  async saveConfirmInfo(entity: EmailConfirmationTable) {
    await this.dataSource.getRepository(EmailConfirmationTable).save(entity);
  }

  async findById(id: string): Promise<UsersTable | null> {
    try {
      return this.repository.findOneBy({ id: id });
    } catch (e) {
      return null;
    }
  }

  async findById_RAW(id: string): Promise<AccountDataTable | null> {
    const findUserByIdQuery = `
    SELECT u."id", "login", "email", "createdAt"
    FROM "users" AS u
    LEFT JOIN "accountData" AS a ON a."id" = u."accountDataId"
    WHERE u."id" = $1`;

    const parameters = [id];
    try {
      const [user] = await this.dataSource.query(findUserByIdQuery, parameters);

      return user;
    } catch (e) {
      return null;
    }
  }

  async findByConfirmationCode(code: string): Promise<UsersTable | null> {
    return this.repository.findOne({
      where: {
        emailConfirmation: { confirmationCode: code },
      },
      relations: ['emailConfirmation'],
    });
  }

  async findByRecoveryCode(code: string): Promise<UsersTable | null> {
    return this.repository.findOne({
      where: {
        passwordRecovery: { recoveryCode: code },
      },
      relations: ['passwordRecovery'],
    });
  }

  async findByLogin(login: string): Promise<UsersTable | null> {
    return this.repository.findOne({
      where: {
        accountData: { login: login },
      },
      relations: ['accountData'],
    });
  }

  async findByLogin_RAW(login: string): Promise<UsersTable | null> {
    const findByLoginQuery = `
    SELECT *
    FROM "accountData" 
    WHERE "login" = $1`;

    const [usersLogin] = await this.dataSource.query(findByLoginQuery, [login]);

    if (usersLogin) return usersLogin;

    return null;
  }

  async findByEmail(email: string): Promise<UsersTable | null> {
    return this.repository.findOne({
      where: {
        accountData: { email: email },
      },
      relations: ['accountData'],
    });
  }

  async findByEmail_RAW(email: string): Promise<UsersTable | null> {
    const findByEmailQuery = `
    SELECT *
    FROM "accountData"
    WHERE "email" = $1`;

    const [user] = await this.dataSource.query(findByEmailQuery, [email]);

    if (user) return user;

    return null;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UsersTable | null> {
    return this.repository.findOne({
      where: [
        { accountData: { email: loginOrEmail } },
        { accountData: { login: loginOrEmail } },
      ],
      relations: ['accountData'],
    });
  }

  async remove(id: string): Promise<UsersTable | null> {
    try {
      const user = await this.repository.findOne({
        where: { id },
        relations: ['accountData', 'emailConfirmation', 'passwordRecovery'],
      });

      if (!user) return null;

      return await this.repository.softRemove(user);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async clear(): Promise<void> {
    await this.dataSource.query(
      `TRUNCATE "passwordRecovery", "emailConfirmation", "accountData", "users" RESTART IDENTITY CASCADE`,
    );
  }
}
