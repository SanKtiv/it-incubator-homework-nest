import {Injectable} from "@nestjs/common";
import {PairGameRepositoryTypeOrm} from "./postgresq/pair-game.repository-typeorm";
import {QuizPairGameEntity, QuizPairGameStatusType} from "../domain/pair-game.entity";
import {InputAnswersModels} from "../api/models/input/input-answers.models";

@Injectable()
export class PairGameRepository {
    constructor(protected  repository: PairGameRepositoryTypeOrm) {
    }

    async getPairGameByUserId(userId: string): Promise<QuizPairGameEntity | null | undefined> {
        return this.repository.getOne(userId)
    }

    async getPairGamesByStatus(status: QuizPairGameStatusType) {
        return this.repository.getByStatus(status)
    }

    async createPairGame(pairGame: QuizPairGameEntity): Promise<QuizPairGameEntity | null | undefined> {
        return this.repository.create(pairGame)
    }

    async addAnswerPlayer(userId: string, dto: InputAnswersModels) {
    }

    async clear(): Promise<void> {
        await this.repository.clear();
    }
}