import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { applyAppSettings } from '../src/settings/apply-app-setting';
import { UsersTestManager } from './utils/users-test-manager';
import { initSettings } from './utils/init-settings';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userTestManger: UsersTestManager;

  beforeAll(async () => {
    const result = await initSettings((moduleBuilder) =>
      //override UsersService еще раз
      moduleBuilder.overrideProvider(UsersService).useClass(UserServiceMock),
    );
    app = result.app;
    userTestManger = result.userTestManger;
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      //.useValue(UserServiceMockObject)
      .useClass(UserServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
