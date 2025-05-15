import { QuizPairGameEntity } from '../../../domain/pair-game.entity';
import {AnswersGameEntity} from "../../../domain/answers-game.entity";

export class CreatedPairGameOutputModel {
  constructor(
    public id: string,
    public firstPlayerProgress: PlayersProgressClass,
    public secondPlayerProgress: PlayersProgressClass | null = null,
    public questions: PairGameQuestionsClass[] | null = null,
    public status: string,
    public pairCreatedDate: string,
    public startGameDate: string | null = null,
    public finishGameDate: string | null = null,
  ) {}
}

export class PlayersProgressClass {
  constructor(
    public answers: PlayersAnswersClass[],
    public player: PlayersClass,
    public score: number = 0,
  ) {}
}

export class PlayersAnswersClass {
  constructor(
    public questionId: string,
    public answerStatus: string,
    public addedAt: string,
  ) {}
}

export class PlayersClass {
  constructor(
    public id: string,
    public login: string,
  ) {}
}

export class PairGameQuestionsClass {
  constructor(
    public id: string,
    public body: string,
  ) {}
}

export class AnswerPlayerOutputModel {
    constructor(
        public questionId: string,
        public answerStatus: 'Correct' | 'Incorrect',
        public addedAt: string
    ) {}
}

export const createdPairGameOutputModel = (
  pairGame: QuizPairGameEntity,
): CreatedPairGameOutputModel => ({
  id: pairGame.id,
  firstPlayerProgress: {
    player: {
      id: pairGame.firstPlayer.id,
      login: pairGame.firstPlayer.accountData.login,
    },
    answers: pairGame.answersFirstPlayer
        .sort((a: any, b: any) => a.addedAt - b.addedAt)
        .map((e) => ({
      questionId: e.questionId,
      answerStatus: e.answerStatus,
      addedAt: e.addedAt.toISOString(),
    })),
    score: pairGame.firstPlayerScore,
  },
  secondPlayerProgress: pairGame.secondPlayer
    ? {
        player: {
          id: pairGame.secondPlayer.id,
          login: pairGame.secondPlayer.accountData.login,
        },
        answers: pairGame.answersSecondPlayer
            .sort((a: any, b: any) => a.addedAt - b.addedAt)
            .map((e) => ({
          questionId: e.questionId,
          answerStatus: e.answerStatus,
          addedAt: e.addedAt.toISOString(),
        })),
        score: pairGame.secondPlayerScore,
      }
    : null,
  questions: pairGame.questions.length !== 0
    ? pairGame.questions.map((e) => ({
        id: e.id,
        body: e.body,
      }))
    : null,
  status: pairGame.status,
  pairCreatedDate: pairGame.pairCreatedDate.toISOString(),
  startGameDate: pairGame.startGameDate
    ? pairGame.startGameDate.toISOString()
    : null,
  finishGameDate: pairGame.finishGameDate
    ? pairGame.finishGameDate.toISOString()
    : null,
});

export const addedAnswerPlayerOutputModel =
    (answerPlayer: AnswersGameEntity): AnswerPlayerOutputModel => ({
        questionId: answerPlayer.questionId,
        answerStatus: answerPlayer.answerStatus,
        addedAt: answerPlayer.addedAt.toISOString()
    })
