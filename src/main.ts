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

  const PORT = process.env.PORT || appSettings.api.APP_PORT;

  console.log('App starting listen port:', PORT);
  console.log('ENV:', appSettings.env.getEnv());

  await app.listen(PORT, '0.0.0.0');

  console.log('SERVER STARTED');
}

bootstrap();

