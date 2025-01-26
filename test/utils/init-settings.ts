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
    //const userTestManger = new UsersTestManager(app);

    //чистим БД
    //await deleteAllData(databaseConnection);
    await deleteAllDataSQL(databaseConnection);

    //TODO:переписать через setState
    return {
      app,
      databaseConnection,
      httpServer,
      blogsTestManager,
      authTestManager,
      //userTestManger,
    };
  } catch (error) {
    console.error('Error initializing settings:', error);
    throw error; // Пробрасываем ошибку дальше
  }
};
