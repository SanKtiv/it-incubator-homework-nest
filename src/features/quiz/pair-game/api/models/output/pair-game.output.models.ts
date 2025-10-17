import { pairGameQuery } from '../input/input-query.dto';
import {PairGamesEntity} from "../../../domain/pair-games.entity";
import {PlayerAnswersEntity} from "../../../domain/player-answers.entity";

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

export const outputModelCreatedPairGame =
    function (game: PairGamesEntity) {
  const answers = (ans) => ans.map((e) => ({
        questionId: e.questionId,
        answerStatus: e.answerStatus,
        addedAt: e.addedAt.toISOString(),
      }))

  const questions = game.questions && game.questions.length > 0
      ? game.questions.map((e) => ({
        id: e.question.id,
        body: e.question.body,
      }))
      : null

  return {
    id: game.id,
    firstPlayerProgress: {
      player: {
        id: game.firstPlayer.players.user.id,
        login: game.firstPlayer.players.user.accountData.login,
      },
      answers: answers(game.firstPlayer.answers),
      score: game.firstPlayer.gameScore[0].score,
    },
    secondPlayerProgress: game.secondPlayer ?
        {
          player: {
            id: game.secondPlayer.players.user.id,
            login: game.secondPlayer.players.user.accountData.login,
          },
          answers: answers(game.secondPlayer.answers),
          score: game.secondPlayer.gameScore[0].score,
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

export const addedAnswerPlayerOutputModel = (
  answerPlayer: PlayerAnswersEntity,
): AnswerPlayerOutputModel => ({
  questionId: answerPlayer.questionId,
  answerStatus: answerPlayer.answerStatus,
  addedAt: answerPlayer.addedAt.toISOString(),
});

export function outputModelPlayerStatistic(
    games: PairGamesEntity[] | null | undefined,
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

        function find(game: PairGamesEntity) {
            if (!(game.status === 'Finished')) return;

            if (game.firstPlayer.gameScore[0].score === game.secondPlayer!.gameScore[0].score)
                statistic.drawsCount++;

            if (game.firstPlayer.players.user.id === userId) {
                statistic.sumScore += game.firstPlayer.gameScore[0].score;

                if (game.firstPlayer.gameScore[0].score > game.secondPlayer!.gameScore[0].score)
                    statistic.winsCount++;

                if (game.firstPlayer.gameScore[0].score < game.secondPlayer!.gameScore[0].score)
                    statistic.lossesCount++;
            } else {
                statistic.sumScore += game.secondPlayer!.gameScore[0].score;

                if (game.firstPlayer.gameScore[0].score < game.secondPlayer!.gameScore[0].score)
                    statistic.winsCount++;

                if (game.firstPlayer.gameScore[0].score > game.secondPlayer!.gameScore[0].score)
                    statistic.lossesCount++;
            }
        }

        games.forEach((game) => find(game));

        statistic.avgScores =
            Math.round((statistic.sumScore / statistic.gamesCount) * 100) / 100;
    }

    return statistic;
}

export const outputModelPairGamesPagination = function (
    games: PairGamesEntity[],
    query: pairGameQuery,
    totalGames: number,
) {
    return {
        pagesCount: Math.ceil(+totalGames / +query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: +totalGames,
        items: games.map((game) => outputModelCreatedPairGame(game)),
    };
};
