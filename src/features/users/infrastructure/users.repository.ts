import {Injectable} from "@nestjs/common";
import {UsersRepositoryTypeOrm} from "./postgresqldb/users.repository-typeorm";
import {UsersTable} from "../domain/users.table";

@Injectable()
export class UsersRepository {
    constructor(protected usersRepository: UsersRepositoryTypeOrm) {
    }

    async create(user: UsersTable): Promise<UsersTable> {
        return this.usersRepository.create(user)
    }

    async findByLogin(login: string): Promise<UsersTable | null> {
        return this.usersRepository.findByLogin(login)
    }

    async findByEmail(email: string): Promise<UsersTable | null> {
        return this.usersRepository.findByEmail(email)
    }

    async deleteAll(): Promise<void> {
        await this.usersRepository.clear()
    }
}