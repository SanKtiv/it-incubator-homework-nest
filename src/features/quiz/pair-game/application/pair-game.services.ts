import {Injectable} from "@nestjs/common";
import {PairGameRepository} from "../infrastucture/pair-game.repository";
import {QuizPairGameEntity, QuizPairGameStatusType} from "../domain/pair-game.entity";
import {createdPairGameOutputModel} from "../api/models/output/pair-game.output.models";
import {QuizQuestionsRepository} from "../../questions/infrastructure/quiz-questions.repository";
import {QuizQuestionsEntity} from "../../questions/domain/quiz-questions.entity";
import {UsersTable} from "../../../users/domain/users.table";
import {AccountDataTable} from "../../../users/domain/account-data.table";

@Injectable()
export class PairGameQuizPairsServices {
    constructor(protected pairGameRepository: PairGameRepository,
                protected quizQuestionsRepository: QuizQuestionsRepository) {
    }

    async createOrJoinPairGame(userId: string ) {
        const pairGame =
            await this.pairGameRepository.getPairGameByUserId(userId)

        if (!pairGame) {
            const status: QuizPairGameStatusType = 'PendingSecondPlayer';

            const anythingPairGames: QuizPairGameEntity | null =
                await this.pairGameRepository.getPairGamesByStatus(status);

            if(anythingPairGames) {
                const questions: QuizQuestionsEntity[] =
                    await this.quizQuestionsRepository.getFiveRandomQuestions();

                const secondPlayer = new UsersTable();
                secondPlayer.id = userId;

                anythingPairGames.secondPlayer = secondPlayer;
                anythingPairGames.status = 'Active';
                anythingPairGames.startGameDate = new Date();
                anythingPairGames.questions = questions;

                const activePairGame =
                    await this.pairGameRepository.createPairGame(anythingPairGames);
                console.log('Player entity =', activePairGame?.firstPlayer)
console.log('Pair game is Active, get entity =', activePairGame)
                return createdPairGameOutputModel(activePairGame);
            }

            const newPairGame = new QuizPairGameEntity();
            const firstPlayer = new UsersTable();

            firstPlayer.id = userId;
            //firstPlayer.accountData = new AccountDataTable();

            newPairGame.firstPlayer = firstPlayer;
            newPairGame.pairCreatedDate = new Date();
            newPairGame.status = 'PendingSecondPlayer';

            const activePairGame = await this.pairGameRepository.createPairGame(newPairGame)

            return createdPairGameOutputModel(activePairGame)
        }

        if (!pairGame.secondPlayer.id) return


    }

}