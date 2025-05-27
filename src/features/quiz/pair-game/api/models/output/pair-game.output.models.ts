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

export function playerStatisticOutputModel(games: QuizPairGameEntity[] | null, userId: string) {
    let sumScore = 0;
    let avgScores = 0;
    let gamesCount = 0;
    let winsCount = 0;
    let lossesCount = 0;
    let drawsCount = 0;

    if (games) {
        gamesCount = games.length;

        function find(obj: QuizPairGameEntity) {
            if (!(obj.status === 'Finished')) return

            if (obj.firstPlayerScore === obj.secondPlayerScore) drawsCount++;

            if (obj.firstPlayer.id === userId) {
                sumScore += obj.firstPlayerScore;

                if (obj.firstPlayerScore > obj.secondPlayerScore) winsCount++;
                if (obj.firstPlayerScore < obj.secondPlayerScore) lossesCount++;
            } else {
                sumScore += obj.secondPlayerScore;

                if (obj.firstPlayerScore < obj.secondPlayerScore) winsCount++;
                if (obj.firstPlayerScore > obj.secondPlayerScore) lossesCount++;
            }
        }

        games.forEach( e => find(e))

        avgScores = Math.round((sumScore / gamesCount) * 100) / 100;
    }

    return {
        sumScore: sumScore,
        avgScores: avgScores,
        gamesCount: gamesCount,
        winsCount: winsCount,
        lossesCount: lossesCount,
        drawsCount: drawsCount
    }
}

export const gamesPagingOutputModel = function (games: QuizPairGameEntity[]) {
    return games.map( game => createdPairGameOutputModel(game))
}