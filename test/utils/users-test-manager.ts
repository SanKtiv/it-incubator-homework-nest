import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class UsersTestManager {
  constructor(protected readonly app: INestApplication) {}
  // можно выносить некоторые проверки в отдельные методы для лучшей читаемости тестов
  expectCorrectModel(createModel: any, responseModel: any) {
    expect(createModel.name).toBe(responseModel.name);
    expect(createModel.email).toBe(responseModel.email);
  }

  async createUser(adminAccessToken: string, createModel: UserCreateModel) {
    return request(this.app.getHttpServer())
      .post('/api/users')
      .auth(adminAccessToken, {
        type: 'bearer',
      })
      .send(createModel)
      .expect(200);
  }
  //...
}
