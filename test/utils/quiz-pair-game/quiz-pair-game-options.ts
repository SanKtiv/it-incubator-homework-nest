import {INestApplication} from "@nestjs/common";

export class QuizPairGameOptions {
    constructor(protected readonly app: INestApplication) {}

    inputModel = () => ({
        body: 'Question_1',
        correctAnswers: ['Answer_1, Answer_2, Answer_3']
    })

    inputModelWrongBodyNumber = () => ({
        body: 1234567890,
        correctAnswers: this.inputModel().correctAnswers,
    })



    outputModel = () => ({
        id: expect.any(String),
        published: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: null,
        ...this.inputModel(),
    })


}