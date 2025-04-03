import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuizPairGameEntity, QuizPairGameStatusType} from "../../domain/pair-game.entity";
import {Repository} from "typeorm";
import {AccountDataTable} from "../../../../users/domain/account-data.table";
import {UsersTable} from "../../../../users/domain/users.table";

@Injectable()
export class PairGameRepositoryTypeOrm {
    constructor(@InjectRepository(QuizPairGameEntity) protected repository: Repository<QuizPairGameEntity>) {
    }

    async getById(id: string): Promise<QuizPairGameEntity | null> {
        return this.builder
            .where('pg."id" = :id', { id })
            .leftJoin(UsersTable, 'u')
            .leftJoin(AccountDataTable, 'ac')
            .addSelect('ac."login"', 'firstPlayerLogin')
            .getRawOne()
    }

    async getByStatus(status: QuizPairGameStatusType) {
        return this.builder
            .where('pg."status" = :status', { status })
            .leftJoin(UsersTable, 'u')
            .leftJoin(AccountDataTable, 'ac')
            .addSelect('ac."login"', 'firstPlayerLogin')
            .getRawMany()
    }

    async getOne(userId: string): Promise<QuizPairGameEntity | null> {
        return this.builder
            .where('pg."firstPlayerId" = :userId', { userId })
            .orWhere('pg."secondPlayerId" = :userId', { userId })
            .getRawOne()
    }

    async create(pairGame: QuizPairGameEntity): Promise<QuizPairGameEntity> {
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

}