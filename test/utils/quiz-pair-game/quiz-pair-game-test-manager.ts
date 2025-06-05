import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PairGameQuizPairsServices } from '../../../src/features/quiz/pair-game/application/pair-game.services';
import { PairGameQueryRepository } from '../../../src/features/quiz/pair-game/infrastucture/pair-game.query.repository';

export class QuizPairGameTestManager {
  constructor(protected readonly app: INestApplication) {
    this.pairGameQuizQueryRepositories = app.get(PairGameQueryRepository, {
      strict: false,
    });

    this.pairGameQuizService = app.get(PairGameQuizPairsServices, {
      strict: false,
    });
  }

  private pairGameQuizQueryRepositories: PairGameQueryRepository;

  private pairGameQuizService: PairGameQuizPairsServices;

  async createGame(userId: string) {
    return this.pairGameQuizService.newCreatePairGame(userId);
  }

  async getGameById(id: string, userId: string) {
    return this.pairGameQuizQueryRepositories.getById(id, userId);
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

  async create(accessToken: any) {
    return request(this.app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .auth(accessToken, { type: 'bearer' });
    //.expect(200);
  }

  async getPaging(queryDto: any, auth: any) {
    return request(this.app.getHttpServer())
      .get('/sa/quiz/questions')
      .query(queryDto)
      .set(auth.type, auth.pass);
  }

  async getById(id: string, accessToken: any) {
    return request(this.app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${id}`)
      .auth(accessToken, { type: 'bearer' });
  }

  async getStatisticByUserId(accessToken: any) {
    return request(this.app.getHttpServer())
      .get(`/pair-game-quiz/users/my-statistic`)
      .auth(accessToken, { type: 'bearer' });
  }

  async getAllGamesByUserId(accessToken: any, query: any) {
    return request(this.app.getHttpServer())
      .get(`/pair-game-quiz/pairs/my`)
      .query(query)
      .auth(accessToken, { type: 'bearer' });
  }

  async getCurrentGame(accessToken: any) {
    return (
      request(this.app.getHttpServer())
        .get('/pair-game-quiz/pairs/my-current')
        //.set('Authorization', `Bearer ${accessToken}`)
        .auth(accessToken, { type: 'bearer' })
    );
  }

  async updateById() {}

  async deleteById(id: string, auth: any) {
    return request(this.app.getHttpServer())
      .delete(`/sa/quiz/questions/${id}`)
      .set(auth.type, auth.pass);
  }

  async createAnswer(accessToken: any, dto: any) {
    return request(this.app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .auth(accessToken, { type: 'bearer' })
      .send(dto);
    //.expect(200);
  }
}
