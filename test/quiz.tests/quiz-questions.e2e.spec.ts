import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { BlogsTestManager } from '../utils/blogs-test-manager';
import { initSettings } from '../utils/init-settings';
import {
    blogCreateModel,
    blogCreateModelWrongName,
} from '../utils/blogs-options';
import { authBasic, authBasicWrong } from '../utils/auth-options';

describe('BLOGS (e2e)', () => {
    let app: INestApplication;
    let blogsTestManager: BlogsTestManager;
    //let userTestManger: UsersTestManager;

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

    // beforeEach(async () => {
    //   const moduleFixture: TestingModule = await Test.createTestingModule({
    //     imports: [AppModule],
    //   })
    //     //.overrideProvider(UsersService)
    //     //.useValue(UserServiceMockObject)
    //     //.useClass(UserServiceMock)
    //     .compile();
    //
    //   app = moduleFixture.createNestApplication();
    //
    //   applyAppSettings(app);
    //   await app.init();
    // });

    it('/blogs (POST), should returned status 201 and correct blog model', async () => {
        const responseCreateBlog = await blogsTestManager.createBlog(
            blogCreateModel,
            authBasic,
        );

        await expect(responseCreateBlog.statusCode).toBe(201);

        blogsTestManager.expectViewModel(blogCreateModel, responseCreateBlog.body);
    });

    it('/blogs (POST), should returned status 400 with correct error', async () => {
        const responseCreateBlog = await blogsTestManager.createBlog(
            blogCreateModelWrongName,
            authBasic,
        );
        console.log(responseCreateBlog.body);
        await expect(responseCreateBlog.statusCode).toBe(400);
    });

    it('/blogs (POST), should returned status 401', async () => {
        const responseCreateBlog = await blogsTestManager.createBlog(
            blogCreateModel,
            authBasicWrong,
        );
        await expect(responseCreateBlog.statusCode).toBe(401);
    });
});
