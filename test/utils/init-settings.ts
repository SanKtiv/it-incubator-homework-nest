import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-setting';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { deleteAllData, deleteAllDataSQL } from './delete-all-data';
import { BlogsTestManager } from './blogs-test-manager';
import { DataSource } from 'typeorm';
import { getDataSourceName } from '@nestjs/typeorm';

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder,
  // если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });
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
  const databaseConnection = app.get<DataSource>(getDataSourceName);

  const httpServer = app.getHttpServer();
  const blogsTestManager = new BlogsTestManager(app);
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
    //userTestManger,
  };
};
