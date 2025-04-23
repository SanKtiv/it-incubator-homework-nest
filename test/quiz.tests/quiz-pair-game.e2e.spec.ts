import { INestApplication } from '@nestjs/common';
import { initSettings } from '../utils/init-settings';
import {
  blogCreateModel,
  blogCreateModelWrongName,
} from '../utils/blogs-options';
import { authBasic, authBasicWrong } from '../utils/auth-options';
import { QuizQuestionsTestManager } from '../utils/quiz-questions/quiz-questions-test-manager';
import { AuthTestManager } from '../utils/auth-test-manager';
import { QuizQuestionsOptions } from '../utils/quiz-questions/quiz-questions-options';
import { QuizQuestionsQueryInputDto } from '../../src/features/quiz/questions/api/models/quiz-questions.input.dto';
import { ArrayNotContains } from 'class-validator';
import { QuizPairGameTestManager } from '../utils/quiz-pair-game/quiz-pair-game-test-manager';
import { QuizPairGameOptions } from '../utils/quiz-pair-game/quiz-pair-game-options';
import { UsersTestManager } from '../utils/users-test-manager';
import { userTest1, userTest2 } from '../utils/users-options';
import { ClearDataTestingManager } from '../utils/clear-data-testing-manager';

describe('QUIZ-PAIR-GAME TESTS (e2e)', () => {
  let app: INestApplication;
  let quizPairGameTestManager: QuizPairGameTestManager;
  let quizPairGameOptions: QuizPairGameOptions;
  let authTestManager: AuthTestManager;
  let userTestManger: UsersTestManager;
  let quizQuestionsTestManager: QuizQuestionsTestManager;
  let quizQuestionsOptions: QuizQuestionsOptions;

  let clearDB: ClearDataTestingManager;

  let testAccessToken1: string;
  let testAccessToken2: string;
  let idExistPairGame: string;
  const idExistQuestion: string = '';

  let inputModel;
  let outputModel;
  let inputModelWrong;
  let inputModelMany;

  beforeAll(async () => {
    const result = await initSettings(); //(moduleBuilder) =>
    //override UsersService еще раз
    //moduleBuilder.overrideProvider(UsersService).useClass(UserServiceMock),
    app = result.app;
    quizPairGameTestManager = result.quizPairGameTestManager;
    quizPairGameOptions = result.quizPairGameOptions;
    authTestManager = result.authTestManager;
    userTestManger = result.userTestManger;
    quizQuestionsTestManager = result.quizQuestionsTestManager;
    quizQuestionsOptions = result.quizQuestionsOptions;

    clearDB = result.clearDataTestingManager;

    inputModelMany = quizQuestionsOptions.inputModelMany(5);
    //inputModel = quizQuestionsOptions.inputModel();
    //outputModel = quizQuestionsOptions.outputModel();
    //inputModelWrong = quizQuestionsOptions.inputModelWrongBodyNumber()
  });

  afterAll(async () => {
    await app.close();
  });

  it('/testing/all-data (DELETE), should returned status 204', async () => {
    await clearDB.clearDB();
  });

  it('/sa/quiz/questions (POST), should returned many question models and status 201', async () => {
    const [inputModel1, inputModel2, inputModel3, inputModel4, inputModel5] =
      inputModelMany;

    const response1 = await quizQuestionsTestManager.create(
      inputModel1,
      authBasic,
    );
    const response2 = await quizQuestionsTestManager.create(
      inputModel2,
      authBasic,
    );
    const response3 = await quizQuestionsTestManager.create(
      inputModel3,
      authBasic,
    );
    const response4 = await quizQuestionsTestManager.create(
      inputModel4,
      authBasic,
    );
    const response5 = await quizQuestionsTestManager.create(
      inputModel5,
      authBasic,
    );

    await expect(response3.statusCode).toBe(201);
  });

  it('/sa/users (POST), handler method create user1, should returned status 201 and correct user model', async () => {
    await userTestManger.adminCreateUser(userTest1, authBasic);
  });

  it('/sa/users (POST), handler method create user2, should returned status 201 and correct user model', async () => {
    await userTestManger.adminCreateUser(userTest2, authBasic);
  });

  it('/auth/login (POST), handler method login user1, should returned status 200 and correct access token', async () => {
    const resultLoginUser = await userTestManger.login(
      userTest1.login,
      userTest1.password,
    );

    testAccessToken1 = resultLoginUser.accessToken;
  });

  it('/auth/login (POST), handler method login user2, should returned status 200 and correct access token', async () => {
    const resultLoginUser = await userTestManger.login(
      userTest2.login,
      userTest2.password,
    );

    testAccessToken2 = resultLoginUser.accessToken;
  });

  it('/pair-game-quiz/pairs/connection (POST), connection first player should returned status 201 and correct pair-game model', async () => {
    const resultCreatePairGame =
      await quizPairGameTestManager.create(testAccessToken1);

    idExistPairGame = resultCreatePairGame.body.id;
  });

  it('/pair-game-quiz/pairs/my-current (GET), get current game for second player should returned status 404', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getCurrentGame(testAccessToken2);

    await expect(resultGetGame.statusCode).toBe(404)
  });

  it('/pair-game-quiz/pairs/:id (GET), get game for second player should returned status 403', async () => {
    const resultGetGame = await quizPairGameTestManager.getById(
        idExistPairGame,
        testAccessToken2,
    );

    await expect(resultGetGame.statusCode).toBe(403)
  });

  it('/pair-game-quiz/pairs/:id (GET), get game for first player, should returned status 200 and correct pair-game model', async () => {
    const resultGetGame = await quizPairGameTestManager.getById(
      idExistPairGame,
      testAccessToken1,
    );

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('/pair-game-quiz/pairs/:id (GET), get game for first player, should returned status 404', async () => {
    const resultGetGame = await quizPairGameTestManager.getById(
        `${idExistPairGame}1`,
        testAccessToken1,
    );

    await expect(resultGetGame.statusCode).toBe(404)
  });

  it('/pair-game-quiz/pairs/:id (GET), get game for first player, should returned status 401', async () => {
    const resultGetGame = await quizPairGameTestManager.getById(
        idExistPairGame,
        `${testAccessToken1}1`,
    );

    await expect(resultGetGame.statusCode).toBe(401)
  });

  it('/pair-game-quiz/pairs/connection (POST), connection second player should returned status 201 and correct pair-game model', async () => {
    const resultCreatePairGame =
      await quizPairGameTestManager.create(testAccessToken2);

    const body = resultCreatePairGame.body;

    // await expect(statusCode).toBe(201);
    // await expect(body).toEqual(outputModel)
  });

  it('/pair-game-quiz/pairs/:id (GET), get game for second player should returned status 200', async () => {
    const resultGetGame = await quizPairGameTestManager.getById(
        idExistPairGame,
        testAccessToken2,
    );

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('/pair-game-quiz/pairs/my-current/answers (POST), first and second players answer one, should return status 200', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Answer_1',
    });
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Answer_1',
    });
  });

  it('/pair-game-quiz/pairs/my-current/answers (POST), first and second players answer two, should return status 200', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: `Answer_2`,
    });
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: `Answer_2`,
    });
  });

  it('/pair-game-quiz/pairs/my-current/answers (POST), first and second players answer three, should return status 200', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: `Answer_3`,
    });
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: `Answer_3`,
    });
  });

  it('/pair-game-quiz/pairs/my-current/answers (POST), first and second players answer four, should return status 200', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: `Answer_4`,
    });
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: `Answer_4`,
    });
  });

  it('/pair-game-quiz/pairs/my-current/answers (POST), first and second players answer five, should return status 200, and return model', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: `Answer_5`,
    });
    const resultCreateAnswer = await quizPairGameTestManager.createAnswer(
      testAccessToken2,
      { answer: `Answer_5` },
    );

    const id = resultCreateAnswer.body.id;

    const resultGetPairGame = await quizPairGameTestManager.getById(
      id,
      testAccessToken1,
    );
  });
});
