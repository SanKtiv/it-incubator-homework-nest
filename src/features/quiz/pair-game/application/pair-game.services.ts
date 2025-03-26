import {Injectable} from "@nestjs/common";
import {PairGameRepository} from "../infrastucture/pair-game.repository";

@Injectable()
export class PairGameQuizPairsServices {
    constructor(protected pairGameRepository: PairGameRepository) {
    }

    async createOrJoinPairGame(userId: string ) {
        const pairGame = await this.pairGameRepository.getPairGame(userId)

    }
}