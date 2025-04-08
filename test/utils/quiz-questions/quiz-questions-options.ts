import {INestApplication} from "@nestjs/common";

export class QuizQuestionsOptions {
    constructor(protected readonly app: INestApplication) {}

    inputModel = () => ({
        body: 'Question_1',
        correctAnswers: ['Answer_1, Answer_2, Answer_3']
    })

    inputModelWrongBodyNumber = () => ({
        body: 1234567890,
        correctAnswers: this.inputModel().correctAnswers,
    })

    inputModelMany(count: number) {
        const array = []
        for( let i = 1; i <= count; i++) {
            const element = this.inputModel()
            element.body += `${i}`
            array.push(element)
        }
        return array
    }

    outputModel = () => ({
        id: expect.any(String),
        published: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: null,
        ...this.inputModel(),
    })


}