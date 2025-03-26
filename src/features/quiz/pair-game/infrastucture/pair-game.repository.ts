import {Injectable} from "@nestjs/common";
import {PairGameRepositoryTypeOrm} from "./postgresq/pair-game.repository-typeorm";

@Injectable()
export class PairGameRepository {
    constructor(protected  repository: PairGameRepositoryTypeOrm) {
    }

    async getPairGame(userId: string) {
        return this.repository.getOne(userId)
    }

    async createPairGame() {}
}