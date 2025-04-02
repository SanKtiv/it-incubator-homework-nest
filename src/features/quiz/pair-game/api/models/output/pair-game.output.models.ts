export class CreatedPairGameOutputModel {
    constructor(
        public id: string,
        public firstPlayerProgress: PlayersProgressClass,
        public secondPlayerProgress: PlayersProgressClass,
        public questions: PairGameQuestionsClass[],
        public status: string,
        public pairCreatedDate: string,
        public startGameDate: string,
        public finishGameDate: string,
    ) {
    }
}

export class PlayersProgressClass {
    constructor(
        public answers: PlayersAnswersClass[],
        public player: PlayersClass,
        public score: number,
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
    },
})

