import {QuizPairGameEntity} from "../../../domain/pair-game.entity";

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

export const createdPairGameOutputModel = (pairGame: QuizPairGameEntity) => ({
    id: pairGame.id,
    firstPlayerProgress: {
        player: {
            id: pairGame.firstPlayer.id,
            login: pairGame.firstPlayer.accountData.login,
        },
        answers: pairGame.answersFirstPlayer,
        score: pairGame.firstPlayerScore,
    },
    secondPlayerProgress: pairGame.secondPlayer ?
        {
            player: {
                id: pairGame.secondPlayer.id,
                login: pairGame.secondPlayer.accountData.login,
            },
            answers: pairGame.answersSecondPlayer,
            score: pairGame.secondPlayerScore ,
        }
        : null,
    questions: pairGame.questions,
    status: pairGame.status,
    pairCreatedDate: pairGame.pairCreatedDate,
    startGameDate: pairGame.startGameDate,
    finishGameDate: pairGame.finishGameDate,
})

