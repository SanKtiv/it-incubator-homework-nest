import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-setting';
import { appSettings } from './settings/app-settings';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//
//   applyAppSettings(app);
//
//   await app.listen(appSettings.api.APP_PORT, () => {
//     console.log('App starting listen port: ', appSettings.api.APP_PORT);
//     console.log('ENV: ', appSettings.env.getEnv());
//   });
// }
//
// bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);

  await app.listen(appSettings.api.APP_PORT, '0.0.0.0');

  console.log('App starting listen port:', appSettings.api.APP_PORT);
  console.log('ENV:', appSettings.env.getEnv());
}

bootstrap();

