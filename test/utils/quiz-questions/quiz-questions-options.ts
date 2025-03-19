import {INestApplication} from "@nestjs/common";

export class QuizQuestionsOptions {
    constructor(protected readonly app: INestApplication) {}

    inputModel = (body: string, correctAnswer: string) => ({
        body: `Question ${body}`,
        correctAnswers: [`${correctAnswer}1, ${correctAnswer}2, ${correctAnswer}3`]
    })

    inputModelWrong = (body: string | number, correctAnswer: string) => ({
        body: `Question ${body}`,
        correctAnswers: [`${correctAnswer}1, ${correctAnswer}2, ${correctAnswer}3`]
    })

    outputModel = (body: string, correctAnswer: string) => ({
        id: expect.any(String),
        published: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: null,
        ...this.inputModel(body, correctAnswer),
    })


}