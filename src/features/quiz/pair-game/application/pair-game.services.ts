import {ForbiddenException, Injectable} from '@nestjs/common';
import {PairGameRepository} from '../infrastucture/pair-game.repository';
// import { QuizPairGameStatusType } from '../domain/pair-game.entity';
import {addedAnswerPlayerOutputModel, AnswerPlayerOutputModel, outputModelCreatedPairGame} from '../api/models/output/pair-game.output.models';
import {QuizQuestionsRepository} from '../../questions/infrastructure/quiz-questions.repository';
import {NewQuizQuestionsEntity} from '../../questions/domain/quiz-questions.entity';
import {UsersTable} from '../../../users/domain/users.table';
import {InputAnswersModels} from '../api/models/input/input-answers.models';
import {NewPairGameEntity, QuizPairGameStatusType} from '../domain/new-pair-game.entity';
import {PairGamePlayersEntity} from '../domain/pair-game-players.entity';
import {QuestionsGameEntity} from '../domain/new-questions-game.entity';
import {PlayerAnswersEntity} from '../domain/new-player-answers.entity';

@Injectable()
export class PairGameQuizPairsServices {
    constructor(
        protected pairGameRepository: PairGameRepository,
        protected quizQuestionsRepository: QuizQuestionsRepository,
    ) {
    }
    async getActiveGameByUserId(userId: string) {
        const status = 'Active';

        const game =
            await this.pairGameRepository.getActiveGameByUserId(userId, status);

        if (!game) throw new ForbiddenException();

        return game;
    }

    private createFinishedGame(game: NewPairGameEntity): NewPairGameEntity {
        game.status = 'Finished';
        game.finishGameDate = new Date();
        game.firstPlayer.gamesCount++;
        game.secondPlayer!.gamesCount++;

        game.firstPlayer.answers!.sort(
            (a: any, b: any) => b.addedAt - a.addedAt,
        );

        game.secondPlayer!.answers!.sort(
            (a: any, b: any) => b.addedAt - a.addedAt,
        );

        const correctAnswersFirstPlayer =
            game.firstPlayer.answers!
                .find((e) => e.answerStatus === 'Correct');

        const correctAnswersSecondPlayer =
            game.secondPlayer!.answers!
                .find((e) => e.answerStatus === 'Correct');

        if (
            game.firstPlayer.answers![0].addedAt >
            game.secondPlayer!.answers![0].addedAt &&
            correctAnswersSecondPlayer
        )
            game.secondPlayer!.playerScore++;

        if (
            game.firstPlayer.answers![0].addedAt <
            game.secondPlayer!.answers![0].addedAt &&
            correctAnswersFirstPlayer
        )
            game.firstPlayer.playerScore++;

        if (game.firstPlayer.playerScore > game.secondPlayer!.playerScore) {
            game.firstPlayer.winsCount++;

            game.secondPlayer!.lossesCount++;
        }

        if (game.firstPlayer.playerScore < game.secondPlayer!.playerScore) {
            game.secondPlayer!.winsCount++;

            game.firstPlayer.lossesCount++;
        }

        if (game.firstPlayer.playerScore == game.secondPlayer!.playerScore) {
            game.secondPlayer!.drawsCount++;

            game.firstPlayer!.drawsCount++;
        }

        return game;
    }

    async createPairGame(userId: string) {
        const pairGameCurrentUser =
            await this.pairGameRepository.getNotFinishedPairGameByUserId(userId);

        if (pairGameCurrentUser) throw new ForbiddenException();

        const statusPending: QuizPairGameStatusType = 'PendingSecondPlayer';

        const pendingPairGame: NewPairGameEntity | null =
            await this.pairGameRepository.getPairGamesByStatus(statusPending);

        if (pendingPairGame) return this.createActiveGame(userId, pendingPairGame);

        const pairGame = new NewPairGameEntity();

        pairGame.firstPlayer = this.createPlayer(userId);

        pairGame.pairCreatedDate = new Date();
        pairGame.status = statusPending;

        const createdPendingPairGame =
            await this.pairGameRepository.createPairGame(pairGame);

        return outputModelCreatedPairGame(createdPendingPairGame!);
    }

