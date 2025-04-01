import {Injectable} from "@nestjs/common";
import {PairGameQueryRepositoryTypeOrm} from "./postgresq/pair-game.query.repository-typeorm";

@Injectable()
export class PairGameQueryRepository {
    constructor(protected repository: PairGameQueryRepositoryTypeOrm) {
    }

    async getById(id: string) {
        const pairGame = await this.repository.getById(id)

        return pairGame
    }
}