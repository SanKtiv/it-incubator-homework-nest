import {ForbiddenException, Injectable} from "@nestjs/common";
import {PairGameQueryRepositoryTypeOrm} from "./postgresq/pair-game.query.repository-typeorm";
import {CreatedPairGameOutputModel, createdPairGameOutputModel} from "../api/models/output/pair-game.output.models";
import {QuizPairGameEntity} from "../domain/pair-game.entity";

@Injectable()
export class PairGameQueryRepository {
    constructor(protected repository: PairGameQueryRepositoryTypeOrm) {
    }

    async getById(id: string): Promise<CreatedPairGameOutputModel> {
        const pairGame = await this.repository.getById(id)

        if (!pairGame) throw new ForbiddenException();

        return createdPairGameOutputModel(pairGame);
    }
}