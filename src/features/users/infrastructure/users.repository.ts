import { Injectable } from '@nestjs/common';
import { UsersRepositoryTypeOrm } from './postgresqldb/users.repository-typeorm';
import { UsersTable } from '../domain/users.table';

@Injectable()
export class UsersRepository {
  constructor(protected usersRepository: UsersRepositoryTypeOrm) {}

  async create(user: UsersTable): Promise<UsersTable> {
    return this.usersRepository.create(user);
  }

  async update(user: UsersTable): Promise<UsersTable> {
    return this.usersRepository.save(user);
  }

  async findById(id: string): Promise<UsersTable | null> {
    return this.usersRepository.findById(id);
  }

  async findByLogin(login: string): Promise<UsersTable | null> {
    return this.usersRepository.findByLogin(login);
  }

  async findByEmail(email: string): Promise<UsersTable | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UsersTable | null> {
    return this.usersRepository.findByLoginOrEmail(loginOrEmail);
  }

  async findByConfirmationCode(code: string): Promise<UsersTable | null> {
    return this.usersRepository.findByConfirmationCode(code);
  }

  async findByRecoveryCode(code: string): Promise<UsersTable | null> {
    return this.usersRepository.findByRecoveryCode(code);
  }

  async deleteById(id: string): Promise<UsersTable | null> {
    return this.usersRepository.remove(id);
  }

  async deleteAll(): Promise<void> {
    await this.usersRepository.clear();
  }
}
