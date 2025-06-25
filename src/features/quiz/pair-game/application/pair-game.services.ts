import {ForbiddenException, Injectable} from '@nestjs/common';
import {PairGameRepository} from '../infrastucture/pair-game.repository';
import {
    QuizPairGameEntity,
    QuizPairGameStatusType,
} from '../domain/pair-game.entity';
import {
    addedAnswerPlayerOutputModel,
    AnswerPlayerOutputModel,
    CreatedPairGameOutputModel,
    createdPairGameOutputModel, newCreatedPairGameOutputModel,
} from '../api/models/output/pair-game.output.models';
import {QuizQuestionsRepository} from '../../questions/infrastructure/quiz-questions.repository';
import {QuizQuestionsEntity} from '../../questions/domain/quiz-questions.entity';
import {UsersTable} from '../../../users/domain/users.table';
import {InputAnswersModels} from '../api/models/input/input-answers.models';
import {AnswersGameEntity} from '../domain/answers-game.entity';
import {NewPairGameEntity} from '../domain/new-pair-game.entity';
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

    async createPairGame(userId: string): Promise<CreatedPairGameOutputModel> {
        const pairGameCurrentUser =
            await this.pairGameRepository.getNotFinishedPairGameByUserId(userId);

        if (pairGameCurrentUser) throw new ForbiddenException();

        const statusPending: QuizPairGameStatusType = 'PendingSecondPlayer';

        const pendingPairGame: QuizPairGameEntity | null =
            await this.pairGameRepository.getPairGamesByStatus(statusPending);

        if (pendingPairGame) return this.joinToPairGame(userId, pendingPairGame);

        const pairGame = new QuizPairGameEntity();

        const firstPlayer = new UsersTable();

        firstPlayer.id = userId;

        pairGame.firstPlayer = firstPlayer;
        pairGame.pairCreatedDate = new Date();
        pairGame.status = statusPending;

        const createdPendingPairGame =
            await this.pairGameRepository.createPairGame(pairGame);

        return createdPairGameOutputModel(createdPendingPairGame!);
    }

    async getActiveGameByUserId(userId: string) {
        const status = 'Active';
        const game =
            await this.pairGameRepository.newGetActiveGameByUserId(userId, status);

        if (!game) throw new ForbiddenException();

        return game;
    }

    async newCreatePairGame(userId: string) {
        const pairGameCurrentUser =
            await this.pairGameRepository.newGetNotFinishedPairGameByUserId(userId);

        if (pairGameCurrentUser) throw new ForbiddenException();

        const statusPending: QuizPairGameStatusType = 'PendingSecondPlayer';

        const pendingPairGame: NewPairGameEntity | null =
            await this.pairGameRepository.newGetPairGamesByStatus(statusPending);

        if (pendingPairGame) return this.newJoinToPairGame(userId, pendingPairGame);

        const pairGame = new NewPairGameEntity();

        pairGame.firstPlayer = this.createPlayer(userId);

        pairGame.pairCreatedDate = new Date();
        pairGame.status = statusPending;

        const createdPendingPairGame =
            await this.pairGameRepository.newCreatePairGame(pairGame);

        return newCreatedPairGameOutputModel(createdPendingPairGame!);
    }

    async joinToPairGame(
        userId: string,
        pendingPairGame: QuizPairGameEntity,
    ): Promise<CreatedPairGameOutputModel> {
        const questions: QuizQuestionsEntity[] =
            await this.quizQuestionsRepository.getFiveRandomQuestions();

        const secondPlayer = new UsersTable();
        secondPlayer.id = userId;

        pendingPairGame.secondPlayer = secondPlayer;
        pendingPairGame.status = 'Active';
        pendingPairGame.startGameDate = new Date();
        pendingPairGame.questions = questions;

        const activePairGame =
            await this.pairGameRepository.createPairGame(pendingPairGame);

        return createdPairGameOutputModel(activePairGame!);
    }

    async newJoinToPairGame(userId: string, pendingPairGame: NewPairGameEntity) {
        const questions = await this.createFiveQuestionsForGame(pendingPairGame);

        pendingPairGame.secondPlayer = this.createPlayer(userId);
        pendingPairGame.status = 'Active';
        pendingPairGame.startGameDate = new Date();
        pendingPairGame.questions = questions;

        const activePairGame =
            await this.pairGameRepository.newCreatePairGame(pendingPairGame);

        return newCreatedPairGameOutputModel(activePairGame!);
    }

    private createPlayer(userId: string): PairGamePlayersEntity {
        const player = new PairGamePlayersEntity();

        player.user = new UsersTable();
        player.user.id = userId;
        player.answers = null;

        return player;
    }

    private createAnswerPlayerEntity(): PlayerAnswersEntity {
        const playerAnswer = new PlayerAnswersEntity();



        return playerAnswer;
    }

    async createFiveQuestionsForGame(game: NewPairGameEntity) {
        const fiveRandomQuestions: QuizQuestionsEntity[] =
            await this.quizQuestionsRepository.getFiveRandomQuestions();

        let index = 0;

        return fiveRandomQuestions.map((e) => ({
            index: index++,
            questions: e,
            game: game,
        })) as QuestionsGameEntity[];
    }


    async addAnswerPlayerInPairGame(
        userId: string,
        dto: InputAnswersModels,
    ): Promise<AnswerPlayerOutputModel> {
        const pairGame =
            await this.pairGameRepository.getActivePairGameByUserId(userId);

        if (!pairGame) throw new ForbiddenException();

        const countQuestionsGame: number = pairGame.questions.length;

        let countAnswersFirstPlayer: number = pairGame.answersFirstPlayer.length;
        let countAnswersSecondPlayer: number = pairGame.answersSecondPlayer.length;
        let answerPlayer: AnswersGameEntity = new AnswersGameEntity();

        if (pairGame.firstPlayer.id === userId) {
            if (countAnswersFirstPlayer === countQuestionsGame)
                throw new ForbiddenException();

            answerPlayer = this.createAnswerPlayer(
                pairGame,
                userId,
                dto,
                countAnswersFirstPlayer,
            );

            pairGame.answersFirstPlayer.push(answerPlayer);

            countAnswersFirstPlayer = pairGame.answersFirstPlayer.length;

            if (answerPlayer.answerStatus === 'Correct') pairGame.firstPlayerScore++;
        }

        if (pairGame.secondPlayer.id === userId) {
            if (countAnswersSecondPlayer === countQuestionsGame)
                throw new ForbiddenException();

            answerPlayer = this.createAnswerPlayer(
                pairGame,
                userId,
                dto,
                countAnswersSecondPlayer,
            );

            pairGame.answersSecondPlayer.push(answerPlayer);
            countAnswersSecondPlayer = pairGame.answersSecondPlayer.length;

            if (answerPlayer.answerStatus === 'Correct') pairGame.secondPlayerScore++;
        }

        if (
            countQuestionsGame === countAnswersFirstPlayer &&
            countQuestionsGame === countAnswersSecondPlayer
        ) {
            pairGame.status = 'Finished';

            pairGame.finishGameDate = new Date();

            pairGame.answersFirstPlayer.sort(
                (a: any, b: any) => b.addedAt - a.addedAt,
            );

            pairGame.answersSecondPlayer.sort(
                (a: any, b: any) => b.addedAt - a.addedAt,
            );

            const correctAnswersFirstPlayer = pairGame.answersFirstPlayer.find(
                (e) => e.answerStatus === 'Correct',
            );

            const correctAnswersSecondPlayer = pairGame.answersSecondPlayer.find(
                (e) => e.answerStatus === 'Correct',
            );

            if (
                pairGame.answersFirstPlayer[0].addedAt >
                pairGame.answersSecondPlayer[0].addedAt &&
                correctAnswersSecondPlayer
            )
                pairGame.secondPlayerScore++;

            if (
                pairGame.answersFirstPlayer[0].addedAt <
                pairGame.answersSecondPlayer[0].addedAt &&
                correctAnswersFirstPlayer
            )
                pairGame.firstPlayerScore++;
        }

        await this.pairGameRepository.updatePairGame(pairGame);

        return addedAnswerPlayerOutputModel(answerPlayer);
    }

    async newAddAnswerPlayerInGame(
        userId: string,
        dto: InputAnswersModels,
    ): Promise<AnswerPlayerOutputModel> {
        const game = await this.getActiveGameByUserId(userId);

        const getLength = arr => arr ? arr.length : 0;

        const countQuestionsGame = getLength(game.questions);
        let countAnswersFirstPlayer = getLength(game.firstPlayer.answers);
        let countAnswersSecondPlayer = getLength(game.secondPlayer!.answers);
        let answerPlayer = new PlayerAnswersEntity();

        if (game.firstPlayer.user.id === userId) {
            if (countAnswersFirstPlayer === countQuestionsGame)
                throw new ForbiddenException();

            answerPlayer = this.newCreateAnswerPlayer(
                game,
                userId,
                dto,
                countAnswersFirstPlayer,
            );

            game.firstPlayer.answers!.push(answerPlayer);

            countAnswersFirstPlayer = game.firstPlayer.answers!.length;

            if (answerPlayer.answerStatus === 'Correct')
                game.firstPlayer.playerScore++;
        }

        if (game.secondPlayer!.user.id === userId) {
            if (countAnswersSecondPlayer === countQuestionsGame)
                throw new ForbiddenException();

            answerPlayer = this.newCreateAnswerPlayer(
                game,
                userId,
                dto,
                countAnswersFirstPlayer,
            );

            game.secondPlayer!.answers!.push(answerPlayer);
            countAnswersSecondPlayer = game.secondPlayer!.answers!.length;

            if (answerPlayer.answerStatus === 'Correct')
                game.secondPlayer!.playerScore++;
        }

        if (
            countQuestionsGame === countAnswersFirstPlayer &&
            countQuestionsGame === countAnswersSecondPlayer
        ) {
            game.status = 'Finished';

            game.finishGameDate = new Date();

            game.firstPlayer.answers!.sort(
                (a: any, b: any) => b.addedAt - a.addedAt,
            );

            game.secondPlayer!.answers!.sort(
                (a: any, b: any) => b.addedAt - a.addedAt,
            );

            const correctAnswersFirstPlayer = game.firstPlayer.answers!.find(
                (e) => e.answerStatus === 'Correct',
            );

            const correctAnswersSecondPlayer = game.secondPlayer!.answers!.find(
                (e) => e.answerStatus === 'Correct',
            );

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
        }

        await this.pairGameRepository.updatePairGame(game);

        return addedAnswerPlayerOutputModel(answerPlayer);
    }

    private newCreateAnswerPlayer(
        game: NewPairGameEntity,
        userId: string,
        dto: InputAnswersModels,
        numQuestion: number,
    ): PlayerAnswersEntity {
        const question = game.questions![numQuestion];

        const questionId = question.id;

        const arrayCorrectAnswers =
            question.questions.correctAnswers.split(',');

        const answerPlayer = new PlayerAnswersEntity();

        answerPlayer.player = this.createPlayer(userId);
        answerPlayer.gameId = game.id;
        answerPlayer.questionId = questionId;
        answerPlayer.addedAt = new Date();

        const str = (str: string) => str.trim().toLowerCase();

        const resultFind: string | undefined = arrayCorrectAnswers.find(
            (e) => str(e) === str(dto.answer),
        );

        answerPlayer.answerStatus = resultFind ? 'Correct' : 'Incorrect';

        return answerPlayer;
    }

    private createAnswerPlayer(
        pairGame: QuizPairGameEntity,
        userId: string,
        dto: InputAnswersModels,
        numQuestion: number,
    ): AnswersGameEntity {
        const questionId = pairGame.questions[numQuestion].id;

        const arrayCorrectAnswers =
            pairGame.questions[numQuestion].correctAnswers.split(',');

        const answerPlayer = new AnswersGameEntity();

        answerPlayer.userId = userId;
        answerPlayer.questionId = questionId;
        answerPlayer.addedAt = new Date();

        const str = (str: string) => str.trim().toLowerCase();

        const resultFind: string | undefined = arrayCorrectAnswers.find(
            (e) => str(e) === str(dto.answer),
        );

        answerPlayer.answerStatus = resultFind ? 'Correct' : 'Incorrect';

        return answerPlayer;
    }
}
