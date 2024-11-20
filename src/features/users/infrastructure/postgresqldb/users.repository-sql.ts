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

  private get repository() {
    return this.dataSource.getRepository(UsersTable);
  }

  async create(
    dto: UsersInputDto,
    passwordHash: string,
    confirmationCode: string,
    expirationDate: Date,
  ): Promise<UsersTable> {
    const user = new UsersTable();
    const accountData = new AccountDataTable();
    const emailConfirmation = new EmailConfirmationTable();

    accountData.login = dto.login;
    accountData.email = dto.email;
    accountData.createdAt = new Date();
    accountData.passwordHash = passwordHash;

    emailConfirmation.confirmationCode = confirmationCode;
    emailConfirmation.expirationDate = expirationDate;

    user.accountData = accountData;
    user.emailConfirmation = emailConfirmation;

    return await this.repository.save(user);
  }

  async create_RAW(
    dto: UsersInputDto,
    passwordHash: string,
    confirmationCode: string,
    expirationDate: Date,
  ) {
    const accountDataQuery = `
    INSERT INTO "accountData" ("login", "email", "createdAt", "passwordHash")
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

    const accountDataParameters = [
      dto.login,
      dto.email,
      new Date(),
      passwordHash
    ];

    const emailConfirmationQuery = `
    INSERT INTO "emailConfirmation" ("confirmationCode", "expirationDate")
    VALUES ($1, $2)
    RETURNING *`;

    const emailConfirmationParameters = [confirmationCode, expirationDate];

    const passwordRecoveryQuery = `
    INSERT INTO "passwordRecovery"
    DEFAULT VALUES
    RETURNING *`

    const [accountData] = await this.dataSource
        .query(accountDataQuery, accountDataParameters);

    const [emailConfirmation] = await this.dataSource
        .query(emailConfirmationQuery, emailConfirmationParameters)

    const [passwordRecovery] = await this.dataSource
        .query(passwordRecoveryQuery)

    const insertUserQuery = `
    INSERT INTO "users" ("accountDataId", "emailConfirmationId", "passwordRecoveryId")
    VALUES ($1, $2, $3)
    RETURNING *`

    const userParameters = [accountData.id, emailConfirmation.id, passwordRecovery.id]

    const [user] = await this.dataSource.query(insertUserQuery, userParameters)

    return this.findById_RAW(user.id)
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

  async findById_RAW(id: string): Promise<UsersTable | null> {
    const findUserByIdQuery = `
    SELECT u."id", "login", "email", "createdAt"
    FROM "users" AS u
    LEFT JOIN "accountData" AS a ON a."id" = u."accountDataId"
    WHERE u."id" = $1`

    const parameters = [id]
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
