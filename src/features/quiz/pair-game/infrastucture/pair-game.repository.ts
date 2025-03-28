import {Injectable} from "@nestjs/common";
import {PairGameRepositoryTypeOrm} from "./postgresq/pair-game.repository-typeorm";
import {QuizPairGameEntity} from "../domain/pair-game.entity";

@Injectable()
export class PairGameRepository {
    constructor(protected  repository: PairGameRepositoryTypeOrm) {
    }

    async getPairGame(userId: string): Promise<QuizPairGameEntity | null> {
        return this.repository.getOne(userId)
    }

    async createPairGame(pairGame: QuizPairGameEntity): Promise<QuizPairGameEntity> {
        return this.repository.create(pairGame)
    }

    async clear(): Promise<void> {
        await this.repository.clear();
    }
}