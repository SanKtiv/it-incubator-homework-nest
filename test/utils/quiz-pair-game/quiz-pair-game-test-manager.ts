import {INestApplication} from '@nestjs/common';
import request from 'supertest';

export class QuizPairGameTestManager {
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

    async create(accessToken: any, auth: any) {
        return request(this.app.getHttpServer())
            .post('/pair-game-quiz/pairs/connection')
            .auth(accessToken, {
                type: 'bearer',
            })
            .expect(201)
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
