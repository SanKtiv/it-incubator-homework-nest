import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {PairGameQueryRepositoryTypeOrm} from "./postgresq/pair-game.query.repository-typeorm";
import {CreatedPairGameOutputModel, createdPairGameOutputModel} from "../api/models/output/pair-game.output.models";
import {QuizPairGameEntity} from "../domain/pair-game.entity";

@Injectable()
export class PairGameQueryRepository {
    constructor(protected repository: PairGameQueryRepositoryTypeOrm) {
    }

    async getById(id: string): Promise<CreatedPairGameOutputModel> {
        const pairGame = await this.repository.getById(id)
console.log('pairGame in getById =', pairGame)
        if (!pairGame) throw new ForbiddenException();

        return createdPairGameOutputModel(pairGame);
    }

    async getByUserId(userId: string): Promise<CreatedPairGameOutputModel> {
        const pairGame = await this.repository.getByUserId(userId);

        if (!pairGame) throw new NotFoundException();

        return createdPairGameOutputModel(pairGame);
    }
}