import { ForbiddenException, Injectable } from '@nestjs/common';
import { PairGameRepository } from '../infrastucture/pair-game.repository';
import {
  QuizPairGameEntity,
  QuizPairGameStatusType,
} from '../domain/pair-game.entity';
import {addedAnswerPlayerOutputModel, createdPairGameOutputModel} from '../api/models/output/pair-game.output.models';
import { QuizQuestionsRepository } from '../../questions/infrastructure/quiz-questions.repository';
import { QuizQuestionsEntity } from '../../questions/domain/quiz-questions.entity';
import { UsersTable } from '../../../users/domain/users.table';
import { InputAnswersModels } from '../api/models/input/input-answers.models';
import { AnswersGameEntity } from '../domain/answers-game.entity';

@Injectable()
export class PairGameQuizPairsServices {
  constructor(
    protected pairGameRepository: PairGameRepository,
    protected quizQuestionsRepository: QuizQuestionsRepository,
  ) {}

  async createOrJoinPairGame(userId: string) {
    const pairGame = await this.pairGameRepository.getNotFinishedPairGameByUserId(userId);

    if (pairGame) throw new ForbiddenException();

    if (!pairGame) {
      const status: QuizPairGameStatusType = 'PendingSecondPlayer';

      const anythingPairGames: QuizPairGameEntity | null =
        await this.pairGameRepository.getPairGamesByStatus(status);

      if (anythingPairGames) {
        const questions: QuizQuestionsEntity[] =
          await this.quizQuestionsRepository.getFiveRandomQuestions()

        const secondPlayer = new UsersTable();
        secondPlayer.id = userId;

        anythingPairGames.secondPlayer = secondPlayer;
        anythingPairGames.status = 'Active';
        anythingPairGames.startGameDate = new Date();
        anythingPairGames.questions = questions;

        const activePairGame =
          await this.pairGameRepository.createPairGame(anythingPairGames);

        return createdPairGameOutputModel(activePairGame!);
      }

      const newPairGame = new QuizPairGameEntity();
      const firstPlayer = new UsersTable();

      firstPlayer.id = userId;

      newPairGame.firstPlayer = firstPlayer;
      newPairGame.pairCreatedDate = new Date();
      newPairGame.status = 'PendingSecondPlayer';

      const pendingPairGame =
        await this.pairGameRepository.createPairGame(newPairGame);

      return createdPairGameOutputModel(pendingPairGame!);
    }
  }

  async addAnswerPlayerInPairGame(userId: string, dto: InputAnswersModels) {
    const pairGame = await this.pairGameRepository.getNotFinishedAndActivePairGameByUserId(userId);

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

      if (answerPlayer.answerStatus === 'Correct')
        pairGame.firstPlayerScore++;
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

      if (answerPlayer.answerStatus === 'Correct')
        pairGame.secondPlayerScore++;
    }

    if (
      countQuestionsGame === countAnswersFirstPlayer &&
      countQuestionsGame === countAnswersSecondPlayer
    ) {
      pairGame.finishGameDate = new Date();

      pairGame.answersFirstPlayer.sort(
        (a: any, b: any) => b.addedAt - a.addedAt,
      );

      pairGame.answersSecondPlayer.sort(
        (a: any, b: any) => b.addedAt - a.addedAt,
      );

      if (
        pairGame.answersFirstPlayer[0].addedAt >
        pairGame.answersSecondPlayer[0].addedAt
      )
        pairGame.secondPlayerScore++;

      if (
        pairGame.answersFirstPlayer[0].addedAt <
        pairGame.answersSecondPlayer[0].addedAt
      )
        pairGame.firstPlayerScore++;
    }

    await this.pairGameRepository.updatePairGame(pairGame);

    return addedAnswerPlayerOutputModel(answerPlayer);
  }

  createAnswerPlayer(
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
