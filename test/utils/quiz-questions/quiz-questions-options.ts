import {INestApplication} from "@nestjs/common";

export class QuizQuestionsOptions {
    constructor(protected readonly app: INestApplication) {}

    inputModel: {
        body: 'question body',
        correctAnswers: ['yes, body, question']
    }

}