import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UsersTable } from '../../domain/users.table';
import { UsersInputDto } from '../../api/models/input/users.input.dto';
import { EmailConfirmationTable } from '../../domain/email-сonfirmation.table';
import { AccountDataTable } from '../../domain/account-data.table';
import { PasswordRecoveryTable } from '../../domain/password-recovery.table';

@Injectable()
export class UsersRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(
    dto: UsersInputDto,
    passwordHash: string,
    confirmationCode: string,
    expirationDate: Date,
  ): Promise<UsersTable> {
    const user = new UsersTable();
    const accountData = new AccountDataTable();
    const emailConfirmation = new EmailConfirmationTable();
    const passwordRecovery = new PasswordRecoveryTable();

    accountData.login = dto.login;
    accountData.email = dto.email;
    accountData.createdAt = new Date();
    accountData.passwordHash = passwordHash;
    emailConfirmation.confirmationCode = confirmationCode;
    emailConfirmation.expirationDate = expirationDate;
    passwordRecovery.recoveryCode = 'code';
    passwordRecovery.expirationDateRecovery = new Date();

    user.accountData = accountData;
    user.emailConfirmation = emailConfirmation;
    user.passwordRecovery = passwordRecovery;

    return await this.repository.save(user);
  }
  private get repository() {
    return this.dataSource.getRepository(UsersTable);
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

  async findByEmail(email: string): Promise<UsersTable | null> {
    return this.repository.findOne({
      where: {
        accountData: { email: email },
      },
      relations: ['accountData'],
    });
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
      const user = await this.repository.findOneBy({ id: id });

      if (user) await this.dataSource.getRepository(UsersTable).remove(user);

      return user;
    } catch (e) {
      throw new Error('Error DB');
    }
  }

  async removeAll() {
    await this.repository.clear();
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
