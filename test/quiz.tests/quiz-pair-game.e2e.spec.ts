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
import {
  userTest1,
  userTest2,
  userTest3,
  userTest4,
} from '../utils/users-options';
import { ClearDataTestingManager } from '../utils/clear-data-testing-manager';
import exp from 'constants';
import { pairGameQuery } from '../../src/features/quiz/pair-game/api/models/input/input-query.dto';

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
  let testAccessToken3: string;
  let testAccessToken4: string;
  let idExistPairGame1: string;
  let idExistPairGame2: string;
  let idExistPairGame3: string;
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

    inputModelMany = quizQuestionsOptions.inputModelMany(10);

    //inputModel = quizQuestionsOptions.inputModel();
    //outputModel = quizQuestionsOptions.outputModel();
    //inputModelWrong = quizQuestionsOptions.inputModelWrongBodyNumber()
  });

  afterAll(async () => {
    await app.close();
  });

  // it('TEST SERVICES PairGameQuizPairsServices, createPairGame', async () => {
  //   const userId = '8ff6e1ef-0bb0-4464-9a5d-e6f4c3791e15';
  //
  //   const game = await quizPairGameTestManager.createGame(userId);
  //   console.log(game);
  // });

  // it('TEST REPOSITORIES PairGameQueryRepositoryTypeOrm, get game by id', async () => {
  //   const id = '69b0b7af-6b0f-48d0-95df-7dd56eb3983a';
  //   const userId = '7135c4a6-3087-4584-9811-6bc0649ce3b3';
  //
  //   const game = await quizPairGameTestManager.getGameById(id, userId);
  //   console.log(game);
  // });

  it('1 /testing/all-data (DELETE), should returned status 204', async () => {
    await clearDB.clearDB();
  });

  it('2 /sa/quiz/questions (POST), should returned many question models and status 201', async () => {
    const response1 = await quizQuestionsTestManager.create(
        inputModelMany[0],
      authBasic,
    );
    const response2 = await quizQuestionsTestManager.create(
        inputModelMany[1],
      authBasic,
    );
    const response3 = await quizQuestionsTestManager.create(
        inputModelMany[2],
      authBasic,
    );
    const response4 = await quizQuestionsTestManager.create(
        inputModelMany[3],
      authBasic,
    );
    const response5 = await quizQuestionsTestManager.create(
        inputModelMany[4],
      authBasic,
    );

    await expect(response3.statusCode).toBe(201);
  });

  it('2-1 /sa/quiz/questions (POST), should returned many question models and status 201', async () => {


    const response1 = await quizQuestionsTestManager.create(
        inputModelMany[5],
        authBasic,
    );
    const response2 = await quizQuestionsTestManager.create(
        inputModelMany[6],
        authBasic,
    );
    const response3 = await quizQuestionsTestManager.create(
        inputModelMany[7],
        authBasic,
    );
    const response4 = await quizQuestionsTestManager.create(
        inputModelMany[8],
        authBasic,
    );
    const response5 = await quizQuestionsTestManager.create(
        inputModelMany[9],
        authBasic,
    );

    await expect(response3.statusCode).toBe(201);
  });

  it('3 /sa/users (POST), handler method create user1, should returned status 201 and correct user model', async () => {
    await userTestManger.adminCreateUser(userTest1, authBasic);
  });

  it('4 /sa/users (POST), handler method create user2, should returned status 201 and correct user model', async () => {
    await userTestManger.adminCreateUser(userTest2, authBasic);
  });

  it('5 /sa/users (POST), handler method create user3, should returned status 201 and correct user model', async () => {
    await userTestManger.adminCreateUser(userTest3, authBasic);
  });

  it('6 /sa/users (POST), handler method create user4, should returned status 201 and correct user model', async () => {
    await userTestManger.adminCreateUser(userTest4, authBasic);
  });

  it('7 /auth/login (POST), handler method login user1, should returned status 200 and correct access token', async () => {
    const resultLoginUser = await userTestManger.login(
      userTest1.login,
      userTest1.password,
    );

    testAccessToken1 = resultLoginUser.accessToken;
  });

  it('8 /auth/login (POST), handler method login user2, should returned status 200 and correct access token', async () => {
    const resultLoginUser = await userTestManger.login(
      userTest2.login,
      userTest2.password,
    );

    testAccessToken2 = resultLoginUser.accessToken;
  });

  it('9 /auth/login (POST), handler method login user3, should returned status 200 and correct access token', async () => {
    const resultLoginUser = await userTestManger.login(
        userTest3.login,
        userTest3.password,
    );

    testAccessToken3 = resultLoginUser.accessToken;
  });

  it('10 /auth/login (POST), handler method login user4, should returned status 200 and correct access token', async () => {
    const resultLoginUser = await userTestManger.login(
        userTest4.login,
        userTest4.password,
    );

    testAccessToken4 = resultLoginUser.accessToken;
  });

  it('11 /pair-game-quiz/pairs/connection (POST), create game №1 user1 should returned status 200', async () => {
    const resultCreatePairGame =
      await quizPairGameTestManager.create(testAccessToken1);

    await expect(resultCreatePairGame.statusCode).toBe(200)

    idExistPairGame1 = resultCreatePairGame.body.id;
  });

  it('12 /pair-game-quiz/pairs/connection (POST), connection game №1 user1 should returned status 403', async () => {
    const resultCreatePairGame =
        await quizPairGameTestManager.create(testAccessToken1);

    await expect(resultCreatePairGame.statusCode).toBe(403)
  });

  it('13 /pair-game-quiz/pairs/my-current (GET), get current game user2 should returned status 404', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getCurrentGame(testAccessToken2);

    await expect(resultGetGame.statusCode).toBe(404)
  });

  it('13-1 /pair-game-quiz/pairs/my-current (GET), get current game user1 should returned status 200', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getCurrentGame(testAccessToken1);

    //console.log('current game =', resultGetGame.body)

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('14 /pair-game-quiz/pairs/:id (GET), get game by user2 should returned status 403', async () => {
    const resultGetGame = await quizPairGameTestManager.getById(
        idExistPairGame1,
        testAccessToken2,
    );

    await expect(resultGetGame.statusCode).toBe(403)
  });

  it('15 /pair-game-quiz/pairs/connection (POST), join to game №1 user2 should returned status 200', async () => {
    const resultCreatePairGame = await quizPairGameTestManager.create(testAccessToken2);
//console.log('created active game =', resultCreatePairGame.body)
    await expect(resultCreatePairGame.statusCode).toBe(200)
  });

  it('16 /pair-game-quiz/pairs/:id (GET), get game user2 should returned status 200', async () => {
    const resultGetGame = await quizPairGameTestManager.getById(
        idExistPairGame1,
        testAccessToken2,
    );

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('17 /pair-game-quiz/pairs/my-current/answers (POST), user1 add correct answer first, should return status 200', async () => {
    const result = await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Answer_1',
    })

    await expect(result.statusCode).toBe(200)
  });

  it('18 /pair-game-quiz/pairs/:id (GET), get game user1 should returned status 200, and one correct answer', async () => {
    const resultGetGame = await quizPairGameTestManager.getById(
        idExistPairGame1,
        testAccessToken1,
    );

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('19 /pair-game-quiz/pairs/my-current (GET), get current game user2 should returned status 200', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getCurrentGame(testAccessToken2);

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('20 /pair-game-quiz/pairs/my-current/answers (POST), user2 add correct answer first, should return status 200', async () => {
    const result = await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Answer_1',
    })

    await expect(result.statusCode).toBe(200)
  });

  it('20-1 /pair-game-quiz/pairs/my-current (GET), get current game user2 should returned status 200', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getCurrentGame(testAccessToken2);

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('21 /pair-game-quiz/pairs/my-current/answers (POST), user1 add 1 incorrect answer', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Wrong answer_1',
    })
  });

  it('21-1 /pair-game-quiz/pairs/my-current (GET), get current game user1 should returned status 200', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getCurrentGame(testAccessToken1);

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('22 /pair-game-quiz/pairs/my-current/answers (POST), user1 add 2 incorrect answer', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Wrong answer_2',
    })
  });

  it('23 /pair-game-quiz/pairs/my-current/answers (POST), user1 add 3 incorrect answer', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Wrong answer_3',
    })
  });

  it('24 /pair-game-quiz/pairs/my-current/answers (POST), user1 add 4 incorrect answer', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Wrong answer_4',
    })
  });

  it('21-1 /pair-game-quiz/pairs/my-current (GET), get current game user1 should returned status 200', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getCurrentGame(testAccessToken1);

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('25 /pair-game-quiz/pairs/my-current/answers (POST), user2 add 1 incorrect answer', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Wrong answer_1',
    })
  });

  it('26 /pair-game-quiz/pairs/my-current/answers (POST), user2 add 2 incorrect answer', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Wrong answer_2',
    })
  });

  it('27 /pair-game-quiz/pairs/my-current/answers (POST), user2 add 3 incorrect answer', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Wrong answer_3',
    })
  });

  it('28 /pair-game-quiz/pairs/my-current/answers (POST), user2 add 4 incorrect answer', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Wrong answer_4',
    })

    const result = await quizPairGameTestManager.getById(idExistPairGame1, testAccessToken2)


  });

  it('28-1 /pair-game-quiz/pairs/:id (GET), get game1 by id and user1 should returned status 200', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getById(idExistPairGame1, testAccessToken1);

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('28-2 /pair-game-quiz/users/my-statistic (GET), get statistic by user1 should returned status 200', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getStatisticByUserId(testAccessToken1);

    await expect(resultGetGame.statusCode).toBe(200)
  });

  it('29 /pair-game-quiz/pairs/connection (POST), create game №2 user3 should returned status 200', async () => {
    const resultCreatePairGame =
        await quizPairGameTestManager.create(testAccessToken3);

    await expect(resultCreatePairGame.statusCode).toBe(200)

    idExistPairGame2 = resultCreatePairGame.body.id;
  });

  it('30 /pair-game-quiz/pairs/connection (POST), join game №2 user4 should returned status 200', async () => {
    const resultCreatePairGame =
        await quizPairGameTestManager.create(testAccessToken4);

    await expect(resultCreatePairGame.statusCode).toBe(200)
  });

  it('31 /pair-game-quiz/pairs/connection (POST), create game №3 user1 should returned status 200', async () => {
    const resultCreatePairGame =
        await quizPairGameTestManager.create(testAccessToken1);

    await expect(resultCreatePairGame.statusCode).toBe(200)

    idExistPairGame3 = resultCreatePairGame.body.id;
  });

  it('32 /pair-game-quiz/pairs/connection (POST), join to game №3 user2 should returned status 200', async () => {
    const resultCreatePairGame = await quizPairGameTestManager.create(testAccessToken2);

    await expect(resultCreatePairGame.statusCode).toBe(200)
  });

  it('33 /pair-game-quiz/pairs/my-current/answers (POST), user1 add 1 incorrect answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Wrong answer_3',
    })
  });

  it('34 /pair-game-quiz/pairs/my-current/answers (POST), user1 add 2 incorrect answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Wrong answer_3',
    })
  });

  it('35 /pair-game-quiz/pairs/my-current/answers (POST), user1 add 3 incorrect answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Wrong answer_3',
    })
  });

  it('36 /pair-game-quiz/pairs/my-current/answers (POST), user1 add 4 correct answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Answer_2',
    })
  });

  it('37 /pair-game-quiz/pairs/my-current/answers (POST), user1 add 5 correct answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken1, {
      answer: 'Answer_2',
    })
  });

  it('38 /pair-game-quiz/pairs/my-current/answers (POST), user2 add 1 incorrect answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Wrong answer_3',
    })
  });

  it('39 /pair-game-quiz/pairs/my-current/answers (POST), user2 add 2 incorrect answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Wrong answer_3',
    })
  });

  it('40 /pair-game-quiz/pairs/my-current/answers (POST), user2 add 3 incorrect answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Wrong answer_3',
    })
  });

  it('41 /pair-game-quiz/pairs/my-current/answers (POST), user2 add 4 correct answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Answer_2',
    })
  });

  it('42 /pair-game-quiz/pairs/my-current/answers (POST), user2 add 5 correct answer in game№3', async () => {
    await quizPairGameTestManager.createAnswer(testAccessToken2, {
      answer: 'Answer_2',
    })
  });

  it('42-1 /pair-game-quiz/pairs/connection (POST), create game №4 user1 should returned status 200', async () => {
    const resultCreatePairGame =
        await quizPairGameTestManager.create(testAccessToken1);

    await expect(resultCreatePairGame.statusCode).toBe(200)
  });

  it('43 /pair-game-quiz/pairs/my (GET), get my all games by user1 should returned status 200', async () => {
    const resultGetGame =
        await quizPairGameTestManager.getAllGamesByUserId(testAccessToken1, {sortBy: 'status', sortDirection: 'ASC'});

    // const result =
    //     await quizPairGameTestManager.getStatisticByUserId(testAccessToken1);
    // console.log('Statistic user1 =', result.body)

    const questions0: any = resultGetGame.body.items;
    const id = questions0[0].id

    const game = await quizPairGameTestManager.getById(id, testAccessToken1);

    //console.log('All games for user1-1 =', questions0[0].questions)
    //console.log('get questions game by id =', game.body.questions)
    await expect(resultGetGame.statusCode).toBe(200)
  });

  // it('43-1 /pair-game-quiz/pairs/my (GET), get my all games by user1 should returned status 200', async () => {
  //   const resultGetGame =
  //       await quizPairGameTestManager.getAllGamesByUserId(testAccessToken1, {sortBy: 'status', sortDirection: 'ASC'});
  //
  //   const questions0: any = resultGetGame.body.items;
  //
  //   console.log('All games for user1-2 =', questions0[0].questions)
  // });
  //
  // it('43-2 /pair-game-quiz/pairs/my (GET), get my all games by user1 should returned status 200', async () => {
  //   const resultGetGame =
  //       await quizPairGameTestManager.getAllGamesByUserId(testAccessToken1, {sortBy: 'status', sortDirection: 'ASC'});
  //
  //   const questions0: any = resultGetGame.body.items;
  //
  //   console.log('All games for user1-3 =', questions0[0].questions)
  // });

  // it('13 /pair-game-quiz/pairs/connection (POST), create game №2 user3 should returned status 200', async () => {
  //   const resultCreatePairGame =
  //       await quizPairGameTestManager.create(testAccessToken3);
  //
  //   idExistPairGame2 = resultCreatePairGame.body.id;
  // });
  //
  // it('14 /pair-game-quiz/pairs/my-current (GET), get current game user4 should returned status 404', async () => {
  //   const resultGetGame =
  //       await quizPairGameTestManager.getCurrentGame(testAccessToken4);
  //
  //   await expect(resultGetGame.statusCode).toBe(404)
  // });
  //
  // it('15 /pair-game-quiz/pairs/connection (POST), join to game №2 user4 should returned status 200', async () => {
  //       const resultCreatePairGame = await quizPairGameTestManager.create(testAccessToken4);
  //
  //   await expect(resultCreatePairGame.statusCode).toBe(200)
  // });
  //
  // it('18 /pair-game-quiz/pairs/:id (GET), get game user1, should returned status 200 and correct pair-game model', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //     idExistPairGame1,
  //     testAccessToken1,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(200)
  // });
  //
  // it('19 /pair-game-quiz/pairs/:id (GET), get game user1, should returned status 404', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //       '5edb51d3-f34a-4551-b1ff-cdfa20809946',
  //       testAccessToken1,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(404)
  // });
  //
  // it('20 /pair-game-quiz/pairs/:id (GET), get game for first player, should returned status 401', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //       idExistPairGame1,
  //       `${testAccessToken1}1`,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(401)
  // });
  //
  // it('21 /pair-game-quiz/pairs/connection (POST), join to game №1 user2 should returned status 403', async () => {
  //   const resultCreatePairGame =
  //     await quizPairGameTestManager.create(testAccessToken2);
  //
  //   await expect(resultCreatePairGame.statusCode).toBe(403)
  // });
  //

  //
  // it('24 /pair-game-quiz/pairs/:id (GET), get game for first player, should returned status 200 and correct pair-game model', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //       idExistPairGame1,
  //       testAccessToken1,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(200)
  // });
  //
  // it('25 /pair-game-quiz/pairs/:id (GET), get game for second player, should returned status 200 and correct pair-game model', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //       idExistPairGame1,
  //       testAccessToken2,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(200)
  // });
  //
  // it('26 /pair-game-quiz/pairs/my-current/answers (POST), user2 add incorrect answer, should return status 200', async () => {
  //   const result = await quizPairGameTestManager.createAnswer(testAccessToken2, {
  //     answer: 'Answer_5',
  //   });
  //
  //   await expect(result.statusCode).toBe(200)
  // });
  //
  // it('27 /pair-game-quiz/pairs/:id (GET), get game for first player, should returned status 200 and correct pair-game model', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //       idExistPairGame1,
  //       testAccessToken1,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(200)
  // });
  //
  // it('28 /pair-game-quiz/pairs/:id (GET), get game for second player, should returned status 200 and correct pair-game model', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //       idExistPairGame1,
  //       testAccessToken2,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(200)
  // });
  //
  // it('29 /pair-game-quiz/pairs/my-current/answers (POST), second players correct answer, should return status 200', async () => {
  //   await quizPairGameTestManager.createAnswer(testAccessToken2, {
  //     answer: 'Answer_5',
  //   });
  // });
  //
  // it('30 /pair-game-quiz/pairs/:id (GET), get game for first player, should returned status 200 and correct pair-game model', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //       idExistPairGame1,
  //       testAccessToken1,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(200)
  // });
  //
  // it('31 /pair-game-quiz/pairs/:id (GET), get game for second player, should returned status 200 and correct pair-game model', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //       idExistPairGame1,
  //       testAccessToken2,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(200)
  // });
  //
  // it('32 /pair-game-quiz/pairs/my-current/answers (POST), first and second players answer two, should return status 200', async () => {
  //   await quizPairGameTestManager.createAnswer(testAccessToken1, {
  //     answer: `Answer_2`,
  //   });
  // });
  //
  // it('33 /pair-game-quiz/pairs/my-current/answers (POST), first and second players correct answer three, should return status 200', async () => {
  //   await quizPairGameTestManager.createAnswer(testAccessToken1, {
  //     answer: `Answer_3`,
  //   });
  //   await quizPairGameTestManager.createAnswer(testAccessToken2, {
  //     answer: `Answer_3`,
  //   });
  // });
  //
  // it('34 /pair-game-quiz/pairs/my-current/answers (POST), first and second players answer four, should return status 200', async () => {
  //   await quizPairGameTestManager.createAnswer(testAccessToken1, {
  //     answer: `Answer_4`,
  //   });
  //   await quizPairGameTestManager.createAnswer(testAccessToken2, {
  //     answer: `Answer_4`,
  //   });
  // });
  //
  // it('35 /pair-game-quiz/pairs/my-current/answers (POST), first players incorrect answer five, should return status 200, and return model', async () => {
  //   await quizPairGameTestManager.createAnswer(testAccessToken1, {
  //     answer: `Answer_5`,
  //   });
  // });
  //
  // it('36 /pair-game-quiz/pairs/my-current/answers (POST), second players incorrect answer five, should return status 200, and return model', async () => {
  //   await quizPairGameTestManager.createAnswer(
  //       testAccessToken2,
  //       { answer: `Answer_5` },
  //   );
  // });
  //
  // it('37 /pair-game-quiz/pairs/:id (GET), get game for first player, should returned status 200 and correct pair-game model', async () => {
  //   const resultGetGame = await quizPairGameTestManager.getById(
  //       idExistPairGame1,
  //       testAccessToken1,
  //   );
  //
  //   await expect(resultGetGame.statusCode).toBe(200)
  // });
  //
  // it('38 /pair-game-quiz/pairs/my-current (GET), get current game for first player should returned status 404', async () => {
  //   const resultGetGame =
  //       await quizPairGameTestManager.getCurrentGame(testAccessToken1);
  //
  //   await expect(resultGetGame.statusCode).toBe(404)
  // });
  //
  // it('39 /pair-game-quiz/pairs/my-current (GET), get current game for second player should returned status 404', async () => {
  //   const resultGetGame =
  //       await quizPairGameTestManager.getCurrentGame(testAccessToken2);
  //
  //   await expect(resultGetGame.statusCode).toBe(404)
  // });
});
