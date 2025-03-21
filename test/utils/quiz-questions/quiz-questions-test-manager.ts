import {INestApplication} from '@nestjs/common';
import request from 'supertest';
import {QuizQuestionsQueryInputDto} from "../../../src/features/quiz/api/models/quiz-questions.input.dto";

export class QuizQuestionsTestManager {
    constructor(protected readonly app: INestApplication) {
    }

    async expectViewModel(inputModel: any, responseModel: any) {
        expect(responseModel).toEqual({
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            published: expect.any(Boolean),
            ...inputModel,
        });
    }

    async create(inputModel: any, auth: any) {
        return request(this.app.getHttpServer())
            .post('/sa/quiz/questions')
            .set(auth.type, auth.pass)
            .send(inputModel);
        //.expect(201)
    }

    async getPaging(queryDto: any, auth: any) {
        return request(this.app.getHttpServer())
            .get('/sa/quiz/questions')
            .query(queryDto)
            .set(auth.type, auth.pass);
    }

    async getById() {
    }

    async updateById() {
    }

    async deleteById(id: string, auth: any) {
        return request(this.app.getHttpServer())
            .delete(`/sa/quiz/questions/${id}`)
            .set(auth.type, auth.pass);
    }
}
