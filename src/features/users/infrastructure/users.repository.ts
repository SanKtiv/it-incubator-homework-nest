import {Injectable} from "@nestjs/common";
import {UsersRepositoryTypeOrm} from "./postgresqldb/users.repository-typeorm";

@Injectable()
export class UsersRepository {
    constructor(protected usersRepository: UsersRepositoryTypeOrm) {
    }

    async deleteAll(): Promise<void> {
        await this.usersRepository.clear()
    }
}