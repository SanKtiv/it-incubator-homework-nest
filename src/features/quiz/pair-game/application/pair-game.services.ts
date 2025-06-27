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

    private createFinishedGame(game: NewPairGameEntity): NewPairGameEntity {
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

        return game;
    }

    async newCreatePairGame(userId: string) {
        const pairGameCurrentUser =
            await this.pairGameRepository.newGetNotFinishedPairGameByUserId(userId);

        if (pairGameCurrentUser) throw new ForbiddenException();

        const statusPending: QuizPairGameStatusType = 'PendingSecondPlayer';

        const pendingPairGame: NewPairGameEntity | null =
            await this.pairGameRepository.newGetPairGamesByStatus(statusPending);

        if (pendingPairGame) return this.createActiveGame(userId, pendingPairGame);

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

    async createActiveGame(userId: string, game: NewPairGameEntity) {
        const questions = await this.createFiveQuestionsForGame(game);

        game.secondPlayer = this.createPlayer(userId);
        game.status = 'Active';
        game.startGameDate = new Date();
        game.questions = questions;

        const activeGame =
            await this.pairGameRepository.newCreatePairGame(game);

        return newCreatedPairGameOutputModel(activeGame!);
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

            answer.player = game.firstPlayer;
            answer.questionId = question.id
            answer.answerStatus = this.getAnswerStatus(dto, question);

            game.firstPlayer.answers!.push(answer);

            countAnswersFirstPlayer = game.firstPlayer.answers!.length;

            if (answer.answerStatus === 'Correct') game.firstPlayer.playerScore++;
        }

        if (game.secondPlayer!.user.id === userId) {
            if (countAnswersSecondPlayer === countQuestionsGame)
                throw new ForbiddenException();

            const question = game.questions![countAnswersSecondPlayer]

            answer.player = game.secondPlayer!;
            answer.questionId = question.id
            answer.answerStatus = this.getAnswerStatus(dto, question);

            game.secondPlayer!.answers!.push(answer);

            countAnswersSecondPlayer = game.secondPlayer!.answers!.length;

            if (answer.answerStatus === 'Correct') game.secondPlayer!.playerScore++;
        }

        if (
            countQuestionsGame === countAnswersFirstPlayer &&
            countQuestionsGame === countAnswersSecondPlayer
        ) game = this.createFinishedGame(game)

        await this.pairGameRepository.newUpdatePairGame(game);

        return addedAnswerPlayerOutputModel(answer);
    }

    private createAnswerForPlayer(
        game: NewPairGameEntity,
        player: PairGamePlayersEntity,
        dto: InputAnswersModels,
        question: QuestionsGameEntity,
    ): PlayerAnswersEntity {
        const answer = new PlayerAnswersEntity();

            answer.player = player;
            answer.questionId = question.id;
        answer.gameId = game.id;
        answer.addedAt = new Date();

        const arrayCorrectAnswers =
            question.questions.correctAnswers.split(',');

        const str = (str: string) => str.trim().toLowerCase();

        const resultFind: string | undefined = arrayCorrectAnswers.find(
            (e) => str(e) === str(dto.answer),
        );

        answer.answerStatus = resultFind ? 'Correct' : 'Incorrect';

        return answer;
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
