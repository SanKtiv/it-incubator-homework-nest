import {Injectable} from "@nestjs/common";
import {PairGameRepositoryTypeOrm} from "./postgresq/pair-game.repository-typeorm";

@Injectable()
export class PairGameRepository {
    constructor(protected  repository: PairGameRepositoryTypeOrm) {
    }

    async getPairGame() {}

    async createPairGame() {}
}