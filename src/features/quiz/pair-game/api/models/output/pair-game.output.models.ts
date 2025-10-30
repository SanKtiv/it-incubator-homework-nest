import {GameQueryTopUsers, pairGameQuery} from '../input/input-query.dto';
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
    ) {
    }
}

export class PlayersProgressClass {
    constructor(
        public answers: PlayersAnswersClass[],
        public player: PlayersClass,
        public score: number = 0,
    ) {
    }
}

export class PlayersAnswersClass {
    constructor(
        public questionId: string,
        public answerStatus: string,
        public addedAt: string,
    ) {
    }
}

export class PlayersClass {
    constructor(
        public id: string,
        public login: string,
    ) {
    }
}

export class PairGameQuestionsClass {
    constructor(
        public id: string,
        public body: string,
    ) {
    }
}

export class AnswerPlayerOutputModel {
    constructor(
        public questionId: string,
        public answerStatus: 'Correct' | 'Incorrect',
        public addedAt: string,
    ) {
    }
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

        const [firstPlayer, secondPlayer] = game.players;

        return {
            id: game.id,
            firstPlayerProgress: {
                player: {
                    id: firstPlayer.user.id,
                    login: firstPlayer.user.accountData.login,
                },
                answers: answers(firstPlayer.answers),
                score: firstPlayer.score,
            },
            secondPlayerProgress: secondPlayer ?
                {
                    player: {
                        id: secondPlayer.user.id,
                        login: secondPlayer.user.accountData.login,
                    },
                    answers: answers(secondPlayer.answers),
                    score: secondPlayer.score,
                } : null,
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
            // if (!(game.status === 'Finished')) return;
            const [player] = game.players;

            statistic.sumScore += player.score;
            statistic.winsCount += player.win;
            statistic.lossesCount += player.lose;
            statistic.drawsCount += player.draw;
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

export class PlayerClass {
    constructor(
        id: string,
        login: string,
    ) {
    }
}

export class PlayerStatisticClass {
    constructor(
        sumScore: number,
        avgScores: number,
        gamesCount: number,
        winsCount: number,
        lossesCount: number,
        drawsCount: number,
        player: PlayerClass,
    ) {
    }
}

export class outputModelStatisticTopUsersClass {
    constructor(
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: PlayerStatisticClass[]
    ) {
    }
}

export const outputModelStatisticTopUsers = (
    usersStatistic: any[],
    totalPlayers: number,
    query: GameQueryTopUsers) => {
    return {
        pagesCount: Math.ceil(+totalPlayers / +query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: +totalPlayers,
        items: usersStatistic.map(e => ({
                player: {
                    id: e.userId,
                    login: e.login,
                },
                sumScore: +e.sumScore,
                avgScores: +e.avgScores,
                gamesCount: +e.gamesCount,
                winsCount: +e.winsCount,
                lossesCount: +e.lossesCount,
                drawsCount: +e.drawsCount,
            })
        )
    }
}

