import {ForbiddenException, Injectable} from '@nestjs/common';
import {PairGameRepository} from '../infrastucture/pair-game.repository';
import {addedAnswerPlayerOutputModel, AnswerPlayerOutputModel, outputModelCreatedPairGame} from '../api/models/output/pair-game.output.models';
import {QuizQuestionsRepository} from '../../questions/infrastructure/quiz-questions.repository';
import {QuestionsEntity} from '../../questions/domain/quiz-questions.entity';
import {UsersTable} from '../../../users/domain/users.table';
import {InputAnswersModels} from '../api/models/input/input-answers.models';
import {PairGamesEntity, QuizPairGameStatusType} from '../domain/pair-games.entity';
import {PairGamePlayersEntity} from '../domain/pair-game-players.entity';
import {QuestionsGameEntity} from '../domain/questions-game.entity';
import {PlayerAnswersEntity} from '../domain/player-answers.entity';
import {UsersService} from "../../../users/application/users.service";
import {UsersRepository} from "../../../users/infrastructure/users.repository";

@Injectable()
export class GameServices {
    constructor(
        protected pairGameRepository: PairGameRepository,
        protected quizQuestionsRepository: QuizQuestionsRepository,
        protected usersRepository: UsersRepository,
    ) {
    }
    async userById(userId: string) {
        return this.usersRepository.findById(userId)
    }

    async getActiveGameByUserId(userId: string) {
        const status = 'Active';

        const game =
            await this.pairGameRepository.getActiveGameByUserId(userId, status);

        if (!game) throw new ForbiddenException();

        return game;
    }

    private updateGameToFinishedStatus(game: PairGamesEntity): PairGamesEntity {
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

    async createGame(userId: string) {
        const unfinishedGame: PairGamesEntity | null =
            await this.pairGameRepository.getUnfinishedGameByUserId(userId);

        if (unfinishedGame) throw new ForbiddenException();

        const statusPending: QuizPairGameStatusType = 'PendingSecondPlayer';

        const pendingGame: PairGamesEntity | null =
            await this.pairGameRepository.getPairGamesByStatus(statusPending);

        if (pendingGame) return this.joinToGame(userId, pendingGame);

        const game = new PairGamesEntity();

        game.firstPlayer = this.createPlayer(userId);

        game.pairCreatedDate = new Date();
        game.status = statusPending;

        const createdGame = await this.pairGameRepository.createPairGame(game);

        return outputModelCreatedPairGame(createdGame!);
    }

    async joinToGame(userId: string, game: PairGamesEntity) {
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

    async createFiveQuestionsForGame(game: PairGamesEntity) {
        const fiveRandomQuestions: QuestionsEntity[] =
            await this.quizQuestionsRepository.getFiveRandomQuestions();

        let index = 0;

        function mapFunc(q: QuestionsEntity) {
            const questionGame = new QuestionsGameEntity();

            questionGame.game = game;
            questionGame.index = index++;
            questionGame.question = q;

            return questionGame
        }

        return fiveRandomQuestions.map(e => mapFunc(e))
    }

    async addAnswerPlayerInGame(
        userId: string,
        dto: InputAnswersModels,
    ): Promise<AnswerPlayerOutputModel> {
        let game = await this.getActiveGameByUserId(userId);
        const usersStatistic = await this.usersRepository.findById(userId);

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
            answer.questionId = question.question.id;
            answer.addedAt = new Date();
            answer.answerStatus = this.getAnswerStatus(dto, question);

            game.firstPlayer.answers!.push(answer);

            countAnswersFirstPlayer = game.firstPlayer.answers!.length;

            if (answer.answerStatus === 'Correct') {
                game.firstPlayer.playerScore++;
                usersStatistic!.statistic.sumScore++;
            }
        }

        if (game.secondPlayer!.user.id === userId) {
            if (countAnswersSecondPlayer === countQuestionsGame)
                throw new ForbiddenException();

            const question = game.questions![countAnswersSecondPlayer]

            answer.gameId = game.id;
            answer.player = game.secondPlayer!;
            answer.questionId = question.question.id;
            answer.addedAt = new Date();
            answer.answerStatus = this.getAnswerStatus(dto, question);

            game.secondPlayer!.answers!.push(answer);

            countAnswersSecondPlayer = game.secondPlayer!.answers!.length;

            if (answer.answerStatus === 'Correct') game.secondPlayer!.playerScore++;
        }

        if (
            countQuestionsGame === countAnswersFirstPlayer &&
            countQuestionsGame === countAnswersSecondPlayer
        ) game = this.updateGameToFinishedStatus(game)

        await this.pairGameRepository.updatePairGame(game);

        return addedAnswerPlayerOutputModel(answer);
    }

    private getAnswerStatus(
        dto: InputAnswersModels,
        question: QuestionsGameEntity
    ) {
        const correctStatus = 'Correct';
        const incorrectStatus = 'Incorrect';
        const arrayCorrectAnswers = question.question.correctAnswers.split(',');

        const str = (str: string) => str.trim().toLowerCase();

        const resultFind: string | undefined =
            arrayCorrectAnswers.find((e) => str(e) === str(dto.answer));

        if (resultFind) return correctStatus;

        return incorrectStatus;
    }
}