    async createActiveGame(userId: string, game: NewPairGameEntity) {
        const questions = await this.createFiveQuestionsForGame(game);

        game.secondPlayer = this.createPlayer(userId);
        game.status = 'Active';
        game.startGameDate = new Date();
        game.questions = questions;

        const activeGame =
            await this.pairGameRepository.createPairGame(game);

        return outputModelCreatedPairGame(activeGame!);
    }

    private createPlayer(userId: string): PairGamePlayersEntity {
        const player = new PairGamePlayersEntity();

        player.user = new UsersTable();
        player.user.id = userId;
        player.answers = null;

        return player;
    }

    async createFiveQuestionsForGame(game: NewPairGameEntity) {
        const fiveRandomQuestions: NewQuizQuestionsEntity[] =
            await this.quizQuestionsRepository.getFiveRandomQuestions();

        let index = 0;

        function mapFunc(q: NewQuizQuestionsEntity) {
            const questionGame = new QuestionsGameEntity();

            questionGame.game = game;
            questionGame.index = index++;
            questionGame.questions = q;

            return questionGame
        }

        return fiveRandomQuestions.map(e => mapFunc(e))
    }

    async addAnswerPlayerInGame(
        userId: string,
        dto: InputAnswersModels,
    ): Promise<AnswerPlayerOutputModel> {
        let game = await this.getActiveGameByUserId(userId);

        const getLength = arr => arr ? arr.length : 0;

        const countQuestionsGame = getLength(game.questions);
        let countAnswersFirstPlayer = getLength(game.firstPlayer.answers);
        let countAnswersSecondPlayer = getLength(game.secondPlayer!.answers);

        const answer = new PlayerAnswersEntity();

        if (game.firstPlayer.user.id === userId) {
            if (countAnswersFirstPlayer === countQuestionsGame)
                throw new ForbiddenException();

            const question = game.questions![countAnswersFirstPlayer]

            answer.gameId = game.id;
            answer.player = game.firstPlayer;
            answer.questionId = question.questions.id;
            answer.addedAt = new Date();
            answer.answerStatus = this.getAnswerStatus(dto, question);

            game.firstPlayer.answers!.push(answer);

            countAnswersFirstPlayer = game.firstPlayer.answers!.length;

            if (answer.answerStatus === 'Correct') game.firstPlayer.playerScore++;
        }

        if (game.secondPlayer!.user.id === userId) {
            if (countAnswersSecondPlayer === countQuestionsGame)
                throw new ForbiddenException();

            const question = game.questions![countAnswersSecondPlayer]

            answer.gameId = game.id;
            answer.player = game.secondPlayer!;
            answer.questionId = question.questions.id;
            answer.addedAt = new Date();
            answer.answerStatus = this.getAnswerStatus(dto, question);

            game.secondPlayer!.answers!.push(answer);

            countAnswersSecondPlayer = game.secondPlayer!.answers!.length;

            if (answer.answerStatus === 'Correct') game.secondPlayer!.playerScore++;
        }

        if (
            countQuestionsGame === countAnswersFirstPlayer &&
            countQuestionsGame === countAnswersSecondPlayer
        ) game = this.createFinishedGame(game)

        await this.pairGameRepository.updatePairGame(game);

        return addedAnswerPlayerOutputModel(answer);
    }

    private getAnswerStatus(
        dto: InputAnswersModels,
        question: QuestionsGameEntity
    ) {
        const correctStatus = 'Correct';
        const incorrectStatus = 'Incorrect';
        const arrayCorrectAnswers = question.questions.correctAnswers.split(',');

        const str = (str: string) => str.trim().toLowerCase();

        const resultFind: string | undefined =
            arrayCorrectAnswers.find((e) => str(e) === str(dto.answer));

        if (resultFind) return correctStatus;

        return incorrectStatus;
    }
}
