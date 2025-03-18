import {INestApplication} from '@nestjs/common';
import request from 'supertest';

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

    async getPaging() {
    }

    async getById() {
    }

    async updateById() {
    }

    async deleteById() {
    }
}
