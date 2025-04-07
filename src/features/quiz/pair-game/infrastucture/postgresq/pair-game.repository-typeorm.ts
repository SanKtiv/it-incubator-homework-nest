import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuizPairGameEntity, QuizPairGameStatusType} from "../../domain/pair-game.entity";
import {Repository, SelectQueryBuilder} from "typeorm";
import {AccountDataTable} from "../../../../users/domain/account-data.table";
import {UsersTable} from "../../../../users/domain/users.table";

@Injectable()
export class PairGameRepositoryTypeOrm {
    constructor(@InjectRepository(QuizPairGameEntity) protected repository: Repository<QuizPairGameEntity>) {
    }

    async getById(id: string): Promise<QuizPairGameEntity | null | undefined> {
        return this.builder
            .where('pg."id" = :id', { id })
            .addSelect(this.getFirstPlayerLogin, 'firstPlayerLogin')
            .addSelect(this.getSecondPlayerLogin, 'secondPlayerLogin')
            .getRawOne()
    }

    async getByStatus(status: QuizPairGameStatusType) {
        return this.builder
            .where('pg."status" = :status', { status })
            //.addSelect(this.getFirstPlayerLogin, 'firstPlayerLogin')
            //.addSelect(this.getSecondPlayerLogin, 'secondPlayerLogin')
            .getRawOne()
    }

    async getOne(userId: string): Promise<QuizPairGameEntity | null | undefined> {
        return this.builder
            .where('pg."firstPlayerId" = :userId', { userId })
            .orWhere('pg."secondPlayerId" = :userId', { userId })
            .getRawOne()
    }

    async create(pairGame: QuizPairGameEntity): Promise<QuizPairGameEntity | null | undefined> {
        const createdPairGame = await this.repository.save(pairGame);
        return this.getById(createdPairGame.id);
    }

    async clear(): Promise<void> {
        await this.repository.clear();
    }

    private get builder() {
        return this.repository
            .createQueryBuilder('pg')
            .select('pg.*')
    }

    private getFirstPlayerLogin = (subQuery: SelectQueryBuilder<AccountDataTable>) =>
        subQuery
            .select('ac."login"')
            .from(UsersTable, 'u')
            .leftJoin(AccountDataTable, 'ac', 'ac."id" = u."accountDataId"')
            .where('u."id" = pg."firstPlayerId"')

    private getSecondPlayerLogin = (subQuery: SelectQueryBuilder<AccountDataTable>) =>
        subQuery
            .select('ac."login"')
            .from(UsersTable, 'u')
            .leftJoin(AccountDataTable, 'ac', 'ac."id" = u."accountDataId"')
            .where('pg."secondPlayerId" = u."id"')
}