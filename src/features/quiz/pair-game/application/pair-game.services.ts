import {Injectable} from "@nestjs/common";
import {PairGameRepository} from "../infrastucture/pair-game.repository";
import {QuizPairGameEntity} from "../domain/pair-game.entity";
import {UsersTable} from "../../../users/domain/users.table";

@Injectable()
export class PairGameQuizPairsServices {
    constructor(protected pairGameRepository: PairGameRepository) {
    }

    async createOrJoinPairGame(userId: string ) {
        const pairGame = await this.pairGameRepository.getPairGame(userId)

        if(!pairGame) {
            const newPairGame = new QuizPairGameEntity();

            newPairGame.firstPlayerId = userId;
            newPairGame.pairCreatedDate = new Date();
            newPairGame.status = 'PendingSecondPlayer';

            return this.pairGameRepository.createPairGame(newPairGame)
        }

    }
}