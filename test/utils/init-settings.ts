import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-setting';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { deleteAllData, deleteAllDataSQL } from './delete-all-data';
import { BlogsTestManager } from './blogs-test-manager';
import { DataSource } from 'typeorm';
import { getDataSourceName } from '@nestjs/typeorm';
import { AuthTestManager } from './auth-test-manager';
import { QuizQuestionsTestManager } from './quiz-questions/quiz-questions-test-manager';
import { QuizQuestionsOptions } from './quiz-questions/quiz-questions-options';
import { UsersTestManager } from './users-test-manager';
import { ClearDataTestingManager } from './clear-data-testing-manager';
import { QuizPairGameTestManager } from './quiz-pair-game/quiz-pair-game-test-manager';
import { QuizPairGameOptions } from './quiz-pair-game/quiz-pair-game-options';

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder,
  // если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  try {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule(
      {
        imports: [AppModule],
      },
    );
    //.overrideProvider(UsersService)
    //.useValue(UserServiceMockObject);

    if (addSettingsToModuleBuilder) {
      addSettingsToModuleBuilder(testingModuleBuilder);
    }

    const testingAppModule = await testingModuleBuilder.compile();

    const app = testingAppModule.createNestApplication();

    applyAppSettings(app);

    await app.init();

    //const databaseConnection = app.get<Connection>(getConnectionToken());
    const databaseConnection = app.get<DataSource>(DataSource);

    const httpServer = app.getHttpServer();
    const blogsTestManager = new BlogsTestManager(app);
    const authTestManager = new AuthTestManager(app);
    const quizQuestionsTestManager = new QuizQuestionsTestManager(app);
    const quizQuestionsOptions = new QuizQuestionsOptions(app);
    const quizPairGameTestManager = new QuizPairGameTestManager(app);
    const quizPairGameOptions = new QuizPairGameOptions(app);
    const userTestManger = new UsersTestManager(app);

    //чистим БД
    const clearDataTestingManager = new ClearDataTestingManager(app);
    //await deleteAllData(databaseConnection);
    //await deleteAllDataSQL(databaseConnection);

    //TODO:переписать через setState
    return {
      app,
      databaseConnection,
      httpServer,
      blogsTestManager,
      authTestManager,
      quizQuestionsTestManager,
      quizQuestionsOptions,
      quizPairGameTestManager,
      quizPairGameOptions,
      userTestManger,
      clearDataTestingManager,
    };
  } catch (error) {
    console.error('Error initializing settings:', error);
    throw error; // Пробрасываем ошибку дальше
  }
};
