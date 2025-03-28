import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuizPairGameEntity} from "../../domain/pair-game.entity";
import {Repository} from "typeorm";

@Injectable()
export class PairGameRepositoryTypeOrm {
    constructor(@InjectRepository(QuizPairGameEntity) protected repository: Repository<QuizPairGameEntity>) {
    }

    async getOne(userId: string): Promise<QuizPairGameEntity | null | undefined> {
        return this.repository
            .createQueryBuilder('pg')
            .select('pg.*')
            .where('pg."firstPlayerId" = :userId', {userId})
            .getRawOne()
    }

    async create(pairGame: QuizPairGameEntity): Promise<QuizPairGameEntity> {
        return this.repository.save(pairGame);
    }

    async clear(): Promise<void> {
        await this.repository.clear();
    }
}