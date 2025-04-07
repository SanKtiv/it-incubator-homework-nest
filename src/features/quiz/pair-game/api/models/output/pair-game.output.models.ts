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

export const createdPairGameOutputModel = (pairGame: any) => ({
    id: pairGame.id,
    firstPlayerProgress: {
        player: {
            id: pairGame.firstPlayerId,
            login: pairGame.firstPlayerLogin,
        },
        answers: [],
        score: pairGame.firstPlayerScore ?? 0,
    },
    secondPlayerProgress: pairGame.secondPlayerId ?
        {
            player: {
                id: pairGame.secondPlayerId,
                login: pairGame.secondPlayerLogin,
            },
            answers: [],
            score: pairGame.secondPlayerScore ?? 0,
        }
        : null,
    questions: pairGame.questions,
    status: pairGame.status,
    pairCreatedDate: pairGame.pairCreatedDate,
    startGameDate: pairGame.startGameDate,
    finishGameDate: pairGame.finishGameDate,
})

