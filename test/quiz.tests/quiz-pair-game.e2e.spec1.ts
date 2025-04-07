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
import {QuizPairGameTestManager} from "../utils/quiz-pair-game/quiz-pair-game-test-manager";
import {QuizPairGameOptions} from "../utils/quiz-pair-game/quiz-pair-game-options";
import {UsersTestManager} from "../utils/users-test-manager";
import {userTest1, userTest2} from "../utils/users-options";
import {ClearDataTestingManager} from "../utils/clear-data-testing-manager";

describe('QUIZ-PAIR-GAME TESTS (e2e)', () => {
    let app: INestApplication;
    let quizPairGameTestManager: QuizPairGameTestManager;
    let quizPairGameOptions: QuizPairGameOptions;
    let authTestManager: AuthTestManager;
    let userTestManger: UsersTestManager;

    let clearDB: ClearDataTestingManager;

    let testAccessToken1: string;
    let testAccessToken2: string;
    let idExistPairGame: string;
    let idExistQuestion: string = ''

    let inputModel
    let outputModel
    let inputModelWrong

    beforeAll(async () => {
        const result = await initSettings(); //(moduleBuilder) =>
        //override UsersService еще раз
        //moduleBuilder.overrideProvider(UsersService).useClass(UserServiceMock),
        app = result.app;
        quizPairGameTestManager = result.quizPairGameTestManager;
        quizPairGameOptions = result.quizPairGameOptions;
        authTestManager = result.authTestManager;
        userTestManger = result.userTestManger;

        clearDB = result.clearDataTestingManager;

        //inputModel = quizQuestionsOptions.inputModel();
        //outputModel = quizQuestionsOptions.outputModel();
        //inputModelWrong = quizQuestionsOptions.inputModelWrongBodyNumber()
    });

    afterAll(async () => {
        await app.close();
    });

    it('/testing/all-data (DELETE), should returned status 204', async () => {
        await clearDB.clearDB();
    })

    it('/sa/users (POST), handler method create user1, should returned status 201 and correct user model', async () => {
        await userTestManger.adminCreateUser(userTest1, authBasic);
    })

    it('/sa/users (POST), handler method create user2, should returned status 201 and correct user model', async () => {
        await userTestManger.adminCreateUser(userTest2, authBasic);
    })

    it('/auth/login (POST), handler method login user1, should returned status 200 and correct access token', async () => {
            const resultLoginUser =
                await userTestManger.login(userTest1.login, userTest1.password);

            testAccessToken1 = resultLoginUser.accessToken;
    })

    it('/auth/login (POST), handler method login user2, should returned status 200 and correct access token', async () => {
        const resultLoginUser =
            await userTestManger.login(userTest2.login, userTest2.password);

        testAccessToken2 = resultLoginUser.accessToken;
    })

    it('/pair-game-quiz/pairs/connection (POST), connection first player should returned status 201 and correct pair-game model', async () => {
        const resultCreatePairGame =
            await quizPairGameTestManager.create(testAccessToken1);

        const body = resultCreatePairGame.body

console.log('first player created pair game =', body)
        idExistPairGame = body.id;
        //
        // await expect(statusCode).toBe(201);
        // await expect(body).toEqual(outputModel)
    });

    it('/pair-game-quiz/pairs/:id (GET), should returned status 200 and correct pair-game model', async () => {
        const resultGetPairGame =
            await quizPairGameTestManager.getById(idExistPairGame, testAccessToken1);

        //console.log('resultGetPairGame =', resultGetPairGame.body)
    })

    it('/pair-game-quiz/pairs/connection (POST), connection second player should returned status 201 and correct pair-game model', async () => {
        const resultCreatePairGame =
            await quizPairGameTestManager.create(testAccessToken2);

        const body = resultCreatePairGame.body

        console.log('second player join to pair game =', body)
        // idExistQuestion = body.id;
        //
        // await expect(statusCode).toBe(201);
        // await expect(body).toEqual(outputModel)
    });
});
