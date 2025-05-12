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
    console.log('Start addAnswerPlayerInPairGame')
    const pairGame = await this.pairGameRepository.getActivePairGameByUserId(userId);
    console.log('getActivePairGameByUserId(userId) is work')
    if (!pairGame) throw new ForbiddenException();

    const countQuestionsGame: number = pairGame.questions.length;
    console.log('1')
    let countAnswersFirstPlayer: number = pairGame.answersFirstPlayer.length;
    console.log('2')
    let countAnswersSecondPlayer: number = pairGame.answersSecondPlayer.length;
    console.log('3')
    let answerPlayer: AnswersGameEntity = new AnswersGameEntity();
    console.log('4')

    if (pairGame.firstPlayer.id === userId) {
      if (countAnswersFirstPlayer === countQuestionsGame)
        throw new ForbiddenException();
      console.log('5')
      answerPlayer = this.createAnswerPlayer(
        pairGame,
        userId,
        dto,
        countAnswersFirstPlayer,
      );
      console.log('6')
      pairGame.answersFirstPlayer.push(answerPlayer);
      console.log('7')
      countAnswersFirstPlayer = pairGame.answersFirstPlayer.length;
      console.log('8')

      if (answerPlayer.answerStatus === 'Correct')
        pairGame.firstPlayerScore++;
    }
    console.log('First if is work')
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
    console.log('Second if is work')
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

      const correctAnswersFirstPlayer = pairGame.answersFirstPlayer
          .find(e => e.answerStatus === 'Correct')

      const correctAnswersSecondPlayer = pairGame.answersSecondPlayer
          .find(e => e.answerStatus === 'Correct')

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
    console.log('Third if is work')
    await this.pairGameRepository.updatePairGame(pairGame);
    console.log('updatePairGame(pairGame) is work')
    return addedAnswerPlayerOutputModel(answerPlayer);
  }

  createAnswerPlayer(
    pairGame: QuizPairGameEntity,
    userId: string,
    dto: InputAnswersModels,
    numQuestion: number,
  ): AnswersGameEntity {
    console.log('21')
    const questionId = pairGame.questions[numQuestion].id;
    console.log('22')
    const arrayCorrectAnswers =
      pairGame.questions[numQuestion].correctAnswers.split(',');
    console.log('23')
    const answerPlayer = new AnswersGameEntity();
    console.log('24')
    answerPlayer.userId = userId;
    answerPlayer.questionId = questionId;
    answerPlayer.addedAt = new Date();
    console.log('25')
    const str = (str: string) => str.trim().toLowerCase();
    console.log('26')
    const resultFind: string | undefined = arrayCorrectAnswers.find(
      (e) => str(e) === str(dto.answer),
    );
    console.log('27')
    answerPlayer.answerStatus = resultFind ? 'Correct' : 'Incorrect';
    console.log('28')
    return answerPlayer;
  }
}
