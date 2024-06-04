import {BadRequestException, Injectable} from '@nestjs/common';
import { UsersInputDto } from '../api/models/input/users.input.dto';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../infrastructure/users.repository';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UserDocument } from '../domain/users.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: UsersInputDto): Promise<UserDocument> {
    const passwordHash = await this.genHash(dto.password);

    const code = this.createCodeWithExpireDate();

    const userDocument = await this.usersRepository.create(
      dto,
      passwordHash,
      code.confirmationCode,
      code.expirationDate,
    );

    return this.saveUser(userDocument);
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

  async existLogin(login: string): Promise<BadRequestException | void> {
    const userDocument = await this.usersRepository.findByLogin(login)
    if (userDocument) {
      throw new BadRequestException(
          { message: [{ message: 'login is already exist', field: 'login' }] }
      );
    }
  }

  async existEmail(email: string): Promise<BadRequestException | void> {
    const userDocument = await this.usersRepository.findByEmail(email)
    if (userDocument) {
      throw new BadRequestException(
          { message: [{ message: 'email is already exist', field: 'email' }] }
      );
    }
  }

  async existUserWithId(id: string): Promise<boolean> {
    const result = await this.usersRepository.findById(id);

    return !!result;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.usersRepository.remove(id);

    return !!result;
  }

  async genHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }
}
