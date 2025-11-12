import {ForbiddenException, Injectable} from '@nestjs/common';
import {PairGameRepository} from '../infrastucture/pair-game.repository';
import {
    addedAnswerPlayerOutputModel,
    AnswerPlayerOutputModel,
    outputModelCreatedPairGame
} from '../api/models/output/pair-game.output.models';
import {QuizQuestionsRepository} from '../../questions/infrastructure/quiz-questions.repository';
import {QuestionsEntity} from '../../questions/domain/quiz-questions.entity';
import {UsersTable} from '../../../users/domain/users.table';
import {InputAnswersModels} from '../api/models/input/input-answers.models';
import {PairGamesEntity, QuizPairGameStatusType} from '../domain/pair-games.entity';
import {QuestionsGameEntity} from '../domain/questions-game.entity';
import {PlayerAnswersEntity} from '../domain/player-answers.entity';
import {PlayersEntity} from "../domain/players.entity";

@Injectable()
export class GameServices {
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

    private updateGameToFinishedStatus(game: PairGamesEntity) {
        const [firstPlayer, secondPlayer] = game.players;

        game.status = 'Finished';
        game.finishGameDate = new Date();

        firstPlayer.answers!.sort(
            (a: any, b: any) => b.addedAt - a.addedAt,
        );

        secondPlayer!.answers!.sort(
            (a: any, b: any) => b.addedAt - a.addedAt,
        );

        const correctAnswersFirstPlayer =
            firstPlayer.answers!
                .find((e) => e.answerStatus === 'Correct');

        const correctAnswersSecondPlayer =
            secondPlayer!.answers!
                .find((e) => e.answerStatus === 'Correct');

        if (
            firstPlayer.answers![0].addedAt >
            secondPlayer!.answers![0].addedAt &&
            correctAnswersSecondPlayer
        ) secondPlayer!.score++;


        if (
            firstPlayer.answers![0].addedAt <
            secondPlayer!.answers![0].addedAt &&
            correctAnswersFirstPlayer
        ) firstPlayer.score++;

        if (firstPlayer.score > secondPlayer!.score) {
            firstPlayer.win++;
            secondPlayer!.lose++;
        }

        if (firstPlayer.score < secondPlayer!.score) {
            secondPlayer!.win++;
            firstPlayer.lose++;
        }

        if (firstPlayer.score == secondPlayer!.score) {
            secondPlayer!.draw++;
            firstPlayer.draw++;
        }
    }

    async connectToGame(userId: string) {
        const unfinishedGame: PairGamesEntity | null =
            await this.pairGameRepository.getUnfinishedGameByUserId(userId);

        if (unfinishedGame) throw new ForbiddenException();

        const statusPending: QuizPairGameStatusType = 'PendingSecondPlayer';

        const pendingGame: PairGamesEntity | null =
            await this.pairGameRepository.getPairGamesByStatus(statusPending);

        let game: PairGamesEntity | null | undefined;

        if (pendingGame) game = await this.joinToGame(userId, pendingGame);

        else game = await this.createGame(userId, statusPending);

        game = await this.pairGameRepository.getGameById(game!.id)

        return outputModelCreatedPairGame(game!);
    }

    async createGame(userId: string, status: QuizPairGameStatusType) {
        const game = new PairGamesEntity();

        const players: PlayersEntity[] = [];

        const player = this.createPlayerByUserId(userId);

        players.push(player)

        game.players = players;

        game.pairCreatedDate = new Date();

        game.questions = null;

        game.status = status;

        return this.pairGameRepository.saveGame(game);
    }

    async joinToGame(userId: string, game: PairGamesEntity) {
        const questions = await this.createFiveQuestionsForGame(game);

        const player = this.createPlayerByUserId(userId);

        player.index = 1;

        game.players.push(player);

        game.status = 'Active';

        game.startGameDate = new Date();

        game.questions = questions;

        return this.pairGameRepository.saveGame(game);
    }

    createPlayerByUserId(userId: string): PlayersEntity {

        const player = new PlayersEntity();

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
        const game = await this.getActiveGameByUserId(userId);

        if (!game) throw new ForbiddenException();

        const questions = game.questions;

        if (!questions) throw new ForbiddenException();

        const answer = new PlayerAnswersEntity();

        game.players.forEach( (player, index) => {
            if (player.user.id === userId) {
                const answers = player.answers;

                if (!answers) throw new ForbiddenException();

                if (questions.length === answers.length) throw new ForbiddenException();

                const question = questions[answers.length];

                answer.gameId = game.id;
                answer.player = player;
                answer.questionId = question.question.id;
                answer.addedAt = new Date();
                answer.answerStatus = this.getAnswerStatus(dto, question);

                game.players[index].answers?.push(answer);

                if (answer.answerStatus === 'Correct') game.players[index].score++;
            }
        })

        if (questions.length === game.players[0].answers?.length &&
            questions.length === game.players[1].answers?.length)
            this.updateGameToFinishedStatus(game)

        await this.pairGameRepository.saveGame(game);

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
