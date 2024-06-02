import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-setting';
import { SessionBuilder } from '@ngrok/ngrok';
import { Logger } from '@nestjs/common';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     stopAtFirstError: true,
  //     exceptionFactory: (inputErrorsArray) => {
  //       const resultErrorsArray = inputErrorsArray.map((e) => {
  //         const keysMessages = Object.keys(e.constraints as any);
  //         return keysMessages.map((m) => ({
  //           message: e.constraints?.[m],
  //           field: e.property,
  //         }));
  //       });
  //       throw new BadRequestException(resultErrorsArray.flat());
  //     },
  //   }),
  // );
  // app.useGlobalFilters(new ErrorsFilter());
  await app.listen(port);

  // Setup ngrok ingress
  // const session = await new SessionBuilder().authtokenFromEnv().connect();
  // const listener = await session.httpEndpoint().listen();
  // new Logger('main').log(`Ingress established at ${listener.url()}`);
  // await listener.forward(`localhost:${port}`);
}

bootstrap();
