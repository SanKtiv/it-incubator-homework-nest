import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { applyAppSettings } from '../src/settings/apply-app-setting';
import { UsersTestManager } from './utils/users-test-manager';
import { initSettings } from './utils/init-settings';
import { BlogsTestManager } from './utils/blogs-test-manager';
import { blogCreateModel } from './utils/blogs-options';
import {Test, TestingModule} from "@nestjs/testing";
import {UsersInputDto} from "../src/features/users/api/models/input/users.input.dto";
import {AuthTestManager} from "./utils/auth-test-manager";
import {userTest} from "./utils/users-options";


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let blogsTestManager: BlogsTestManager;
  let authTestManager: AuthTestManager;
  //let userTestManger: UsersTestManager;

  const blog = {
    name: 'newBlog',
    description: 'description',
    websiteUrl: 'https://abc.com'
  }

  const passBasic = `Basic YWRtaW46cXdlcnR5`;

  const user = {
    login: 'User_1',
    password: 'Qwerty_1',
    email: 'email@ya_1.com'
  }


  beforeAll(async () => {
    const result = await initSettings(); //(moduleBuilder) =>
    //override UsersService еще раз
    //moduleBuilder.overrideProvider(UsersService).useClass(UserServiceMock),
    app = result.app;
    blogsTestManager = result.blogsTestManager;
    authTestManager = result.authTestManager;
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

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/sa/blogs (POST)', async () => {
    const createUser = await request(app.getHttpServer())
        .post('/sa/blogs')
        .set('Authorization', passBasic)
        .send(blog)
        //.expect(201)

    await expect(createUser.statusCode).toBe(201)
    await expect(createUser.body).toEqual({
      ...blog,
      id: expect.any(String),
      createdAt: expect.any(String),
      isMembership: false
    })
  });

  // Tests Auth

  it('/auth/registration (Post)', async () => {
    const result = await authTestManager.registration(userTest)
    console.log('result =', result.text)

    await expect(result.statusCode).toBe(204)
    await expect(result.body).toEqual({})
  });

  // it('/blogs (POST)', async () => {
  //   const responseCreateBlog = await blogsTestManager.createBlog(blogCreateModel)
  //   blogsTestManager.expectViewModel(blogCreateModel, responseCreateBlog.body)
  //   //console.log(responseCreateBlog.body)
  // });
});
