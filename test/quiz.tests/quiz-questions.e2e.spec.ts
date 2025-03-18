import { INestApplication } from '@nestjs/common';
import { initSettings } from '../utils/init-settings';
import {
    blogCreateModel,
    blogCreateModelWrongName,
} from '../utils/blogs-options';
import { authBasic, authBasicWrong } from '../utils/auth-options';
import {QuizQuestionsTestManager} from "../utils/quiz-questions/quiz-questions-test-manager";
import {AuthTestManager} from "../utils/auth-test-manager";
import {QuizQuestionsOptions} from "../utils/quiz-questions/quiz-questions-options";

describe('Quiz-Questions Tests (e2e)', () => {
    let app: INestApplication;
    let quizQuestionsTestManager: QuizQuestionsTestManager;
    let quizQuestionsOptions: QuizQuestionsOptions;
    let authTestManager: AuthTestManager;

    beforeAll(async () => {
        const result = await initSettings(); //(moduleBuilder) =>
        //override UsersService еще раз
        //moduleBuilder.overrideProvider(UsersService).useClass(UserServiceMock),
        app = result.app;
        quizQuestionsTestManager = result.quizQuestionsTestManager;
        quizQuestionsOptions = result.quizQuestionsOptions;
        authTestManager = result.authTestManager;
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

    it('/sa/quiz/questions (POST), should returned status 201 and correct blog model', async () => {
        const inputModel = quizQuestionsOptions.inputModel;
console.log('inputModel =', inputModel)
        const responseCreateQuizQuestion = await quizQuestionsTestManager.create(
            inputModel,
            authBasic,
        );

        await expect(responseCreateQuizQuestion.statusCode).toBe(201);

        //await quizQuestionsTestManager.expectViewModel(blogCreateModel, responseCreateQuizQuestion.body);
    });

    // it('/blogs (POST), should returned status 400 with correct error', async () => {
    //     const responseCreateBlog = await blogsTestManager.createBlog(
    //         blogCreateModelWrongName,
    //         authBasic,
    //     );
    //     console.log(responseCreateBlog.body);
    //     await expect(responseCreateBlog.statusCode).toBe(400);
    // });
    //
    // it('/blogs (POST), should returned status 401', async () => {
    //     const responseCreateBlog = await blogsTestManager.createBlog(
    //         blogCreateModel,
    //         authBasicWrong,
    //     );
    //     await expect(responseCreateBlog.statusCode).toBe(401);
    // });
});
