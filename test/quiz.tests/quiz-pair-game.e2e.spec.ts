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
import {userTest} from "../utils/users-options";

describe('QUIZ-PAIR-GAME TESTS (e2e)', () => {
    let app: INestApplication;
    let quizPairGameTestManager: QuizPairGameTestManager;
    let quizPairGameOptions: QuizPairGameOptions;
    let authTestManager: AuthTestManager;
    let userTestManger: UsersTestManager;

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

        //inputModel = quizQuestionsOptions.inputModel();
        //outputModel = quizQuestionsOptions.outputModel();
        //inputModelWrong = quizQuestionsOptions.inputModelWrongBodyNumber()
    });

    afterAll(async () => {
        await app.close();
    });

    it('/sa/quiz/questions (POST), should returned status 201 and correct blog model', async () => {
        await userTestManger.adminCreateUser(userTest, authBasic)

        const resultLoginUser =
            await userTestManger.login(userTest.login, userTest.password);

        const accessToken = resultLoginUser.accessToken;

        const resultCreatePairGame =
            await quizPairGameTestManager.create(accessToken, authBasic);

        const body = resultCreatePairGame.body

        idExistQuestion = body.id;

        await expect(statusCode).toBe(201);
        await expect(body).toEqual(outputModel)
    });
});
