import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { applyAppSettings } from '../src/settings/apply-app-setting';
import { UsersTestManager } from './utils/users-test-manager';
import { initSettings } from './utils/init-settings';
import { BlogsTestManager } from './utils/blogs-test-manager';
import { blogCreateModel } from './utils/blogs-options';
import {Test, TestingModule} from "@nestjs/testing";

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let blogsTestManager: BlogsTestManager;
  //let userTestManger: UsersTestManager;

  const blog = {
    name: 'newBlog',
    description: 'description',
    websiteUrl: 'abc@mail.com'
  }

  beforeAll(async () => {
    const result = await initSettings(); //(moduleBuilder) =>
    //override UsersService еще раз
    //moduleBuilder.overrideProvider(UsersService).useClass(UserServiceMock),
    app = result.app;
    blogsTestManager = result.blogsTestManager;
    //userTestManger = result.userTestManger;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      //.overrideProvider(UsersService)
      //.useValue(UserServiceMockObject)
      //.useClass(UserServiceMock)
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

  it('/sa/blogs (POST)', () => {
    return request(app.getHttpServer())
        .post('/sa/blogs')
        .send(blog)
        .expect(201)
        .expect({...blog});
  });

  // it('/blogs (POST)', async () => {
  //   const responseCreateBlog = await blogsTestManager.createBlog(blogCreateModel)
  //   blogsTestManager.expectViewModel(blogCreateModel, responseCreateBlog.body)
  //   //console.log(responseCreateBlog.body)
  // });
});
