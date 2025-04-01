import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuizPairGameEntity} from "../../domain/pair-game.entity";
import {Repository} from "typeorm";
import {UsersTable} from "../../../../users/domain/users.table";
import {AccountDataTable} from "../../../../users/domain/account-data.table";

@Injectable()
export class PairGameQueryRepositoryTypeOrm {
    constructor(@InjectRepository(QuizPairGameEntity) protected repository: Repository<QuizPairGameEntity>) {
    }

    async getById(id: string) {
        return this.repository
            .createQueryBuilder('pg')
            .select('pg.*')
            .where('pg."id" = :id', { id })
            .leftJoin(UsersTable, 'u')
            .leftJoin(AccountDataTable, 'au')
            .addSelect('au."login"', 'firstPlayerLogin')
            .getRawOne()
    }
}