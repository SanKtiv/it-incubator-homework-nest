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
import {QuizQuestionsQueryInputDto} from "../../src/features/quiz/questions/api/models/quiz-questions.input.dto";
import {ArrayNotContains} from "class-validator";

describe('Quiz-Questions Tests (e2e)', () => {
    let app: INestApplication;
    let quizQuestionsTestManager: QuizQuestionsTestManager;
    let quizQuestionsOptions: QuizQuestionsOptions;
    let authTestManager: AuthTestManager;

    let idExistQuestion: string = ''

    let inputModel
    let outputModel
    let inputModelWrong

    beforeAll(async () => {
        const result = await initSettings(); //(moduleBuilder) =>
        //override UsersService еще раз
        //moduleBuilder.overrideProvider(UsersService).useClass(UserServiceMock),
        app = result.app;
        quizQuestionsTestManager = result.quizQuestionsTestManager;
        quizQuestionsOptions = result.quizQuestionsOptions;
        authTestManager = result.authTestManager;
        //userTestManger = result.userTestManger;

        inputModel = quizQuestionsOptions.inputModel();
        outputModel = quizQuestionsOptions.outputModel();
        inputModelWrong = quizQuestionsOptions.inputModelWrongBodyNumber()
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
        const responseCreateQuizQuestion =
            await quizQuestionsTestManager.create(inputModel, authBasic);

        const statusCode = responseCreateQuizQuestion.statusCode
        const body = responseCreateQuizQuestion.body

        idExistQuestion = body.id;

        await expect(statusCode).toBe(201);
        await expect(body).toEqual(outputModel)
    });

    it('/sa/quiz/questions (POST), should returned status 401', async () => {
        const responseCreateQuizQuestion =
            await quizQuestionsTestManager.create(inputModel, authBasicWrong);

        const statusCode = responseCreateQuizQuestion.statusCode
        const body = responseCreateQuizQuestion.body

        await expect(statusCode).toBe(401);
        await expect(body).toEqual({});
    });

    it('/sa/quiz/questions (POST), should returned status 400 and error object', async () => {
        const responseCreateQuizQuestion =
            await quizQuestionsTestManager.create(inputModelWrong, authBasic);

        const statusCode = responseCreateQuizQuestion.statusCode
        const body = responseCreateQuizQuestion.body
console.log('error body =', body)
        await expect(statusCode).toBe(400);
    });

    it('/sa/quiz/questions (GET), should returned status 200 and correct blog model', async () => {

        const query = {
            publishedStatus: 'all',
            sortDirection: 'ASC',
            sortBy: 'createdAt',
        }

        const responseGetQuizQuestions = await quizQuestionsTestManager.getPaging(
            query,
            authBasic,
        );

        const statusCode = responseGetQuizQuestions.statusCode;
        const body = responseGetQuizQuestions.body;

        await expect(statusCode).toBe(200);
        //await expect(body).
        //     .toEqual(quizQuestionsOptions.outputModel('body', 'answer'))
    });

    it('/sa/quiz/questions/:id (DELETE), should returned status 204 and correct blog model', async () => {

        const id = idExistQuestion;

        const responseDeleteQuizQuestions =
            await quizQuestionsTestManager.deleteById(id, authBasic);

        const statusCode = responseDeleteQuizQuestions.statusCode;

        await expect(statusCode).toBe(204);

        const responseGetQuizQuestions = await quizQuestionsTestManager.getPaging(
            '',
            authBasic,
        );
        const responseBody = responseGetQuizQuestions.body
        await expect(responseBody.items).toEqual([])
    });

});
