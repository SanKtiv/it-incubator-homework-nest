import {Injectable} from "@nestjs/common";
import {PairGameRepository} from "../infrastucture/pair-game.repository";
import {QuizPairGameEntity, QuizPairGameStatusType} from "../domain/pair-game.entity";
import {UsersTable} from "../../../users/domain/users.table";
import {createdPairGameOutputModel} from "../api/models/output/pair-game.output.models";

@Injectable()
export class PairGameQuizPairsServices {
    constructor(protected pairGameRepository: PairGameRepository) {
    }

    async createOrJoinPairGame(userId: string ) {
        const pairGame =
            await this.pairGameRepository.getPairGameByUserId(userId)

        if (!pairGame) {
            const status: QuizPairGameStatusType = 'PendingSecondPlayer';

            const anythingPairGames: QuizPairGameEntity =
                await this.pairGameRepository.getPairGamesByStatus(status);

            if(anythingPairGames) {
                anythingPairGames.secondPlayerId = userId;
                anythingPairGames.status = 'Active';
                anythingPairGames.startGameDate = new Date();

                return this.pairGameRepository.createPairGame(anythingPairGames)
            }

            const newPairGame = new QuizPairGameEntity();

            newPairGame.firstPlayerId = userId;
            newPairGame.pairCreatedDate = new Date();
            newPairGame.status = 'PendingSecondPlayer';

            const activePairGame = await this.pairGameRepository.createPairGame(newPairGame)

            return createdPairGameOutputModel(activePairGame)
        }

        if (!pairGame.secondPlayerId) return


    }

}