import {ForbiddenException, Injectable} from "@nestjs/common";
import {PairGameRepository} from "../infrastucture/pair-game.repository";
import {QuizPairGameEntity, QuizPairGameStatusType} from "../domain/pair-game.entity";
import {createdPairGameOutputModel} from "../api/models/output/pair-game.output.models";
import {QuizQuestionsRepository} from "../../questions/infrastructure/quiz-questions.repository";
import {QuizQuestionsEntity} from "../../questions/domain/quiz-questions.entity";
import {UsersTable} from "../../../users/domain/users.table";
import {InputAnswersModels} from "../api/models/input/input-answers.models";
import {AnswersGameEntity} from "../domain/answers-game.entity";
import {throws} from "assert";

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

console.log('Pair game is Active, get entity =', activePairGame)
                return createdPairGameOutputModel(activePairGame!);
            }

            const newPairGame = new QuizPairGameEntity();
            const firstPlayer = new UsersTable();

            firstPlayer.id = userId;

            newPairGame.firstPlayer = firstPlayer;
            newPairGame.pairCreatedDate = new Date();
            newPairGame.status = 'PendingSecondPlayer';

            const pendingPairGame =
                await this.pairGameRepository.createPairGame(newPairGame)

            console.log('create first player entity', pendingPairGame)

            return createdPairGameOutputModel(pendingPairGame!)
        }

        if (!pairGame.secondPlayer.id) return
    }

    async addAnswerPlayerInPairGame(userId: string, dto: InputAnswersModels) {
        const pairGame =
            await this.pairGameRepository.getPairGameByUserId(userId);

        if (!pairGame) throw new ForbiddenException();

        if (pairGame.firstPlayer.id === userId) {
            const numQuestion = pairGame.answersFirstPlayer.length;

            if (numQuestion > 4) throw new ForbiddenException();

            const answerFirstPlayer =
                this.createAnswerPlayer(pairGame, userId, dto, numQuestion);

            pairGame.answersFirstPlayer.push(answerFirstPlayer);

            if (answerFirstPlayer.answerStatus === 'Correct') pairGame.firstPlayerScore++
        }

        if (pairGame.secondPlayer.id === userId) {
            const numQuestion = pairGame.answersSecondPlayer.length;

            if (numQuestion > 4) throw new ForbiddenException();

            const answerSecondPlayer =
                this.createAnswerPlayer(pairGame, userId, dto, numQuestion);

            pairGame.answersSecondPlayer.push(answerSecondPlayer);

            if (answerSecondPlayer.answerStatus === 'Correct') pairGame.answersSecondPlayer++
        }

        await this.pairGameRepository.updatePairGame(pairGame);


    }

    createAnswerPlayer(
        pairGame: QuizPairGameEntity,
        userId: string,
        dto: InputAnswersModels,
        numQuestion: number
    ): AnswersGameEntity {
        const questionId = pairGame.questions[numQuestion].id

        const arrayCorrectAnswers =
            pairGame.questions[numQuestion].correctAnswers.split(",");

        const answerPlayer = new AnswersGameEntity();

        answerPlayer.userId = userId;
        answerPlayer.questionId = questionId;
        answerPlayer.addedAt = new Date();

        const str = (str: string) => str.trim().toLowerCase();

        const resultFind: string | undefined =
            arrayCorrectAnswers.find( e => str(e) === str(dto.answer))

        answerPlayer.answerStatus = resultFind ? 'Correct' : 'Incorrect';

        return answerPlayer;
    }
}