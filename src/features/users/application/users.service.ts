import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersInputDto } from '../api/models/input/users.input.dto';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UsersTable } from '../domain/users.table';
import { AccountDataTable } from '../domain/account-data.table';
import { EmailConfirmationTable } from '../domain/email-сonfirmation.table';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: UsersInputDto): Promise<UsersTable> {
    await this.existUserLogin(dto.login);
    await this.existUserEmail(dto.email);

    const passwordHash = await this.genHash(dto.password);
    const code = this.createCodeWithExpireDate();

    const user = new UsersTable();
    const accountData = new AccountDataTable();
    const emailConfirmation = new EmailConfirmationTable();

    accountData.login = dto.login;
    accountData.email = dto.email;
    accountData.createdAt = new Date();
    accountData.passwordHash = passwordHash;

    emailConfirmation.confirmationCode = code.confirmationCode;
    emailConfirmation.expirationDate = code.expirationDate;

    user.accountData = accountData;
    user.emailConfirmation = emailConfirmation;

    return this.usersRepository.create(user);
  }

  createCodeWithExpireDate() {
    return {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { hours: 1, minutes: 5 }) as Date,
    };
  }

  async existUserLogin(login: string): Promise<void> {
    const user = await this.usersRepository.findByLogin(login);
    if (user) {
      throw new BadRequestException({
        message: [{ message: 'login is already exist', field: 'login' }],
      });
    }
  }

  async existUserEmail(email: string): Promise<void> {
    const userDocument = await this.usersRepository.findByEmail(email);
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

  async deleteUserById(id: string): Promise<void> {
    const user = await this.usersRepository.deleteById(id);
    if (!user) throw new NotFoundException();
  }

  async genHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }
}
