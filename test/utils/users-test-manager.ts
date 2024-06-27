import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersInputDto } from '../../src/features/users/api/models/input/users.input.dto';

export class UsersTestManager {
  constructor(protected readonly app: INestApplication) {}

  // можно выносить некоторые проверки в отдельные методы для лучшей читаемости тестов
  expectCorrectModel(createModel: any, responseModel: any) {
    expect(createModel.name).toBe(responseModel.name);
    expect(createModel.email).toBe(responseModel.email);
  }

  async createUser(adminAccessToken: string, createModel: UsersInputDto) {
    return request(this.app.getHttpServer())
      .post('/api/users')
      .auth(adminAccessToken, {
        type: 'bearer',
      })
      .send(createModel)
      .expect(200);
  }

  async updateUser(adminAccessToken: string, updateModel: any) {
    return request(this.app.getHttpServer())
      .put('/api/users')
      .auth(adminAccessToken, {
        type: 'bearer',
      })
      .send(updateModel)
      .expect(204);
  }

  async login(
    login: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await request(this.app.getHttpServer())
      .post('/login')
      .send({ login, password })
      .expect(200);

    return {
      accessToken: response.body.accessToken,
      refreshToken: response.headers['set-cookie'][0]
        .split('=')[1]
        .split(';')[0],
    };
  }
}
