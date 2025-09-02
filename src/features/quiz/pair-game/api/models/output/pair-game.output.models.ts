import { QuizPairGameEntity } from '../../../domain/pair-game.entity';
import { AnswersGameEntity } from '../../../domain/answers-game.entity';
import { pairGameQuery } from '../input/input-query.dto';
import {NewPairGameEntity} from "../../../domain/new-pair-game.entity";
import {PlayerAnswersEntity} from "../../../domain/new-player-answers.entity";
import {length} from "class-validator";

export class CreatedPairGameOutputModel {
  constructor(
    public id: string,
    public firstPlayerProgress: PlayersProgressClass,
    public secondPlayerProgress: PlayersProgressClass | null,
    public questions: PairGameQuestionsClass[] | null,
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
    public addedAt: string,
  ) {}
}

export const newCreatedPairGameOutputModel =
    function (game: NewPairGameEntity) {
  const answers = (ans) => ans.map((e) => ({
        questionId: e.questionId,
        answerStatus: e.answerStatus,
        addedAt: e.addedAt.toISOString(),
      }))

  const questions = game.questions.length > 0
      ? game.questions.map((e) => ({
        id: e.questions.id,
        body: e.questions.body,
      }))
      : null

  return {
    id: game.id,
    firstPlayerProgress: {
      player: {
        id: game.firstPlayer.user.id,
        login: game.firstPlayer.user.accountData.login,
      },
      answers: answers(game.firstPlayer.answers),
      score: game.firstPlayer.playerScore,
    },
    secondPlayerProgress: game.secondPlayer ?
        {
          player: {
            id: game.secondPlayer.user.id,
            login: game.secondPlayer.user.accountData.login,
          },
          answers: answers(game.secondPlayer.answers),
          score: game.secondPlayer.playerScore,
        } : game.secondPlayer,
    questions: questions,
    status: game.status,
    pairCreatedDate: game.pairCreatedDate.toISOString(),
    startGameDate: game.startGameDate ?
        game.startGameDate.toISOString() :
        game.startGameDate,
    finishGameDate: game.finishGameDate ?
        game.finishGameDate.toISOString() :
        game.finishGameDate
  }
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
  questions:
    pairGame.questions.length !== 0
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

export const addedAnswerPlayerOutputModel = (
  answerPlayer: AnswersGameEntity | PlayerAnswersEntity,
): AnswerPlayerOutputModel => ({
  questionId: answerPlayer.questionId,
  answerStatus: answerPlayer.answerStatus,
  addedAt: answerPlayer.addedAt.toISOString(),
});

export function playerStatisticOutputModel(
  games: QuizPairGameEntity[] | null,
  userId: string,
) {
  let sumScore = 0;
  let avgScores = 0;
  let gamesCount = 0;
  let winsCount = 0;
  let lossesCount = 0;
  let drawsCount = 0;

  if (games) {
    gamesCount = games.length;

    function find(obj: QuizPairGameEntity) {
      if (!(obj.status === 'Finished')) return;

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

    games.forEach((e) => find(e));

    avgScores = Math.round((sumScore / gamesCount) * 100) / 100;
  }

  return {
    sumScore: sumScore,
    avgScores: avgScores,
    gamesCount: gamesCount,
    winsCount: winsCount,
    lossesCount: lossesCount,
    drawsCount: drawsCount,
  };
}

export function newPlayerStatisticOutputModel(
    games: NewPairGameEntity[] | null | undefined,
    userId: string,
) {
    const statistic = {
        sumScore: 0,
        avgScores: 0,
        gamesCount: 0,
        winsCount: 0,
        lossesCount: 0,
        drawsCount: 0,
    }

    if (games) {
        statistic.gamesCount = games.length;

        function find(game: NewPairGameEntity) {
            if (!(game.status === 'Finished')) return;

            if (game.firstPlayer.playerScore === game.secondPlayer!.playerScore)
                statistic.drawsCount++;

            if (game.firstPlayer.user.id === userId) {
                statistic.sumScore += game.firstPlayer.playerScore;

                if (game.firstPlayer.playerScore > game.secondPlayer!.playerScore)
                    statistic.winsCount++;

                if (game.firstPlayer.playerScore < game.secondPlayer!.playerScore)
                    statistic.lossesCount++;
            } else {
                statistic.sumScore += game.secondPlayer!.playerScore;

                if (game.firstPlayer.playerScore < game.secondPlayer!.playerScore)
                    statistic.winsCount++;

                if (game.firstPlayer.playerScore > game.secondPlayer!.playerScore)
                    statistic.lossesCount++;
            }
        }

        games.forEach((game) => find(game));

        statistic.avgScores =
            Math.round((statistic.sumScore / statistic.gamesCount) * 100) / 100;
    }

    return statistic;
}

export const gamesPagingOutputModel = function (
  games: QuizPairGameEntity[],
  query: pairGameQuery,
  totalGames: number,
) {
  return {
    pagesCount: Math.ceil(+totalGames / +query.pageSize),
    page: query.pageNumber,
    pageSize: query.pageSize,
    totalCount: +totalGames,
    items: games.map((game) => createdPairGameOutputModel(game)),
  };
};

export const newGamesPagingOutputModel = function (
    games: NewPairGameEntity[],
    query: pairGameQuery,
    totalGames: number,
) {
    return {
        pagesCount: Math.ceil(+totalGames / +query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: +totalGames,
        items: games.map((game) => newCreatedPairGameOutputModel(game)),
    };
};
