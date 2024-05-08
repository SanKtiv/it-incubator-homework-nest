import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {applyAppSettings} from "./settings/apply-app-setting";

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    applyAppSettings(app)
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
}

bootstrap();
