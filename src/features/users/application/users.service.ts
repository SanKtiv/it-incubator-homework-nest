import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersInputDto } from '../api/models/input/users.input.dto';
import bcrypt from 'bcrypt';
import { UsersRepositoryMongo } from '../infrastructure/mongodb/users.repository-mongo';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UserDocument } from '../domain/users.schema';
import { UsersRepositorySql } from '../infrastructure/postgresqldb/users.repository-sql';
import { UsersTable } from '../domain/users.table';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepositoryMongo,
    private readonly usersRepositorySql: UsersRepositorySql,
  ) {}

  async createUser(dto: UsersInputDto): Promise<UsersTable | any> {
    const passwordHash = await this.genHash(dto.password);

    const code = this.createCodeWithExpireDate();

    return this.usersRepositorySql.create_RAW(
      dto,
      passwordHash,
      code.confirmationCode,
      code.expirationDate,
    );

    //return this.saveUser(userDocument); for mongo
  }

  async saveUser(userDocument: UserDocument) {
    return this.usersRepository.save(userDocument);
  }

  createCodeWithExpireDate() {
    return {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { hours: 1, minutes: 5 }) as Date,
    };
  }

  async existUserLogin(login: string): Promise<BadRequestException | void> {
    const user = await this.usersRepositorySql.findByLogin_RAW(login);
    if (user) {
      throw new BadRequestException({
        message: [{ message: 'login is already exist', field: 'login' }],
      });
    }
  }

  async existUserEmail(email: string): Promise<BadRequestException | void> {
    const userDocument = await this.usersRepositorySql.findByEmail_RAW(email);
    if (userDocument) {
      throw new BadRequestException({
        message: [{ message: 'email is already exist', field: 'email' }],
      });
    }
  }

  async existUserById(id: string): Promise<boolean> {
    const result = await this.usersRepository.findById(id);

    return !!result;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.usersRepositorySql.remove(id);

    return !!result;
  }

  async genHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }
}
